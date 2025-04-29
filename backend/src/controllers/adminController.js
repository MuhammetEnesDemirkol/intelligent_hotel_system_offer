const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Admin login işlemi
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM admin_users WHERE username = $1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı" });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Hatalı şifre" });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Giriş işlemi başarısız" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const roomCount = await pool.query("SELECT COUNT(*) FROM rooms");
    const customerCount = await pool.query("SELECT COUNT(*) FROM customers");
    const reservationCount = await pool.query(
      "SELECT COUNT(*) FROM reservations"
    );
    const paymentSum = await pool.query("SELECT SUM(amount) FROM payments");

    res.json({
      rooms: parseInt(roomCount.rows[0].count),
      customers: parseInt(customerCount.rows[0].count),
      reservations: parseInt(reservationCount.rows[0].count),
      totalPayments: parseFloat(paymentSum.rows[0].sum) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "İstatistikler alınamadı" });
  }
};

module.exports = {
  login,
  getDashboardStats,
};
