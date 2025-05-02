import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Müşteriler getirilemedi:", error);
      setError("Müşteriler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setEditForm({
      full_name: customer.full_name,
      email: customer.email,
      phone: customer.phone || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:5000/api/users/${editingCustomer.id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error("Müşteri güncellenemedi:", error);
      setError("Müşteri güncellenirken bir hata oluştu");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu müşteriyi silmek istediğinizden emin misiniz?"))
      return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
    } catch (error) {
      console.error("Müşteri silinemedi:", error);
      setError("Müşteri silinirken bir hata oluştu");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active") return matchesSearch && customer.is_active;
    if (filterStatus === "inactive")
      return matchesSearch && !customer.is_active;

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="admin-customers-page">
        <div className="admin-customers-container">
          <h2 className="admin-customers-title">Müşteri Yönetimi</h2>
          <div className="loading-message">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-customers-page">
        <div className="admin-customers-container">
          <h2 className="admin-customers-title">Müşteri Yönetimi</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-customers-page">
      <div className="admin-customers-container">
        <h2 className="admin-customers-title">Müşteri Yönetimi</h2>

        <div className="admin-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filter">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>

        <table className="admin-customers-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Kayıt Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data-message">
                  Henüz müşteri kaydı bulunmuyor
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    {editingCustomer?.id === customer.id ? (
                      <input
                        type="text"
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleEditChange}
                        className="admin-input"
                      />
                    ) : (
                      customer.full_name
                    )}
                  </td>
                  <td>
                    {editingCustomer?.id === customer.id ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="admin-input"
                      />
                    ) : (
                      <a
                        href={`mailto:${customer.email}`}
                        className="admin-customer-email"
                      >
                        {customer.email}
                      </a>
                    )}
                  </td>
                  <td>
                    {editingCustomer?.id === customer.id ? (
                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="admin-input"
                      />
                    ) : (
                      customer.phone || "-"
                    )}
                  </td>
                  <td>
                    {new Date(customer.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td>
                    {editingCustomer?.id === customer.id ? (
                      <div className="admin-customer-actions">
                        <button
                          className="admin-save-button"
                          onClick={handleEditSubmit}
                        >
                          Kaydet
                        </button>
                        <button
                          className="admin-cancel-button"
                          onClick={() => setEditingCustomer(null)}
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <div className="admin-customer-actions">
                        <button
                          className="admin-edit-button"
                          onClick={() => handleEdit(customer)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="admin-delete-button"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Sil
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
