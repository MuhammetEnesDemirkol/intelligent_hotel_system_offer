const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

// Tüm müşterileri getir
router.get("/", authenticateToken, getAllCustomers);

// Yeni müşteri oluştur
router.post("/", authenticateToken, createCustomer);

// Müşteri güncelle
router.put("/:id", authenticateToken, updateCustomer);

// Müşteri sil
router.delete("/:id", authenticateToken, deleteCustomer);

module.exports = router;
