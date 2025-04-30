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
        <div className="account-header">
          <h2 className="account-title">Profilim</h2>
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-label">Ad Soyad</div>
            <div className="profile-value">{user.full_name}</div>
          </div>
          <div className="profile-info">
            <div className="profile-label">E-posta</div>
            <div className="profile-value">{user.email}</div>
          </div>
          <div className="profile-info">
            <div className="profile-label">Kullanıcı ID</div>
            <div className="profile-value">{user.id}</div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="reservations-title">Rezervasyon Geçmişim</div>

        {reservations.length === 0 ? (
          <div className="no-reservations">
            Henüz rezervasyon bulunmamaktadır.
          </div>
        ) : (
          <div className="reservations-table">
            <table>
              <thead>
                <tr>
                  <th>Oda No</th>
                  <th>Giriş</th>
                  <th>Çıkış</th>
                  <th>Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.room_number}</td>
                    <td>{r.check_in}</td>
                    <td>{r.check_out}</td>
                    <td>{r.total_price} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
