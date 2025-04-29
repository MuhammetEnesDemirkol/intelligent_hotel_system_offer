import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">Otel Yönetim</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Anasayfa</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/rooms">Odalar</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reservation">Rezervasyon Yap</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin">Admin Paneli</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
