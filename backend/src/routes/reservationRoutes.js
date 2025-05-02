const express = require("express");
const router = express.Router();
const {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  getWeeklyReservations,
  getPastReservations,
  getActiveReservations,
  checkRoomAvailability,
} = require("../controllers/reservationController");

const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", getAllReservations);

router.get("/past", getPastReservations);

router.get("/active", getActiveReservations);

router.post("/check-availability", async (req, res) => {
  const { room_id, check_in, check_out } = req.body;
  try {
    const isAvailable = await checkRoomAvailability(
      room_id,
      check_in,
      check_out
    );
    res.json({ isAvailable });
  } catch (error) {
    res.status(500).json({ error: "Müsaitlik kontrolü yapılamadı" });
  }
});

router.post("/", authenticateToken, createReservation);

router.put("/:id", authenticateToken, updateReservation);

router.delete("/:id", authenticateToken, deleteReservation);

router.put("/:id/status", authenticateToken, updateReservationStatus);

router.get("/weekly", authenticateToken, getWeeklyReservations);

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM reservations WHERE id = $1`, [id]);
  res.status(204).send();
});

module.exports = router;
