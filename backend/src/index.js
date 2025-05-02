const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

// Uygulama başlat
const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const customerRoutes = require("./routes/customerRoutes");
const housekeepingRoutes = require("./routes/housekeepingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Test Endpoint
app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connection successful",
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/housekeeping", housekeepingRoutes);
app.use("/api/payments", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Sunucu hatası" });
});

// Sunucu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
