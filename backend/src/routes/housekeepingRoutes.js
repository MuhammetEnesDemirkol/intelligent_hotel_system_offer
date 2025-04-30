const express = require("express");
const pool = require("../config/db");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getAllHousekeeping,
  updateHousekeeping,
} = require("../controllers/housekeepingController");

const router = express.Router();

// Tüm odalar ve temizlik durumu (eksik kayıtları da içerecek şekilde)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id as room_id,
        r.room_number,
        COALESCE(h.status, 'dirty') AS status,
        h.last_cleaned
      FROM rooms r
      LEFT JOIN housekeeping h ON r.id = h.room_id
      ORDER BY r.room_number
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Housekeeping verisi alınamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Güncelleme
router.put("/:id", authenticateToken, updateHousekeeping);

module.exports = router;
