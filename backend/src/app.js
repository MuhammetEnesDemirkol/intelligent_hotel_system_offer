const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const customerRoutes = require("./routes/customerRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const housekeepingRoutes = require("./routes/housekeepingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
// Uygulama başlat
const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());

// Test Endpoint
app.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ time: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database bağlantı hatası" });
  }
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/housekeeping", housekeepingRoutes);
app.use("/api/payments", paymentRoutes);
// Sunucu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
