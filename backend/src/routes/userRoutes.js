const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { register, login, getMe } = require("../controllers/userController");
const { getUserReservations } = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.get("/reservations", authenticateToken, getUserReservations);
module.exports = router;
