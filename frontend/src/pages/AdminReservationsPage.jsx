import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter]);

  const filterReservations = () => {
    let filtered = [...reservations];

    // Durum filtresi
    if (statusFilter !== "all") {
      filtered = filtered.filter((res) => res.status === statusFilter);
    }

    // Arama filtresi
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (res) =>
          res.full_name.toLowerCase().includes(term) ||
          res.room_number.toString().includes(term)
      );
    }

    setFilteredReservations(filtered);
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/reservations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations(response.data);
      setError(null);
    } catch (error) {
      console.error("Rezervasyonlar getirilemedi:", error);
      setError(
        "Rezervasyonlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu rezervasyonu silmek istediğinizden emin misiniz?"))
      return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Rezervasyon başarıyla silindi.");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchReservations();
    } catch (error) {
      console.error("Rezervasyon silinemedi:", error);
      setError(
        "Rezervasyon silinirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/reservations/${id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Rezervasyon durumu başarıyla güncellendi.");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchReservations();
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
      setError(
        "Rezervasyon durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
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

  const getStatusText = (status) => {
    switch (status) {
      case "checked-in":
        return "Giriş Yapıldı";
      case "checked-out":
        return "Çıkış Yapıldı";
      case "canceled":
        return "İptal Edildi";
      default:
        return "Beklemede";
    }
  };

  return (
    <div className="admin-reservations-page">
      <div className="admin-reservations-container">
        <h2 className="admin-reservations-title">Rezervasyon Yönetimi</h2>

        <div className="admin-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Müşteri adı veya oda no ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="checked-in">Giriş Yapıldı</option>
              <option value="checked-out">Çıkış Yapıldı</option>
              <option value="canceled">İptal Edildi</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}

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
            {filteredReservations.map((reservation) => (
              <tr
                key={reservation.id}
                className={
                  reservation.status === "checked-out" ? "inactive-row" : ""
                }
              >
                <td>{reservation.full_name}</td>
                <td>{reservation.room_number}</td>
                <td>{new Date(reservation.check_in).toLocaleDateString()}</td>
                <td>{new Date(reservation.check_out).toLocaleDateString()}</td>
                <td>{reservation.total_price}</td>
                <td>
                  <button
                    className="admin-delete-button"
                    onClick={() => handleDelete(reservation.id)}
                    disabled={reservation.status === "checked-out"}
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
                    {getStatusText(reservation.status)}
                  </span>
                </td>
                <td>
                  <select
                    className="admin-status-select"
                    value={reservation.status}
                    onChange={(e) =>
                      handleStatusUpdate(reservation.id, e.target.value)
                    }
                    disabled={reservation.status === "checked-out"}
                  >
                    <option value="pending">Beklemede</option>
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
