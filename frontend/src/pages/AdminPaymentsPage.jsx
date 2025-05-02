import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Ödemeler alınamadı:", error);
      setError("Ödemeler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-payments-page">
        <div className="admin-payments-container">
          <h2 className="admin-payments-title">Ödeme Kayıtları</h2>
          <div className="loading-message">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-payments-page">
        <div className="admin-payments-container">
          <h2 className="admin-payments-title">Ödeme Kayıtları</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-payments-page">
      <div className="admin-payments-container">
        <h2 className="admin-payments-title">Ödeme Kayıtları</h2>
        <table className="admin-payments-table">
          <thead>
            <tr>
              <th>Müşteri Adı</th>
              <th>E-posta</th>
              <th>Rezervasyon ID</th>
              <th>Giriş Tarihi</th>
              <th>Çıkış Tarihi</th>
              <th>Tutar</th>
              <th>Ödeme Tarihi</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data-message">
                  Henüz ödeme kaydı bulunmuyor
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.customer_full_name || payment.customer_name}</td>
                  <td>{payment.customer_email}</td>
                  <td>{payment.reservation_id}</td>
                  <td>{formatDate(payment.check_in)}</td>
                  <td>{formatDate(payment.check_out)}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{formatDate(payment.payment_date)}</td>
                  <td>
                    <span
                      className={`admin-payment-status ${payment.status?.toLowerCase()}`}
                    >
                      {payment.status}
                    </span>
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

export default AdminPaymentsPage;
