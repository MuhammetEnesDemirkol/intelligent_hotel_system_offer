const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Kullanıcı Kaydı
const register = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
             VALUES ($1, $2, $3) RETURNING *`,
      [full_name, email, hashedPassword]
    );

    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kayıt işlemi başarısız" });
  }
};

// Kullanıcı Girişi
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Şifre yanlış" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Giriş işlemi başarısız" });
  }
};

// Token ile giriş yapmış kullanıcı bilgisi
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      "SELECT id, full_name, email FROM users WHERE id = $1",
      [userId]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kullanıcı bilgisi getirilemedi" });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id; // Token'dan alınan kullanıcı ID

    const result = await pool.query(`
      SELECT r.*, rooms.room_number
      FROM reservations r
      JOIN rooms ON r.room_id = rooms.id
      WHERE r.customer_id = $1
      ORDER BY r.check_in DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Rezervasyonlar alınamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};


module.exports = { register, login, getMe, getUserReservations };
