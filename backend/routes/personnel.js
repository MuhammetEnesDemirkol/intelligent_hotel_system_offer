const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Tüm personeli getir
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM personnel ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching personnel:", error);
    res.status(500).json({ error: "Personel listesi alınamadı" });
  }
});

// Yeni personel ekle
router.post("/", auth, async (req, res) => {
  const { name, phone, role } = req.body;

  if (!name || !phone || !role) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO personnel (name, phone, role) VALUES (?, ?, ?)",
      [name, phone, role]
    );
    res.status(201).json({ id: result.insertId, name, phone, role });
  } catch (error) {
    console.error("Error adding personnel:", error);
    res.status(500).json({ error: "Personel eklenemedi" });
  }
});

// Personel sil
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM personnel WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Personel bulunamadı" });
    }

    res.json({ message: "Personel başarıyla silindi" });
  } catch (error) {
    console.error("Error deleting personnel:", error);
    res.status(500).json({ error: "Personel silinemedi" });
  }
});

// Personel güncelle
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, phone, role } = req.body;

  if (!name || !phone || !role) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur" });
  }

  try {
    const [result] = await db.query(
      "UPDATE personnel SET name = ?, phone = ?, role = ? WHERE id = ?",
      [name, phone, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Personel bulunamadı" });
    }

    res.json({ id, name, phone, role });
  } catch (error) {
    console.error("Error updating personnel:", error);
    res.status(500).json({ error: "Personel güncellenemedi" });
  }
});

module.exports = router;
