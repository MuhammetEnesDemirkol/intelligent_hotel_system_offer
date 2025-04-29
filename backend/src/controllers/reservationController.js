const pool = require("../config/db");

// Tüm rezervasyonları getir
const getAllReservations = async (req, res) => {
  try {
    const { rows } = await pool.query(`
            SELECT reservations.*, customers.full_name, rooms.room_number
            FROM reservations
            JOIN customers ON reservations.customer_id = customers.id
            JOIN rooms ON reservations.room_id = rooms.id
        `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Rezervasyonlar listelenemedi" });
  }
};

// Yeni rezervasyon oluştur
const createReservation = async (req, res) => {
  const { customer_id, room_id, check_in, check_out, total_price } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO reservations (customer_id, room_id, check_in, check_out, total_price)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_id, room_id, check_in, check_out, total_price]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
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
    const { rows } = await pool.query(
      `UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
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

module.exports = {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  getWeeklyReservations,
};
