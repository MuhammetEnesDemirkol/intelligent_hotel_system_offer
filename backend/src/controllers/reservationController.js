const pool = require("../config/db");

// Tüm rezervasyonları getir
const getAllReservations = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        reservations.*, 
        users.full_name, 
        rooms.room_number,
        rooms.room_type,
        rooms.price_per_night
      FROM reservations
      JOIN users ON reservations.customer_id = users.id
      JOIN rooms ON reservations.room_id = rooms.id
      ORDER BY reservations.check_in DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Rezervasyonlar listelenemedi" });
  }
};

// Rezervasyon kontrolü
const checkRoomAvailability = async (room_id, check_in, check_out) => {
  console.log("Oda müsaitlik kontrolü:", { room_id, check_in, check_out });

  const { rows } = await pool.query(
    `
    SELECT * FROM reservations 
    WHERE room_id = $1 
    AND (
      (check_in <= $2 AND check_out >= $2) OR
      (check_in <= $3 AND check_out >= $3) OR
      (check_in >= $2 AND check_out <= $3)
    )
    AND status NOT IN ('canceled', 'checked-out')
  `,
    [room_id, check_in, check_out]
  );

  console.log("Müsaitlik kontrolü sonucu:", { isAvailable: rows.length === 0 });
  return rows.length === 0;
};

