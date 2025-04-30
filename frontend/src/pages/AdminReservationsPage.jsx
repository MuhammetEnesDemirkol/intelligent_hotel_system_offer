import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reservations",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Rezervasyonlar getirilemedi:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu rezervasyonu silmek istediğinizden emin misiniz?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchReservations(); // Listeyi güncelle
    } catch (error) {
      console.error("Rezervasyon silinemedi:", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/reservations/${id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      fetchReservations(); // Listeyi güncelle
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "checked-in":
        return "admin-status-checked-in";
      case "checked-out":
        return "admin-status-checked-out";
      case "canceled":
        return "admin-status-canceled";
      default:
        return "admin-status-pending";
    }
  };

  return (
    <div className="admin-reservations-page">
      <div className="admin-reservations-container">
        <h2 className="admin-reservations-title">Rezervasyon Yönetimi</h2>
        <table className="admin-reservations-table">
          <thead>
            <tr>
              <th>Müşteri</th>
              <th>Oda No</th>
              <th>Giriş Tarihi</th>
              <th>Çıkış Tarihi</th>
              <th>Toplam Fiyat (₺)</th>
              <th>İşlemler</th>
              <th>Durum</th>
              <th>Güncelle</th>
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
                    className="admin-delete-button"
                    onClick={() => handleDelete(reservation.id)}
                  >
                    Sil
                  </button>
                </td>
                <td>
                  <span
                    className={`admin-reservation-status ${getStatusClass(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td>
                  <select
                    className="admin-status-select"
                    value={reservation.status}
                    onChange={(e) =>
                      handleStatusUpdate(reservation.id, e.target.value)
                    }
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="checked-in">Giriş Yapıldı</option>
                    <option value="checked-out">Çıkış Yapıldı</option>
                    <option value="canceled">İptal</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservationsPage;
