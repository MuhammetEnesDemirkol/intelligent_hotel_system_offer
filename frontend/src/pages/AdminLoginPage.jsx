import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        formData
      );
      localStorage.setItem("adminToken", response.data.token);
      alert("Giriş başarılı!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Giriş başarısız:", error);
      alert("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h2 className="admin-login-title">Admin Girişi</h2>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <input
              type="text"
              className="admin-input"
              name="username"
              placeholder="Kullanıcı Adı"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="admin-form-group">
            <input
              type="password"
              className="admin-input"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="admin-button">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
