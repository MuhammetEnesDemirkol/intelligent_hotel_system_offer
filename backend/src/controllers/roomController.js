const pool = require("../config/db");

// Tüm odaları getir (listelemek için)
const getAllRooms = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        room_number,
        room_type,
        capacity,
        price_per_night,
        status,
        image_url,
        description,
        bed_type,
        has_ac,
        has_wifi,
        has_minibar,
        has_balcony,
        view
      FROM rooms 
      ORDER BY room_number
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Odalar alınamadı" });
  }
};

// Tüm odaları getir
const getRoomsWithTodayStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { rows } = await pool.query(
      `
      SELECT 
        r.id,
        r.room_number,
        r.room_type,
        r.capacity,
        r.price_per_night,
        r.status,
        r.image_url,
        r.description,
        r.bed_type,
        r.has_ac,
        r.has_wifi,
        r.has_minibar,
        r.has_balcony,
        r.view,
        EXISTS (
          SELECT 1 FROM reservations res
          WHERE res.room_id = r.id
          AND $1::date = res.check_in
          AND res.status IN ('pending', 'checked-in')
        ) AS is_reserved_today,
        (
          SELECT res.status
          FROM reservations res
          WHERE res.room_id = r.id
          AND $1::date = res.check_in
          AND res.status IN ('pending', 'checked-in')
          LIMIT 1
        ) AS reservation_status
      FROM rooms r
      ORDER BY room_number
    `,
      [today]
    );

    // Oda durumlarını güncelle
    const updatedRows = rows.map((room) => {
      if (room.is_reserved_today) {
        if (room.reservation_status === "checked-in") {
          room.status = "occupied";
        } else if (room.reservation_status === "pending") {
          room.status = "reserved";
        }
      }
      return room;
    });

    res.json(updatedRows);
  } catch (err) {
    console.error("Oda durumu alınamadı:", err);
    res.status(500).json({ error: "Oda durumu alınamadı" });
  }
};

