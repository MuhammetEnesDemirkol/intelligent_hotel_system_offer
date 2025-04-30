import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/user.css";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data));

    axios
      .get("http://localhost:5000/api/users/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReservations(res.data));
  }, []);

  if (!user) return <div className="account-page">Yükleniyor...</div>;

  return (
    <div className="account-page">
      <div className="account-container">
        <h2 className="account-title">Profilim</h2>

        <div className="profile-card">
          <p><strong>Ad Soyad:</strong> {user.full_name}</p>
          <p><strong>E-posta:</strong> {user.email}</p>
          <p><strong>Kullanıcı ID:</strong> {user.id}</p>
        </div>

        <div className="divider" />

        <h4 className="reservations-title">Rezervasyon Geçmişim</h4>

        {reservations.length === 0 ? (
          <p className="no-reservations">Henüz rezervasyon bulunmamaktadır.</p>
        ) : (
          <div className="reservation-cards">
            {reservations.map((r) => (
              <div key={r.id} className="reservation-card">
                <h5>Oda No: {r.room_number}</h5>
                <p>Giriş: {r.check_in}</p>
                <p>Çıkış: {r.check_out}</p>
                <p>Tutar: {r.total_price} ₺</p>
                <span className={`badge ${
                  r.status === "checked-in" ? "bg-success" :
                  r.status === "checked-out" ? "bg-secondary" :
                  r.status === "canceled" ? "bg-danger" : "bg-warning text-dark"
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
