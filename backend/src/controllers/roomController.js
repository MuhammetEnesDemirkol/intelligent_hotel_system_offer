const pool = require("../config/db");

// Tüm odaları getir
const getAllRooms = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM rooms");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Odalar listelenemedi" });
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

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
