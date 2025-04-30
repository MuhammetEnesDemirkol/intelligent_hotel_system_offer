import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/user.css";

const ReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [availableRooms, setAvailableRooms] = useState([]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    person_count: "",
    room_id: "",
    check_in: "",
    check_out: "",
    total_price: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms")
      .then((res) => setAvailableRooms(res.data))
      .catch((err) => console.error("Odalar getirilemedi:", err));
  }, []);

  useEffect(() => {
    if (location.state) {
      const { roomId, checkIn, checkOut, price } = location.state;

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const dayCount = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

      setFormData((prev) => ({
        ...prev,
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        total_price: dayCount * price,
      }));
    }
  }, [location.state]);

  // Fiyatı otomatik hesapla
  useEffect(() => {
    const room = availableRooms.find(
      (r) => r.id === parseInt(formData.room_id)
    );
    if (room && formData.check_in && formData.check_out) {
      const d1 = new Date(formData.check_in);
      const d2 = new Date(formData.check_out);
      const dayCount = (d2 - d1) / (1000 * 60 * 60 * 24);
      setFormData((prev) => ({
        ...prev,
        total_price: dayCount > 0 ? dayCount * room.price_per_night : 0,
      }));
    }
  }, [formData.room_id, formData.check_in, formData.check_out, availableRooms]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
  
      if (!token) {
        alert("Lütfen giriş yapınız.");
        navigate("/login");
        return;
      }
  
      // 1. Müşteri kaydı
      const customerRes = await axios.post(
        "http://localhost:5000/api/customers",
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const customerId = customerRes.data.id;
  
      // 2. Rezervasyon
      const reservationRes = await axios.post(
        "http://localhost:5000/api/reservations",
        {
          customer_id: customerId,
          room_id: formData.room_id,
          check_in: formData.check_in,
          check_out: formData.check_out,
          total_price: formData.total_price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // 3. Ödeme oluştur
      await axios.post(
        "http://localhost:5000/api/payments",
        {
          customer_id: customerId,
          reservation_id: reservationRes.data.id,
          amount: formData.total_price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert("Rezervasyon ve ödeme başarıyla oluşturuldu!");
      navigate("/account");
    } catch (error) {
      console.error("Rezervasyon başarısız:", error);
      alert("Bir hata oluştu.");
    }
  };
  

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <div className="reservation-header">
          <h2 className="reservation-title">Rezervasyon Yap</h2>
        </div>
        <form onSubmit={handleReservation} className="reservation-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              name="full_name"
              placeholder="Ad Soyad"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              name="phone"
              placeholder="Telefon"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Kişi Sayısı */}
          <div className="form-group">
            <label className="form-label">Kişi Sayısı</label>
            <input
              type="number"
              className="form-input"
              name="person_count"
              value={formData.person_count}
              onChange={handleChange}
              required
            />
          </div>

          {/* Oda Seçimi */}
          {formData.person_count && (
            <div className="form-group">
              <label className="form-label">Oda Seçin</label>
              <select
                className="form-select"
                name="room_id"
                value={formData.room_id}
                onChange={handleChange}
                required
              >
                <option value="">Uygun Oda Seçin</option>
                {availableRooms
                  .filter(
                    (room) => room.capacity === Number(formData.person_count)
                  )
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_number} • {room.room_type} • {room.capacity}{" "}
                      kişi
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Tarih ve fiyat */}
          <div className="form-group">
            <label className="form-label">Giriş Tarihi</label>
            <input
              type="date"
              className="form-input"
              name="check_in"
              value={formData.check_in}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Çıkış Tarihi</label>
            <input
              type="date"
              className="form-input"
              name="check_out"
              value={formData.check_out}
              onChange={handleChange}
              required
            />
          </div>
          <div className="price-display">
            Toplam Fiyat: {formData.total_price.toFixed(2)} ₺
          </div>

          <button type="submit" className="submit-button">
            Rezervasyonu Tamamla
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage;
