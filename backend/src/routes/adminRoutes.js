const express = require("express");
const { login, getDashboardStats } = require("../controllers/adminController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin Giriş
router.post("/login", login);

// Admin Dashboard İstatistikleri
router.get("/stats", authenticateToken, getDashboardStats);

module.exports = router;
