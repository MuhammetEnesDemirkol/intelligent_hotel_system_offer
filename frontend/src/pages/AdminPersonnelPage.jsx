import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminPersonnelPage = () => {
  const [personnel, setPersonnel] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mevcut görevler
  const availableRoles = [
    "Resepsiyon",
    "Temizlik Görevlisi",
    "Güvenlik",
    "Mutfak Personeli",
    "Yönetici",
    "Teknik Servis",
    "Muhasebe",
  ];

  const fetchPersonnel = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get("http://localhost:5000/api/personnel", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPersonnel(res.data);
    } catch (error) {
      console.error("Error fetching personnel:", error);
      setError("Personel listesi alınamadı");
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !phone || !role) {
      setError("Tüm alanlar zorunludur");
      return;
    }

    const token = localStorage.getItem("adminToken");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/personnel",
        {
          name,
          phone,
          role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setSuccess("Personel başarıyla eklendi");
        setName("");
        setPhone("");
        setRole("");
        fetchPersonnel();
      }
    } catch (error) {
      console.error("Error adding personnel:", error);
      setError("Personel eklenemedi");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (window.confirm("Bu personeli silmek istediğinizden emin misiniz?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/personnel/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setSuccess("Personel başarıyla silindi");
          fetchPersonnel();
        }
      } catch (error) {
        console.error("Error deleting personnel:", error);
        setError("Personel silinemedi");
      }
    }
  };

  return (
    <div className="admin-personnel-page">
      <div className="admin-personnel-container">
        <h2 className="admin-personnel-title">Personel Yönetimi</h2>

        {/* Hata ve Başarı Mesajları */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Yeni Personel Ekleme Formu */}
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <div className="form-field">
              <label htmlFor="name">Ad Soyad</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Personel adı ve soyadı"
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Telefon</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon numarası"
              />
            </div>
            <div className="form-field">
              <label htmlFor="role">Görev</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Görev seçin</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="admin-add-btn">
            Personel Ekle
          </button>
        </form>

        {/* Personel Tablosu */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Telefon</th>
                <th>Görev</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.phone}</td>
                  <td>{person.role}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="admin-delete-btn"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPersonnelPage;
