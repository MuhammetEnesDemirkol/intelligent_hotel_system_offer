const express = require('express');
const { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllCustomers);

router.post('/', authenticateToken, createCustomer);

router.put('/:id', authenticateToken, updateCustomer);

router.delete('/:id', authenticateToken, deleteCustomer);



// GET /customers → Tüm müşterileri getir
router.get('/', getAllCustomers);

// POST /customers → Yeni müşteri ekle
router.post('/', createCustomer);

// PUT /customers/:id → Müşteriyi güncelle
router.put('/:id', updateCustomer);

// DELETE /customers/:id → Müşteriyi sil
router.delete('/:id', deleteCustomer);

module.exports = router;
