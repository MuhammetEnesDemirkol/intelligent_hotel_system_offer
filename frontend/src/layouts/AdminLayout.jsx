import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <h3>Yönetim</h3>
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/rooms">Odalar</Link>
          </li>
          <li>
            <Link to="/admin/rooms-status">Oda Durumları</Link>
          </li>
          <li>
            <Link to="/admin/room-pricing">Fiyat Yönetimi</Link>
          </li>
          <li>
            <Link to="/admin/customers">Müşteriler</Link>
          </li>
          <li>
            <Link to="/admin/reservations">Rezervasyonlar</Link>
          </li>
          <li>
            <Link to="/admin/housekeeping">Temizlik Takibi</Link>
          </li>
          <li>
            <Link to="/admin/payments">Ödemeler</Link>
          </li>
        </ul>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
