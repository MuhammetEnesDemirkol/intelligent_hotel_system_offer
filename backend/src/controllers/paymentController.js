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
      SELECT 
        p.*,
        u.full_name AS customer_name,
        r.check_in,
        r.check_out,
        r.total_price,
        r.status AS reservation_status,
        rm.room_number,
        rm.room_type
      FROM payments p
      JOIN users u ON p.customer_id = u.id
      JOIN reservations r ON p.reservation_id = r.id
      JOIN rooms rm ON r.room_id = rm.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Ödemeler getirilemedi:", err);
    res.status(500).json({ error: "Ödemeler getirilemedi" });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
};
