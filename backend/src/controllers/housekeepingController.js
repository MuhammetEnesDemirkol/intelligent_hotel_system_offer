const pool = require("../config/db");

// Tüm temizlik kayıtlarını getir
const getAllHousekeeping = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id,
        r.room_number,
        r.room_type,
        r.status as room_status,
        COALESCE(h.status, 'clean') as cleaning_status,
        COALESCE(h.last_cleaned, CURRENT_TIMESTAMP) as last_cleaned
      FROM rooms r
      LEFT JOIN housekeeping h ON r.id = h.room_id
      ORDER BY r.room_number
    `);

    console.log("Temizlik sayfası odaları:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Temizlik kayıtları getirilemedi:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Güncelle
const updateHousekeeping = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status alanı zorunludur." });
  }

  try {
    // Transaction başlat
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Önce oda var mı kontrol et
      const roomCheck = await client.query(
        "SELECT status FROM rooms WHERE id = $1",
        [id]
      );

      if (roomCheck.rowCount === 0) {
        return res.status(404).json({ error: "Oda bulunamadı." });
      }

      console.log("Oda durumu kontrolü:", roomCheck.rows[0].status);

      // Önce kaydın var olup olmadığını kontrol et
      const checkResult = await client.query(
        "SELECT 1 FROM housekeeping WHERE room_id = $1",
        [id]
      );

      if (checkResult.rowCount === 0) {
        // Kayıt yoksa, yeni kayıt oluştur
        await client.query(
          `INSERT INTO housekeeping (room_id, status, last_cleaned) 
           VALUES ($1, $2, CURRENT_TIMESTAMP)`,
          [id, status]
        );
      } else {
        // Kayıt varsa, güncelle
        await client.query(
          `UPDATE housekeeping SET status = $1, last_cleaned = CURRENT_TIMESTAMP WHERE room_id = $2`,
          [status, id]
        );
      }

      // Temizlik durumuna göre oda durumunu güncelle
      if (status === "clean") {
        // Temiz olarak işaretlendiğinde oda durumunu "available" olarak güncelle
        await client.query(
          `UPDATE rooms SET status = 'available' WHERE id = $1`,
          [id]
        );
        console.log("Oda durumu güncellendi: available");
      } else if (status === "dirty") {
        // Kirli olarak işaretlendiğinde oda durumunu "maintenance" olarak güncelle
        await client.query(
          `UPDATE rooms SET status = 'maintenance' WHERE id = $1`,
          [id]
        );
        console.log("Oda durumu güncellendi: maintenance");
      }

      await client.query("COMMIT");
      res.status(200).json({ message: "Güncellendi" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Temizlik güncellenemedi:", error);
      res.status(500).json({ error: "Sunucu hatası" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Temizlik güncellenemedi:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

module.exports = {
  getAllHousekeeping,
  updateHousekeeping,
};
