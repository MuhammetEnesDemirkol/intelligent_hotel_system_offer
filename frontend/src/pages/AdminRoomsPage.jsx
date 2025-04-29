import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRoomsPage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Odalar getirilemedi:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu odayı silmek istediğinizden emin misiniz?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      fetchRooms(); // Yeniden yükle
    } catch (error) {
      console.error('Oda silinemedi:', error);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Oda Yönetimi</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Oda No</th>
            <th>Tür</th>
            <th>Kapasite</th>
            <th>Fiyat (₺)</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.room_number}</td>
              <td>{room.room_type}</td>
              <td>{room.capacity}</td>
              <td>{room.price_per_night}</td>
              <td>{room.status}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(room.id)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRoomsPage;
