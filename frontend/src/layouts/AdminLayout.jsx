import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../styles/admin.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <h3>Yönetim</h3>
        <ul>
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/rooms">Odalar</a></li>
          <li><a href="/admin/rooms-status">Oda Durumu</a></li>
          <li><a href="/admin/room-pricing">Fiyat Yönetimi</a></li>
          <li><a href="/admin/reservations">Rezervasyonlar</a></li>
          <li><a href="/admin/customers">Müşteriler</a></li>
          <li><a href="/admin/payments">Ödemeler</a></li>
          <li><a href="/admin/housekeeping">Temizlik</a></li>
        </ul>
        <button onClick={handleLogout} className="btn-logout-admin">
          Çıkış Yap
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
