import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/reservation.css";

const ReservationForm = ({ roomId, roomPrice, onReservationSuccess }) => {
  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    total_price: 0,
  });
  const [customerData, setCustomerData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`http://localhost:5000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomerData(response.data);
    } catch (error) {
      console.error("Müşteri bilgileri yüklenirken hata:", error);
    }
  };

  const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await axios.post(
        "http://localhost:5000/api/reservations/check-availability",
        {
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.isAvailable;
    } catch (error) {
      console.error("Müsaitlik kontrolü sırasında hata:", error);
      return false;
    }
  };

  const calculateTotalPrice = () => {
    if (!formData.check_in || !formData.check_out) return 0;

    const startDate = new Date(formData.check_in);
    const endDate = new Date(formData.check_out);

    // Tarihler arasındaki gece sayısını hesapla
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Oda fiyatını ve gece sayısını çarp
    return diffDays * roomPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Oda müsaitlik kontrolü
      const isAvailable = await checkRoomAvailability(
        roomId,
        formData.check_in,
        formData.check_out
      );

      if (!isAvailable) {
        setModalMessage("Bu tarihler arasında oda müsait değil");
        setShowModal(true);
        return;
      }

      const totalPrice = calculateTotalPrice();

      // Rezervasyon oluştur
      const response = await axios.post(
        "http://localhost:5000/api/reservations",
        {
          customer_id: customerData.id,
          room_id: roomId,
          check_in: formData.check_in,
          check_out: formData.check_out,
          total_price: totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModalMessage("Rezervasyon başarıyla oluşturuldu");
      setShowModal(true);
      onReservationSuccess(response.data);
    } catch (error) {
      console.error("Rezervasyon oluşturulurken hata:", error);
      setModalMessage("Rezervasyon oluşturulurken bir hata oluştu");
      setShowModal(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="reservation-form">
      <h2>Rezervasyon Yap</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Giriş Tarihi</label>
          <input
            type="date"
            name="check_in"
            value={formData.check_in}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Çıkış Tarihi</label>
          <input
            type="date"
            name="check_out"
            value={formData.check_out}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Toplam Tutar</label>
          <input type="text" value={`${calculateTotalPrice()} ₺`} readOnly />
        </div>
        <button type="submit" className="submit-btn">
          Rezervasyon Yap
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Bilgi</h3>
            <p>{modalMessage}</p>
            <button
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
