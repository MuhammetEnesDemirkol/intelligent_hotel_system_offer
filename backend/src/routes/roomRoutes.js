const express = require('express');
const router = express.Router();
const { getAllRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');

const { authenticateToken } = require('../middlewares/authMiddleware');
// GET herkes görebilir (isteğe bağlı koruyabiliriz)
router.get('/', getAllRooms);

// POST, PUT, DELETE korumalı
router.post('/', authenticateToken, createRoom);
router.put('/:id', authenticateToken, updateRoom);
router.delete('/:id', authenticateToken, deleteRoom);
// GET /rooms → Tüm odaları getir
router.get('/', getAllRooms);

// POST /rooms → Yeni oda oluştur
router.post('/', createRoom);

// PUT /rooms/:id → Odayı güncelle
router.put('/:id', updateRoom);

// DELETE /rooms/:id → Odayı sil
router.delete('/:id', deleteRoom);

module.exports = router;
