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
  const { status } = req.body;
  const now = new Date().toISOString().split("T")[0];

  try {
    // Önce housekeeping tablosunu güncelle
    const housekeepingResult = await pool.query(
      `UPDATE housekeeping
       SET status = $1, last_cleaned = $2
       WHERE id = $3 RETURNING *`,
      [status, now, id]
    );

    const updatedHousekeeping = housekeepingResult.rows[0];

    // Sonra rooms tablosunu da güncelle
    await pool.query(
      `UPDATE rooms
       SET status = $1
       WHERE id = $2`,
      [status === "clean" ? "available" : status, updatedHousekeeping.room_id]
    );

    res.json(updatedHousekeeping);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Güncelleme başarısız" });
  }
};

module.exports = { getAllHousekeeping, updateHousekeeping };
