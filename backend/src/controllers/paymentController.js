const pool = require("../config/db");

// Ödeme oluştur
const createPayment = async (req, res) => {
  const { customer_id, reservation_id, amount } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO payments (customer_id, reservation_id, amount)
       VALUES ($1, $2, $3) RETURNING *`,
      [customer_id, reservation_id, amount]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ödeme oluşturulamadı" });
  }
};

// Tüm ödemeleri listele
const getAllPayments = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, c.full_name
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ödemeler getirilemedi" });
  }
};

module.exports = { createPayment, getAllPayments };
