import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminRoomPricingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [priceInput, setPriceInput] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Odalar alınamadı:", error);
    }
  };

  const handlePriceChange = (e) => {
    setPriceInput(e.target.value);
  };

  const handleEdit = (room) => {
    setEditingRoomId(room.id);
    setPriceInput(room.price_per_night);
  };

  const handleSave = async (room) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:5000/api/rooms/${room.id}`,
        {
          ...room,
          price_per_night: priceInput,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingRoomId(null);
      fetchRooms();
    } catch (error) {
      console.error("Fiyat güncellenemedi:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Oda Fiyat Yönetimi</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Oda No</th>
            <th>Tür</th>
            <th>Mevcut Fiyat (₺)</th>
            <th>Yeni Fiyat</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.room_number}</td>
              <td>{room.room_type}</td>
              <td>{room.price_per_night}</td>
              <td>
                {editingRoomId === room.id ? (
                  <input
                    type="number"
                    className="form-control"
                    value={priceInput}
                    onChange={handlePriceChange}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td>
                {editingRoomId === room.id ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleSave(room)}
                  >
                    Kaydet
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(room)}
                  >
                    Düzenle
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRoomPricingPage;
