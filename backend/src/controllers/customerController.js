const pool = require('../config/db');

// Tüm müşterileri getir
const getAllCustomers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM customers');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Müşteriler listelenemedi' });
    }
};

// Yeni müşteri ekle
const createCustomer = async (req, res) => {
    const { full_name, email, phone } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO customers (full_name, email, phone)
             VALUES ($1, $2, $3) RETURNING *`,
            [full_name, email, phone]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Müşteri eklenemedi' });
    }
};

// Müşteri bilgilerini güncelle
const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { full_name, email, phone } = req.body;
    try {
        const { rows } = await pool.query(
            `UPDATE customers
             SET full_name = $1, email = $2, phone = $3
             WHERE id = $4 RETURNING *`,
            [full_name, email, phone, id]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Müşteri güncellenemedi' });
    }
};

// Müşteriyi sil
const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM customers WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Müşteri silinemedi' });
    }
};

module.exports = { getAllCustomers, createCustomer, updateCustomer, deleteCustomer };
