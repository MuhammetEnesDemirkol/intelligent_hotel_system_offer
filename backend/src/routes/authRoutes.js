const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Admin girişi
router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Admin kullanıcısını kontrol et
    const { rows } = await pool.query(
      "SELECT * FROM admin_users WHERE username = $1",
      [username]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    const admin = rows[0];

    // Şifreyi kontrol et
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Token doğrulama
router.post("/verify", (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ error: "Token bulunamadı" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.json({ valid: false });
  }
});

module.exports = router;
