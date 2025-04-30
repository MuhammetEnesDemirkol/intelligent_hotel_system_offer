import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          🏨 OtelPro
        </Link>
        <Link to="/rooms">Odalar</Link>
        <Link to="/reservation">Rezervasyon</Link>
      </div>

      <div className="navbar-right">
        {!token ? (
          <>
            <Link to="/login">Giriş</Link>
            <Link to="/register" className="btn-register">
              Kayıt Ol
            </Link>
          </>
        ) : (
          <>
            <Link to="/account">Hesabım</Link>
            <button onClick={handleLogout} className="btn-logout">
              Çıkış Yap
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
