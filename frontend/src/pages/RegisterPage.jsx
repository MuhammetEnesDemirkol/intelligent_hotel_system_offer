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
    <div className="container mt-5">
      <h2 className="text-center mb-4">Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="full_name"
            placeholder="Ad Soyad"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
