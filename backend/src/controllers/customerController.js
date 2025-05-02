const pool = require("../config/db");

// Tüm müşterileri getir
const getAllCustomers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        full_name,
        email,
        phone,
        created_at
      FROM users
      ORDER BY full_name
    `);
    res.json(rows);
  } catch (error) {
    console.error("Müşteriler getirilemedi:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Müşteri bilgilerini ID'ye göre getir
const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Müşteri bulunamadı" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Müşteri bilgileri getirilemedi" });
  }
};

// Müşteri bilgilerini e-posta adresine göre getir
const getCustomerByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Müşteri bulunamadı" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Müşteri bilgileri getirilemedi" });
  }
};

// Yeni müşteri oluştur
const createCustomer = async (req, res) => {
  const { full_name, email, phone } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ error: "Ad soyad ve email zorunludur." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, phone) 
       VALUES ($1, $2, $3) 
       RETURNING id, full_name, email, phone, created_at`,
      [full_name, email, phone]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Müşteri oluşturulamadı:", error);
    if (error.code === "23505") {
      // Unique constraint violation
      return res
        .status(400)
        .json({ error: "Bu email adresi zaten kullanılıyor." });
    }
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Müşteri güncelle
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ error: "Ad soyad ve email zorunludur." });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users 
       SET full_name = $1, email = $2, phone = $3 
       WHERE id = $4 
       RETURNING id, full_name, email, phone, created_at`,
      [full_name, email, phone, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Müşteri bulunamadı" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Müşteri güncellenemedi:", error);
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: "Bu email adresi zaten kullanılıyor." });
    }
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Müşteri sil
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Müşteri bulunamadı" });
    }

    res.json({ message: "Müşteri başarıyla silindi" });
  } catch (error) {
    console.error("Müşteri silinemedi:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
