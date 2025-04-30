const pool = require("../config/db");

// Tüm odaları getir (listelemek için)
const getAllRooms = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM rooms ORDER BY room_number");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Odalar alınamadı" });
  }
};


// Tüm odaları getir
const getRoomsWithTodayStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { rows } = await pool.query(`
      SELECT r.*, EXISTS (
        SELECT 1 FROM reservations res
        WHERE res.room_id = r.id
        AND $1::date BETWEEN res.check_in AND res.check_out
      ) AS is_reserved_today
      FROM rooms r
      ORDER BY room_number
    `, [today]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Oda durumu alınamadı" });
  }
};


// Tek odayı getir (detay)
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM rooms WHERE id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Oda bulunamadı" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Oda detay alınamadı:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Yeni oda ekle
const createRoom = async (req, res) => {
  const { room_number, room_type, capacity, price_per_night, status } =
    req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO rooms (room_number, room_type, capacity, price_per_night, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [room_number, room_type, capacity, price_per_night, status]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Oda eklenemedi" });
  }
};

// Oda bilgilerini güncelle
const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { room_number, room_type, capacity, price_per_night, status } =
    req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE rooms
       SET room_number = $1, room_type = $2, capacity = $3, price_per_night = $4, status = $5
       WHERE id = $6 RETURNING *`,
      [room_number, room_type, capacity, price_per_night, status, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Oda güncellenemedi" });
  }
};

// Oda sil
const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM rooms WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Oda silinemedi" });
  }
};

// Oda kategori özetleri (örnek odalar + uygunluk durumu)
const getRoomSummaries = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (room_type, capacity)
        id, room_type, capacity, price_per_night, image_url, status
      FROM rooms
      ORDER BY room_type, capacity, status = 'available' DESC, id ASC
    `);

    const today = new Date().toISOString().split("T")[0];

    const enriched = await Promise.all(
      rows.map(async (room) => {
        // Bugün bu oda rezerve mi?
        const todayRes = await pool.query(`
          SELECT 1 FROM reservations
          WHERE room_id = $1
          AND $2::date BETWEEN check_in AND check_out
        `, [room.id, today]);

        room.status = todayRes.rowCount > 0 ? "reserved" : "available";

        if (room.status === "reserved") {
          const next = await pool.query(`
            SELECT MIN(check_out) AS next_available
            FROM reservations
            WHERE room_id = $1 AND check_out >= $2::date
          `, [room.id, today]);

          room.next_available = next.rows[0].next_available;
        }

        return room;
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Özet verisi alınamadı" });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomSummaries,
  getRoomsWithTodayStatus,
};