// Yeni rezervasyon oluştur
const createReservation = async (req, res) => {
  const { customer_id, room_id, check_in, check_out, total_price } = req.body;

  console.log("Yeni rezervasyon oluşturuluyor:", {
    customer_id,
    room_id,
    check_in,
    check_out,
    total_price,
  });

  try {
    // Tarih kontrolü
    if (new Date(check_in) >= new Date(check_out)) {
      return res
        .status(400)
        .json({ error: "Çıkış tarihi giriş tarihinden sonra olmalıdır" });
    }

    // Oda müsaitlik kontrolü
    const isAvailable = await checkRoomAvailability(
      room_id,
      check_in,
      check_out
    );
    if (!isAvailable) {
      return res
        .status(400)
        .json({ error: "Bu tarihler arasında oda müsait değil" });
    }

    // Transaction başlat
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Rezervasyon oluştur
      const { rows } = await client.query(
        `INSERT INTO reservations (customer_id, room_id, check_in, check_out, total_price, status)
         VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
        [customer_id, room_id, check_in, check_out, total_price]
      );

      console.log("Rezervasyon oluşturuldu:", rows[0]);

      // Ödeme kaydı oluştur
      const paymentResult = await client.query(
        `INSERT INTO payments (
          customer_id, 
          customer_name, 
          customer_email, 
          reservation_id, 
          amount, 
          status, 
          payment_date
        ) 
        SELECT 
          $1, 
          u.full_name, 
          u.email, 
          $2, 
          $3, 
          'completed', 
          CURRENT_DATE
        FROM users u
        WHERE u.id = $1
        RETURNING *`,
        [customer_id, rows[0].id, total_price]
      );

      console.log("Ödeme kaydı oluşturuldu:", paymentResult.rows[0]);

      // Oda durumunu güncelle
      const today = new Date().toISOString().split("T")[0];
      const checkInDate = new Date(check_in).toISOString().split("T")[0];

      console.log("Tarih kontrolü:", {
        today,
        checkInDate,
        isFuture: checkInDate >= today,
      });

      // Eğer rezervasyon bugün veya gelecekte ise oda durumunu güncelle
      if (checkInDate === today) {
        console.log("Oda durumu güncelleniyor: reserved");
        await client.query(
          `UPDATE rooms SET status = 'reserved' WHERE id = $1`,
          [room_id]
        );
      }

      await client.query("COMMIT");
      console.log("Transaction başarıyla tamamlandı");
      res.status(201).json(rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction hatası:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Rezervasyon oluşturma hatası:", error);
    res.status(500).json({ error: "Rezervasyon oluşturulamadı" });
  }
};

const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { customer_id, room_id, check_in, check_out, total_price } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE reservations 
       SET customer_id = $1, room_id = $2, check_in = $3, check_out = $4, total_price = $5 
       WHERE id = $6 RETURNING *`,
      [customer_id, room_id, check_in, check_out, total_price, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Rezervasyon güncellenemedi" });
  }
};

// Rezervasyonu güncelle
const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Transaction başlat
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Rezervasyon durumunu güncelle
      const { rows } = await client.query(
        `UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
      );

      const room_id = rows[0].room_id;

      console.log("Rezervasyon durumu güncelleniyor:", { status, room_id });

      // Rezervasyon durumuna göre oda durumunu güncelle
      switch (status) {
        case "canceled":
          // İptal edildiğinde oda durumunu "available" olarak güncelle
          await client.query(
            `UPDATE rooms SET status = 'available' WHERE id = $1`,
            [room_id]
          );
          console.log("Oda durumu güncellendi: available (iptal)");
          break;

        case "checked-in":
          // Giriş yapıldığında oda durumunu "occupied" olarak güncelle
          await client.query(
            `UPDATE rooms SET status = 'occupied' WHERE id = $1`,
            [room_id]
          );
          console.log("Oda durumu güncellendi: occupied");
          break;

        case "checked-out":
          // Çıkış yapıldığında oda durumunu "maintenance" olarak güncelle
          await client.query(
            `UPDATE rooms SET status = 'maintenance' WHERE id = $1`,
            [room_id]
          );
          console.log("Oda durumu güncellendi: maintenance");

          // Temizlik kaydı oluştur veya güncelle
          const checkResult = await client.query(
            "SELECT 1 FROM housekeeping WHERE room_id = $1",
            [room_id]
          );

          if (checkResult.rowCount === 0) {
            // Kayıt yoksa, yeni kayıt oluştur
            await client.query(
              `INSERT INTO housekeeping (room_id, status, last_cleaned) 
               VALUES ($1, 'dirty', CURRENT_TIMESTAMP)`,
              [room_id]
            );
          } else {
            // Kayıt varsa, güncelle
            await client.query(
              `UPDATE housekeeping SET status = 'dirty', last_cleaned = CURRENT_TIMESTAMP WHERE room_id = $1`,
              [room_id]
            );
          }
          console.log("Temizlik kaydı güncellendi: dirty");
          break;

        case "pending":
          // Beklemede olduğunda oda durumunu "reserved" olarak güncelle
          await client.query(
            `UPDATE rooms SET status = 'reserved' WHERE id = $1`,
            [room_id]
          );
          console.log("Oda durumu güncellendi: reserved");
          break;
      }

      await client.query("COMMIT");
      res.json(rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Rezervasyon güncellenemedi:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Rezervasyon güncellenemedi:", err);
    res.status(500).json({ error: "Durum güncellenemedi" });
  }
};

// Rezervasyonu sil
const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Rezervasyon silinemedi" });
  }
};

const getWeeklyReservations = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        TO_CHAR(check_in, 'Dy') AS day,
        COUNT(*) AS count
      FROM reservations
      WHERE check_in >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY day
      ORDER BY MIN(check_in)
    `);

    const labels = rows.map((r) => r.day);
    const values = rows.map((r) => parseInt(r.count));

    res.json({ labels, values });
  } catch (err) {
    res.status(500).json({ error: "Haftalık veriler alınamadı" });
  }
};

// Geçmiş rezervasyonları getir
const getPastReservations = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        reservations.*, 
        users.full_name, 
        rooms.room_number,
        rooms.room_type,
        rooms.price_per_night
      FROM reservations
      JOIN users ON reservations.customer_id = users.id
      JOIN rooms ON reservations.room_id = rooms.id
      WHERE reservations.check_out < CURRENT_DATE
      ORDER BY reservations.check_in DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Geçmiş rezervasyonlar listelenemedi" });
  }
};

// Aktif rezervasyonları getir
const getActiveReservations = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        reservations.*, 
        users.full_name, 
        rooms.room_number,
        rooms.room_type,
        rooms.price_per_night
      FROM reservations
      JOIN users ON reservations.customer_id = users.id
      JOIN rooms ON reservations.room_id = rooms.id
      WHERE reservations.check_out >= CURRENT_DATE
      AND reservations.status = 'active'
      ORDER BY reservations.check_in ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Aktif rezervasyonlar listelenemedi" });
  }
};

module.exports = {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  getWeeklyReservations,
  getPastReservations,
  getActiveReservations,
  checkRoomAvailability,
};
