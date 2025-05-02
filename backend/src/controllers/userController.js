const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Kullanıcı Kaydı
const register = async (req, res) => {
  const { full_name, email, password, phone, address, identity_number } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, address, identity_number)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [full_name, email, hashedPassword, phone, address, identity_number]
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
      "SELECT id, full_name, email, phone, address, identity_number FROM users WHERE id = $1",
      [userId]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kullanıcı bilgisi getirilemedi" });
  }
};

// Kullanıcı bilgilerini güncelle
const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { full_name, email, phone, address, identity_number } = req.body;

  try {
    // E-posta kontrolü (kendi e-postası hariç)
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND id != $2",
      [email, userId]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Bu e-posta adresi zaten kullanılıyor" });
    }

    const { rows } = await pool.query(
      `UPDATE users
       SET full_name = $1, email = $2, phone = $3, address = $4, identity_number = $5
       WHERE id = $6 RETURNING *`,
      [full_name, email, phone, address, identity_number, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kullanıcı güncellenemedi" });
  }
};

// Kullanıcının rezervasyonlarını getir
const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT r.*, rooms.room_number, rooms.room_type, rooms.price_per_night
      FROM reservations r
      JOIN rooms ON r.room_id = rooms.id
      WHERE r.customer_id = $1
      ORDER BY r.check_in DESC
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Rezervasyonlar alınamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateUser,
  getUserReservations,
};