// Tek odayı getir (detay)
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `
      SELECT 
        id,
        room_number,
        room_type,
        capacity,
        price_per_night,
        status,
        image_url,
        description,
        bed_type,
        has_ac,
        has_wifi,
        has_minibar,
        has_balcony,
        view
      FROM rooms 
      WHERE id = $1
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Oda bulunamadı" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Oda detay alınamadı:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Yeni oda ekle
const createRoom = async (req, res) => {
  const {
    room_number,
    room_type,
    capacity,
    price_per_night,
    status,
    image_url,
    description,
    bed_type,
    has_ac,
    has_wifi,
    has_minibar,
    has_balcony,
    view,
  } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO rooms (
        room_number,
        room_type,
        capacity,
        price_per_night,
        status,
        image_url,
        description,
        bed_type,
        has_ac,
        has_wifi,
        has_minibar,
        has_balcony,
        view
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        room_number,
        room_type,
        capacity,
        price_per_night,
        status,
        image_url,
        description,
        bed_type,
        has_ac,
        has_wifi,
        has_minibar,
        has_balcony,
        view,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Oda eklenemedi:", error);
    res.status(500).json({ error: "Oda eklenemedi" });
  }
};

// Oda bilgilerini güncelle
const updateRoom = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    // Önce mevcut oda bilgilerini al
    const { rows: existingRoom } = await pool.query(
      "SELECT * FROM rooms WHERE id = $1",
      [id]
    );

    if (existingRoom.length === 0) {
      return res.status(404).json({ error: "Oda bulunamadı" });
    }

    // Güncellenecek alanları belirle
    const fieldsToUpdate = {
      room_number: updateFields.room_number ?? existingRoom[0].room_number,
      room_type: updateFields.room_type ?? existingRoom[0].room_type,
      capacity: updateFields.capacity ?? existingRoom[0].capacity,
      price_per_night:
        updateFields.price_per_night ?? existingRoom[0].price_per_night,
      status: updateFields.status ?? existingRoom[0].status,
      image_url: updateFields.image_url ?? existingRoom[0].image_url,
      description: updateFields.description ?? existingRoom[0].description,
      bed_type: updateFields.bed_type ?? existingRoom[0].bed_type,
      has_ac: updateFields.has_ac ?? existingRoom[0].has_ac,
      has_wifi: updateFields.has_wifi ?? existingRoom[0].has_wifi,
      has_minibar: updateFields.has_minibar ?? existingRoom[0].has_minibar,
      has_balcony: updateFields.has_balcony ?? existingRoom[0].has_balcony,
      view: updateFields.view ?? existingRoom[0].view,
    };

    // Güncelleme sorgusunu oluştur
    const { rows } = await pool.query(
      `UPDATE rooms
       SET room_number = $1,
           room_type = $2,
           capacity = $3,
           price_per_night = $4,
           status = $5,
           image_url = $6,
           description = $7,
           bed_type = $8,
           has_ac = $9,
           has_wifi = $10,
           has_minibar = $11,
           has_balcony = $12,
           view = $13
       WHERE id = $14 RETURNING *`,
      [
        fieldsToUpdate.room_number,
        fieldsToUpdate.room_type,
        fieldsToUpdate.capacity,
        fieldsToUpdate.price_per_night,
        fieldsToUpdate.status,
        fieldsToUpdate.image_url,
        fieldsToUpdate.description,
        fieldsToUpdate.bed_type,
        fieldsToUpdate.has_ac,
        fieldsToUpdate.has_wifi,
        fieldsToUpdate.has_minibar,
        fieldsToUpdate.has_balcony,
        fieldsToUpdate.view,
        id,
      ]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Oda güncellenemedi:", error);
    res.status(500).json({ error: "Oda güncellenemedi" });
  }
};

// Oda sil
const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM rooms WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Oda silinemedi" });
  }
};

// Oda kategori özetleri (örnek odalar + uygunluk durumu)
const getRoomSummaries = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (room_type, capacity)
        id,
        room_number,
        room_type,
        capacity,
        price_per_night,
        status,
        image_url,
        description,
        bed_type,
        has_ac,
        has_wifi,
        has_minibar,
        has_balcony,
        view
      FROM rooms
      ORDER BY room_type, capacity, status = 'available' DESC, id ASC
    `);

    const today = new Date().toISOString().split("T")[0];

    const enriched = await Promise.all(
      rows.map(async (room) => {
        // Bugün bu oda rezerve mi?
        const todayRes = await pool.query(
          `
          SELECT 1 FROM reservations
          WHERE room_id = $1
          AND $2::date BETWEEN check_in AND check_out
          AND status IN ('pending', 'checked-in')
        `,
          [room.id, today]
        );

        // Bugün check-out yapılan rezervasyon var mı?
        const todayCheckout = await pool.query(
          `
          SELECT 1 FROM reservations
          WHERE room_id = $1
          AND check_out = $2::date
          AND status = 'checked-out'
        `,
          [room.id, today]
        );

        // Eğer bugün check-out yapıldıysa veya hiç rezervasyon yoksa oda müsait
        room.status =
          todayRes.rowCount > 0 && todayCheckout.rowCount === 0
            ? "reserved"
            : "available";

        if (room.status === "reserved") {
          // Oda rezerve ise, en erken müsait olacağı tarihi bul
          const nextAvailable = await pool.query(
            `
            SELECT check_out AS next_available
            FROM reservations
            WHERE room_id = $1 
            AND check_out >= $2::date
            AND status IN ('pending', 'checked-in')
            ORDER BY check_out ASC
            LIMIT 1
          `,
            [room.id, today]
          );

          room.next_available = nextAvailable.rows[0]?.next_available || null;
        }

        return room;
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("Oda özetleri alınamadı:", err);
    res.status(500).json({ error: "Oda özetleri alınamadı" });
  }
};

const checkRoomAvailabilityForMonth = async (req, res) => {
  const { id } = req.params;
  const { month, year } = req.query;

  try {
    // Ayın ilk ve son gününü hesapla
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    // Bu tarih aralığındaki rezervasyonları getir
    const reservations = await pool.query(
      `SELECT check_in, check_out, status 
       FROM reservations 
       WHERE room_id = $1 
       AND (
         (check_in BETWEEN $2 AND $3) 
         OR (check_out BETWEEN $2 AND $3)
         OR (check_in <= $2 AND check_out >= $3)
       )
       AND status IN ('pending', 'checked-in', 'checked-out')`,
      [id, firstDay, lastDay]
    );

    // Ayın tüm günlerini oluştur
    const daysInMonth = new Date(year, month, 0).getDate();
    const availability = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dateStr = currentDate.toISOString().split("T")[0];

      // Bugün için check-out yapılan rezervasyon var mı?
      const todayCheckout = reservations.rows.some(
        (reservation) =>
          reservation.status === "checked-out" &&
          new Date(reservation.check_out).toISOString().split("T")[0] ===
            dateStr
      );

      // Bugün için aktif rezervasyon var mı?
      const isReserved = reservations.rows.some((reservation) => {
        const checkIn = new Date(reservation.check_in);
        const checkOut = new Date(reservation.check_out);
        return (
          currentDate >= checkIn &&
          currentDate <= checkOut &&
          reservation.status !== "checked-out"
        );
      });

      // Eğer bugün check-out yapıldıysa veya hiç rezervasyon yoksa oda müsait
      const isAvailable = !isReserved || todayCheckout;

      availability.push({
        date: dateStr,
        is_available: isAvailable,
      });
    }

    res.json(availability);
  } catch (error) {
    console.error("Müsaitlik kontrolü sırasında hata:", error);
    res.status(500).json({ error: "Müsaitlik durumu kontrol edilemedi" });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomSummaries,
  getRoomsWithTodayStatus,
  checkRoomAvailabilityForMonth,
};
