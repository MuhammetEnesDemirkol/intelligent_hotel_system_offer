import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    alert("Çıkış yapıldı.");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">
        Otel Yönetim
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Anasayfa
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/rooms">
              Odalar
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reservation">
              Rezervasyon Yap
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin">
              Admin Paneli
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/account">
                  Hesabım
                </Link>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm ms-3"
                >
                  Çıkış Yap
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Giriş Yap
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Kayıt Ol
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
