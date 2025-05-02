const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middlewares/authMiddleware");

const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomSummaries,
  getRoomsWithTodayStatus,
  checkRoomAvailabilityForMonth,
} = require("../controllers/roomController");

// Oda özetleri (müşteri ekranı için)
router.get("/summary", getRoomSummaries);

// Tüm odalar
router.get("/", getAllRooms);

// Bugüne göre durum kontrolü
router.get("/status", authenticateToken, getRoomsWithTodayStatus);

// Toplu fiyat güncelleme
router.put("/bulk-update-prices", authenticateToken, async (req, res) => {
  const { room_ids, change_type, change_value } = req.body;
  const admin_id = req.user.id;

  // Fiyatı 5'in katına yuvarlama fonksiyonu
  const roundToNearestFive = (price) => {
    return Math.round(price / 5) * 5;
  };

  console.log("Bulk update request received:", {
    admin_id,
    room_ids,
    change_type,
    change_value,
  });

  // Önce admin kullanıcının varlığını kontrol et
  try {
    const adminCheck = await pool.query(
      "SELECT id FROM admin_users WHERE id = $1",
      [admin_id]
    );
    if (adminCheck.rows.length === 0) {
      console.error("Admin kullanıcı bulunamadı:", admin_id);
      return res.status(400).json({ error: "Geçersiz admin kullanıcı" });
    }
  } catch (error) {
    console.error("Admin kullanıcı kontrolü hatası:", error);
    return res
      .status(500)
      .json({ error: "Admin kullanıcı kontrolü sırasında bir hata oluştu" });
  }

  // Input validation
  if (!room_ids || !Array.isArray(room_ids) || room_ids.length === 0) {
    return res.status(400).json({ error: "Geçerli oda ID'leri gerekli" });
  }
  if (!change_type || !["percentage", "fixed"].includes(change_type)) {
    return res
      .status(400)
      .json({ error: "Geçerli değişim tipi gerekli (percentage veya fixed)" });
  }
  if (
    change_value === undefined ||
    change_value === null ||
    change_value === ""
  ) {
    return res.status(400).json({ error: "Değişim değeri gerekli" });
  }

  // Convert change_value to number and format to 2 decimal places
  const numericChangeValue = parseFloat(change_value);
  if (isNaN(numericChangeValue)) {
    return res
      .status(400)
      .json({ error: "Geçerli bir değişim değeri gerekli" });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const room_id of room_ids) {
        // Mevcut fiyatı al
        const {
          rows: [room],
        } = await client.query(
          "SELECT price_per_night FROM rooms WHERE id = $1",
          [room_id]
        );

        if (!room) {
          console.warn(`Oda bulunamadı: ${room_id}`);
          continue;
        }

        const old_price = parseFloat(room.price_per_night);
        let new_price;

        // Fiyat değişimini hesapla
        if (change_type === "percentage") {
          new_price = old_price * (1 + numericChangeValue / 100);
        } else {
          new_price = old_price + numericChangeValue;
        }

        // Yeni fiyatın 0'dan küçük olmamasını sağla ve 5'in katına yuvarla
        new_price = Math.max(0, roundToNearestFive(new_price));

        // Format prices (remove decimals)
        const formattedOldPrice = Math.round(old_price);
        const formattedNewPrice = Math.round(new_price);
        const formattedChangeValue = Math.round(numericChangeValue);

        // Oda fiyatını güncelle
        await client.query(
          "UPDATE rooms SET price_per_night = $1 WHERE id = $2",
          [formattedNewPrice, room_id]
        );

        // Fiyat geçmişine ekle
        try {
          await client.query(
            `INSERT INTO room_price_history 
             (room_id, old_price, new_price, change_type, change_value, changed_by)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              room_id,
              formattedOldPrice,
              formattedNewPrice,
              change_type,
              formattedChangeValue,
              admin_id,
            ]
          );
        } catch (error) {
          console.error("Fiyat geçmişi eklenirken hata:", error);
          // Fiyat geçmişi eklenemese bile işleme devam et
        }
      }

      await client.query("COMMIT");
      res.json({ message: "Fiyatlar başarıyla güncellendi" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Toplu fiyat güncelleme hatası:", error);
      res
        .status(500)
        .json({ error: "Fiyatlar güncellenirken bir hata oluştu" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Veritabanı bağlantı hatası:", error);
    res.status(500).json({ error: "Veritabanı bağlantı hatası" });
  }
});

// Tek oda getir
router.get("/:id", getRoomById);

// Oda CRUD (korumalı)
router.post("/", authenticateToken, createRoom);
router.put("/:id", authenticateToken, updateRoom);
router.delete("/:id", authenticateToken, deleteRoom);

// Belirli odanın rezervasyon tarihleri (admin ekranı için)
router.get("/:id/reservations", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `SELECT check_in, check_out FROM reservations WHERE room_id = $1 ORDER BY check_in`,
    [id]
  );
  res.json(data.rows);
});

router.get("/:id/reservations/details", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `
    SELECT res.id, res.check_in, res.check_out, res.total_price,
           c.full_name, c.email
    FROM reservations res
    JOIN customers c ON res.customer_id = c.id
    WHERE res.room_id = $1
    ORDER BY res.check_in
  `,
    [id]
  );
  res.json(data.rows);
});

router.get("/:id/availability", checkRoomAvailabilityForMonth);

// Oda fiyat geçmişini getir
router.get("/:id/price-history", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT 
        rph.id,
        rph.room_id,
        rph.old_price,
        rph.new_price,
        rph.change_type,
        rph.change_value,
        TO_CHAR(rph.changed_at, 'DD.MM.YYYY HH24:MI') as changed_at,
        au.username as changed_by_name
       FROM room_price_history rph
       JOIN admin_users au ON rph.changed_by = au.id
       WHERE rph.room_id = $1
       ORDER BY rph.changed_at DESC`,
      [id]
    );

    // Fiyatları formatla
    const formattedRows = rows.map((row) => ({
      ...row,
      old_price: Math.round(row.old_price),
      new_price: Math.round(row.new_price),
      change_value: Math.round(row.change_value),
      change_type:
        row.change_type === "percentage" ? "Yüzde (%)" : "Sabit Değer (₺)",
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error("Fiyat geçmişi hatası:", error);
    res.status(500).json({ error: "Fiyat geçmişi alınamadı" });
  }
});

module.exports = router;
