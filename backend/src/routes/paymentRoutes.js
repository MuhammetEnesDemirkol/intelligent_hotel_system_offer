const express = require("express");
const {
  createPayment,
  getAllPayments,
} = require("../controllers/paymentController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createPayment);
router.get("/", authenticateToken, getAllPayments);

module.exports = router;
