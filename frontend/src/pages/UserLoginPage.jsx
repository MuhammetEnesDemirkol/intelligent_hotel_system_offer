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
      localStorage.setItem("userToken", response.data.token);
      alert("Giriş başarılı!");
      navigate("/");
    } catch (error) {
      console.error("Giriş başarısız:", error);
      alert("E-posta veya şifre hatalı.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary w-100">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default UserLoginPage;
