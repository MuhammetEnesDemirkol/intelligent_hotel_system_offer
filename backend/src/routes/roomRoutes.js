const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middlewares/authMiddleware");

const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomSummaries,
  getRoomsWithTodayStatus,
} = require("../controllers/roomController");

// Oda özetleri (müşteri ekranı için)
router.get("/summary", getRoomSummaries);

// Belirli odanın rezervasyon tarihleri (admin ekranı için)
router.get("/:id/reservations", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `SELECT check_in, check_out FROM reservations WHERE room_id = $1 ORDER BY check_in`,
    [id]
  );
  res.json(data.rows);
});

// Tüm odalar
router.get("/", getAllRooms);

// Bugüne göre durum kontrolü
router.get("/status", authenticateToken, getRoomsWithTodayStatus);

// Tek oda getir
router.get("/:id", getRoomById);

// Oda CRUD (korumalı)
router.post("/", authenticateToken, createRoom);
router.put("/:id", authenticateToken, updateRoom);
router.delete("/:id", authenticateToken, deleteRoom);

router.get('/:id/reservations/details', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(`
    SELECT res.id, res.check_in, res.check_out, res.total_price,
           c.full_name, c.email
    FROM reservations res
    JOIN customers c ON res.customer_id = c.id
    WHERE res.room_id = $1
    ORDER BY res.check_in
  `, [id]);
  res.json(data.rows);
});


module.exports = router;
