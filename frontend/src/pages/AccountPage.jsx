import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/user.css";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const filterReservations = useCallback(() => {
    let filtered = reservations;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.room_number.toString().includes(searchTerm) ||
          r.check_in.includes(searchTerm) ||
          r.check_out.includes(searchTerm)
      );
    }

    // Durum filtresi
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [filterReservations]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const userResponse = await axios.get(
        "http://localhost:5000/api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(userResponse.data);
      setEditForm({
        full_name: userResponse.data.full_name,
        email: userResponse.data.email,
        phone: userResponse.data.phone || "",
      });

      const reservationsResponse = await axios.get(
        "http://localhost:5000/api/users/reservations",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(reservationsResponse.data);
    } catch (error) {
      console.error("Veri yüklenirken hata:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put("http://localhost:5000/api/users/update", editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, ...editForm });
      setIsEditing(false);
      setModalMessage("Profil başarıyla güncellendi");
      setShowModal(true);
    } catch (err) {
      console.error("Profil güncellenirken hata:", err);
      setModalMessage("Profil güncellenirken bir hata oluştu");
      setShowModal(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) return <div className="account-page">Yükleniyor...</div>;

  return (
    <div className="account-page">
      <div className="account-container">
        <h2 className="account-title">Hesabım</h2>

        <div className="profile-section">
          <div className="profile-header">
            <h3>Profil Bilgileri</h3>
            <button
              className="edit-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "İptal" : "Düzenle"}
            </button>
          </div>

          {isEditing ? (
            <form className="edit-form" onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Ad Soyad</label>
                <input
                  type="text"
                  name="full_name"
                  value={editForm.full_name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>E-posta</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />
              </div>
              <button type="submit" className="save-btn">
                Kaydet
              </button>
            </form>
          ) : (
            <div className="profile-info">
              <p>
                <strong>Ad Soyad:</strong> {user.full_name}
              </p>
              <p>
                <strong>E-posta:</strong> {user.email}
              </p>
              <p>
                <strong>Telefon:</strong> {user.phone || "Belirtilmemiş"}
              </p>
            </div>
          )}
        </div>

        <div className="reservations-section">
          <div className="reservations-header">
            <h3>Rezervasyon Geçmişi</h3>
            <div className="filters">
              <input
                type="text"
                placeholder="Oda no veya tarih ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="confirmed">Onaylandı</option>
                <option value="checked-in">Giriş Yapıldı</option>
                <option value="checked-out">Çıkış Yapıldı</option>
                <option value="canceled">İptal Edildi</option>
              </select>
            </div>
          </div>

          {filteredReservations.length === 0 ? (
            <p className="no-reservations">Rezervasyon bulunamadı.</p>
          ) : (
            <div className="reservation-cards">
              {filteredReservations.map((r) => (
                <div key={r.id} className="reservation-card">
                  <div className="card-header">
                    <h4>Oda No: {r.room_number}</h4>
                    <span className={`status-badge ${r.status}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Giriş:</strong>{" "}
                      {new Date(r.check_in).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Çıkış:</strong>{" "}
                      {new Date(r.check_out).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Tutar:</strong> {r.total_price} ₺
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Bilgi</h3>
            <p>{modalMessage}</p>
            <button
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
