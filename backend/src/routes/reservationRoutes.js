const express = require('express');
const router = express.Router();
const { getAllReservations, createReservation, updateReservation, deleteReservation } = require('../controllers/reservationController');

const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', getAllRooms);

router.post('/', authenticateToken, createReservation);

router.put('/:id', authenticateToken, updateReservation);

router.delete('/:id', authenticateToken, deleteReservation);



// GET /reservations → Tüm rezervasyonları getir
router.get('/', getAllReservations);

// POST /reservations → Yeni rezervasyon oluştur
router.post('/', createReservation);

// PUT /reservations/:id → Rezervasyonu güncelle
router.put('/:id', updateReservation);

// DELETE /reservations/:id → Rezervasyonu sil
router.delete('/:id', deleteReservation);

module.exports = router;
