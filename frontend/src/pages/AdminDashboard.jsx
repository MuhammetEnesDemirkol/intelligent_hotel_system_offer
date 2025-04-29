import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Paneline Hoş Geldiniz</h2>
      <div className="row justify-content-center">
        <div className="col-md-3 mb-3">
          <Link to="/admin/rooms" className="btn btn-primary w-100">Oda Yönetimi</Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/admin/customers" className="btn btn-success w-100">Müşteri Yönetimi</Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/admin/reservations" className="btn btn-warning w-100">Rezervasyon Yönetimi</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
