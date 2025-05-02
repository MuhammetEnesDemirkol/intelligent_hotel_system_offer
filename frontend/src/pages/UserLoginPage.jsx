import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLoginPage = () => {
  const [formData, setFormData] = useState({
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
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      alert("Giriş başarılı!");
      navigate("/");
    } catch (error) {
      console.error("Giriş başarısız:", error);
      alert("E-posta veya şifre hatalı.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">Giriş Yap</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
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
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLoginPage;
