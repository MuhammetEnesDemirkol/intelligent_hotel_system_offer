import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Müşteriler getirilemedi:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu odayı silmek istediğinizden emin misiniz?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchCustomers(); // Yeniden yükle
    } catch (error) {
      console.error("Oda silinemedi:", error);
    }
  };

  return (
    <div className="admin-customers-page">
      <div className="admin-customers-container">
        <h2 className="admin-customers-title">Müşteri Yönetimi</h2>
        <table className="admin-customers-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.full_name}</td>
                <td>
                  <a
                    href={`mailto:${customer.email}`}
                    className="admin-customer-email"
                  >
                    {customer.email}
                  </a>
                </td>
                <td>{customer.phone}</td>
                <td>
                  <button
                    className="admin-customer-delete"
                    onClick={() => handleDelete(customer.id)}
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
  );
};

export default AdminCustomersPage;
