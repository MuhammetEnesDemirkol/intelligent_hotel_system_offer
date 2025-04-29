import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (!user) return <div className="container mt-5">Yükleniyor...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profilim</h2>
      <p>
        <strong>Ad Soyad:</strong> {user.full_name}
      </p>
      <p>
        <strong>E-posta:</strong> {user.email}
      </p>
      <p>
        <strong>Kullanıcı ID:</strong> {user.id}
      </p>
      <hr />
      <h4 className="mt-4">Rezervasyon Geçmişim</h4>

      {reservations.length === 0 ? (
        <p>Henüz rezervasyon bulunmamaktadır.</p>
      ) : (
        <table className="table table-bordered mt-3">
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
      )}
    </div>
  );
};

export default AccountPage;
