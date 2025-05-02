import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId, reservationId, amount } = location.state || {};

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/payments",
        {
          customer_id: customerId,
          reservation_id: reservationId,
          amount: amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Ödeme başarılı!");
      navigate("/account");
    } catch (error) {
      console.error("Ödeme başarısız:", error);
      alert("Ödeme sırasında hata oluştu.");
    }
  };

  if (!customerId || !reservationId) {
    return <div className="container mt-5">Ödeme bilgisi bulunamadı.</div>;
  }

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Ödeme İşlemi</h2>
      <p>
        Ödemeniz gereken tutar: <strong>{amount} ₺</strong>
      </p>
      <button className="btn btn-success mt-3" onClick={handlePayment}>
        Ödeme Yap
      </button>
    </div>
  );
};

export default PaymentPage;
