const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Basit bir test endpointi
app.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT NOW()');
        res.json({ time: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database bağlantı hatası' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server çalışıyor http://localhost:${PORT}`);
});

const roomRoutes = require('./routes/roomRoutes');

// Mevcut middleware'lerin altına ekle
app.use('/api/rooms', roomRoutes);

const customerRoutes = require('./routes/customerRoutes');

app.use('/api/customers', customerRoutes);

const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/reservations', reservationRoutes);

const adminRoutes = require('./routes/adminRoutes');

app.use('/api/admin', adminRoutes);
