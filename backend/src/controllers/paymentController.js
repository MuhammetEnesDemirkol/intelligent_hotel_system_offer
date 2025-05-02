const pool = require("../config/db");

// Ödeme oluştur
const createPayment = async (req, res) => {
  const { customer_id, reservation_id, amount } = req.body;

  try {
    // Müşteri bilgilerini al
    const customerResult = await pool.query(
      "SELECT full_name, email FROM users WHERE id = $1",
      [customer_id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: "Müşteri bulunamadı" });
    }

    const { full_name: customer_name, email: customer_email } =
      customerResult.rows[0];

    const { rows } = await pool.query(
      `INSERT INTO payments (
        customer_id, 
        customer_name, 
        customer_email, 
        reservation_id, 
        amount
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_id, customer_name, customer_email, reservation_id, amount]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Ödeme oluşturma hatası:", err);
    res.status(500).json({
      error: "Ödeme oluşturulamadı",
      details: err.message,
      stack: err.stack,
    });
  }
};

// Tüm ödemeleri listele
const getAllPayments = async (req, res) => {
  try {
    console.log("Ödemeler getiriliyor...");

    // Önce tablonun var olup olmadığını kontrol et
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payments'
      );
    `);

    console.log("Tablo kontrolü:", tableCheck.rows[0].exists);

    if (!tableCheck.rows[0].exists) {
      console.log("Payments tablosu bulunamadı, oluşturuluyor...");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          customer_id INTEGER NOT NULL REFERENCES users(id),
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          reservation_id INTEGER NOT NULL REFERENCES reservations(id),
          amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'completed',
          payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("Payments tablosu oluşturuldu");
    }

    // Ödemeleri ve müşteri bilgilerini getir
    const { rows } = await pool.query(`
      SELECT 
        p.id,
        p.customer_id,
        p.customer_name,
        p.customer_email,
        p.reservation_id,
        p.amount,
        p.status,
        p.payment_date,
        p.created_at,
        u.full_name as customer_full_name,
        u.email as customer_email,
        r.check_in,
        r.check_out,
        r.status as reservation_status
      FROM payments p
      LEFT JOIN users u ON p.customer_id = u.id
      LEFT JOIN reservations r ON p.reservation_id = r.id
      ORDER BY p.created_at DESC
    `);

    console.log("Ödemeler başarıyla getirildi:", rows.length, "kayıt");
    res.json(rows);
  } catch (err) {
    console.error("Ödemeler getirilemedi:", err);
    res.status(500).json({
      error: "Ödemeler getirilemedi",
      details: err.message,
      stack: err.stack,
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
};
