const express = require("express");
const router = express.Router();
const {
  getAllRooms,
  getRoomById, // ← yeni ekleyeceğimiz controller
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const { authenticateToken } = require("../middlewares/authMiddleware");

// GET /api/rooms → Tüm odaları getir
router.get("/", getAllRooms);

// GET /api/rooms/:id → Tek oda getir (müşteri detay sayfası için)
router.get("/:id", getRoomById);

// POST /api/rooms → Yeni oda oluştur (admin)
router.post("/", authenticateToken, createRoom);

// PUT /api/rooms/:id → Odayı güncelle (admin)
router.put("/:id", authenticateToken, updateRoom);

// DELETE /api/rooms/:id → Odayı sil (admin)
router.delete("/:id", authenticateToken, deleteRoom);

module.exports = router;
