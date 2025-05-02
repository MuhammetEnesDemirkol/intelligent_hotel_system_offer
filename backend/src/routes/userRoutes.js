const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  register,
  login,
  getMe,
  updateUser,
  getUserReservations,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.put("/update", authenticateToken, updateUser);
router.get("/reservations", authenticateToken, getUserReservations);

module.exports = router;
