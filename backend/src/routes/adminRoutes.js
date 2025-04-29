const express = require('express');
const { login } = require('../controllers/adminController');

const router = express.Router();

// POST /admin/login → Giriş
router.post('/login', login);

module.exports = router;
