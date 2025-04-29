const express = require("express");
const router = express.Router();
const {
  getAllReservations,
  createReservation,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
  getWeeklyReservations,
} = require("../controllers/reservationController");

const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", getAllReservations);

router.post("/", authenticateToken, createReservation);

router.put("/:id", authenticateToken, updateReservation);

router.delete("/:id", authenticateToken, deleteReservation);

router.patch("/:id/status", authenticateToken, updateReservationStatus);

router.get("/weekly", authenticateToken, getWeeklyReservations);

module.exports = router;
