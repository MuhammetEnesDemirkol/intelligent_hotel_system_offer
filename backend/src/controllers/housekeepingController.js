const pool = require("../config/db");

// Listele
const getAllHousekeeping = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT h.*, r.room_number 
      FROM housekeeping h 
      JOIN rooms r ON h.room_id = r.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Listeleme başarısız" });
  }
};

// Güncelle
const updateHousekeeping = async (req, res) => {
  const { id } = req.params;
  const { status, last_cleaned } = req.body;

  if (!status || !last_cleaned) {
    return res.status(400).json({ error: "Status ve last_cleaned zorunludur." });
  }

  try {
    const result = await pool.query(
      `UPDATE housekeeping SET status = $1, last_cleaned = $2 WHERE room_id = $3`,
      [status, last_cleaned, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Bu room_id ile eşleşen kayıt yok." });
    }

    res.status(200).json({ message: "Güncellendi" });
  } catch (error) {
    console.error("Temizlik güncellenemedi:", error.message, error.stack);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};



module.exports = { getAllHousekeeping, updateHousekeeping };
