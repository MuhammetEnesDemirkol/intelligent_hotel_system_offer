import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Ödemeler alınamadı:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Ödeme Kayıtları</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Müşteri</th>
            <th>Rezervasyon ID</th>
            <th>Tutar (₺)</th>
            <th>Tarih</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.full_name}</td>
              <td>{payment.reservation_id}</td>
              <td>{payment.amount}</td>
              <td>{payment.payment_date}</td>
              <td>
                <span className="badge bg-success">{payment.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPaymentsPage;
