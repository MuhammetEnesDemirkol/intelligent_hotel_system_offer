import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error) {
      console.error("Kayıt başarısız:", error);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">Kayıt Ol</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <input
              type="text"
              className="auth-input"
              name="full_name"
              placeholder="Ad Soyad"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-form-group">
            <input
              type="email"
              className="auth-input"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-form-group">
            <input
              type="password"
              className="auth-input"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
