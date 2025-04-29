import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Rezervasyonlar getirilemedi:', error);
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
      <h2 className="text-center mb-4">Rezervasyon Yönetimi</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Müşteri</th>
            <th>Oda No</th>
            <th>Giriş Tarihi</th>
            <th>Çıkış Tarihi</th>
            <th>Toplam Fiyat (₺)</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.full_name}</td>
              <td>{reservation.room_number}</td>
              <td>{reservation.check_in}</td>
              <td>{reservation.check_out}</td>
              <td>{reservation.total_price}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(reservation.id)}
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

export default AdminReservationsPage;
