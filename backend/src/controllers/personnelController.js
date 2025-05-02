const db = require("../config/db");

// Tüm personeli getir
const getAllPersonnel = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM personnel ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching personnel:", error);
    res.status(500).json({ error: "Personel listesi alınamadı" });
  }
};

// Yeni personel ekle
const addPersonnel = async (req, res) => {
  const { name, phone, role } = req.body;

  if (!name || !phone || !role) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur" });
  }

  try {
    const { rows } = await db.query(
      "INSERT INTO personnel (name, phone, role) VALUES ($1, $2, $3) RETURNING *",
      [name, phone, role]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding personnel:", error);
    res.status(500).json({ error: "Personel eklenemedi" });
  }
};

// Personel sil
const deletePersonnel = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await db.query("DELETE FROM personnel WHERE id = $1", [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Personel bulunamadı" });
    }

    res.json({ message: "Personel başarıyla silindi" });
  } catch (error) {
    console.error("Error deleting personnel:", error);
    res.status(500).json({ error: "Personel silinemedi" });
  }
};

// Personel güncelle
const updatePersonnel = async (req, res) => {
  const { id } = req.params;
  const { name, phone, role } = req.body;

  if (!name || !phone || !role) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur" });
  }

  try {
    const { rows, rowCount } = await db.query(
      "UPDATE personnel SET name = $1, phone = $2, role = $3 WHERE id = $4 RETURNING *",
      [name, phone, role, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Personel bulunamadı" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating personnel:", error);
    res.status(500).json({ error: "Personel güncellenemedi" });
  }
};

// ID'ye göre personel getir
const getPersonnelById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query("SELECT * FROM personnel WHERE id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Personel bulunamadı" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching personnel:", error);
    res.status(500).json({ error: "Personel bilgileri alınamadı" });
  }
};

// Temizlik personelini getir
const getCleaningStaff = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT id, name FROM personnel WHERE LOWER(role) LIKE LOWER('%temizlik%') ORDER BY name"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching cleaning staff:", error);
    res.status(500).json({ error: "Temizlik personeli listesi alınamadı" });
  }
};

module.exports = {
  getAllPersonnel,
  addPersonnel,
  deletePersonnel,
  updatePersonnel,
  getPersonnelById,
  getCleaningStaff,
};
