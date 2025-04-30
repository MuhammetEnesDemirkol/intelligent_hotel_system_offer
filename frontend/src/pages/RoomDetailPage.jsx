import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/user.css";

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
  });

  useEffect(() => {
    // Oda bilgisi
    axios
      .get(`http://localhost:5000/api/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch((err) => console.error("Oda bilgisi alınamadı", err));

    // Oda rezervasyonları
    axios
      .get(`http://localhost:5000/api/rooms/${id}/reservations`)
      .then((res) => setReservations(res.data))
      .catch((err) => console.error("Rezervasyonlar alınamadı", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReservation = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Rezervasyon yapmak için giriş yapmalısınız.");
      navigate("/login");
      return;
    }

    navigate("/reservation", {
      state: {
        roomId: room.id,
        checkIn: formData.check_in,
        checkOut: formData.check_out,
        price: room.price_per_night,
      },
    });
  };

  if (!room) return <div className="room-detail-page">Yükleniyor...</div>;

  return (
    <div className="room-detail-page">
      <div className="room-detail-container">
        <div className="room-detail-header">
          <h2 className="room-detail-title">Oda No: {room.room_number}</h2>
        </div>

        <img
          src={room.image_url || "/images/room-1.png"}
          className="room-detail-image"
          alt={`Oda ${room.room_number}`}
        />

        <div className="room-detail-info">
          <div className="room-detail-item">
            <div className="room-detail-label">Tür</div>
            <div className="room-detail-value">{room.room_type}</div>
          </div>
          <div className="room-detail-item">
            <div className="room-detail-label">Kapasite</div>
            <div className="room-detail-value">{room.capacity} kişi</div>
          </div>
          <div className="room-detail-item">
            <div className="room-detail-label">Fiyat</div>
            <div className="room-detail-price">
              {room.price_per_night} ₺ / gece
            </div>
          </div>
          <div className="room-detail-item">
            <div className="room-detail-label">Açıklama</div>
            <div className="room-detail-value">{room.description}</div>
          </div>
        </div>

        {/* Rezerve Günler */}
        <div className="room-reserved-dates mt-4">
          <h5>Rezerve Günler</h5>
          {reservations.length === 0 ? (
            <p className="text-muted">Bu odada henüz rezervasyon yok.</p>
          ) : (
            <ul className="list-group">
              {reservations.map((r, i) => (
                <li key={i} className="list-group-item">
                  {r.check_in.split("T")[0]} → {r.check_out.split("T")[0]}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="reservation-form-card">
          <h4 className="reservation-form-title">Bu Odayı Rezerve Et</h4>
          <div className="reservation-form-group">
            <label className="reservation-form-label">Giriş Tarihi</label>
            <input
              type="date"
              className="reservation-form-input"
              name="check_in"
              value={formData.check_in}
              onChange={handleChange}
              required
            />
          </div>
          <div className="reservation-form-group">
            <label className="reservation-form-label">Çıkış Tarihi</label>
            <input
              type="date"
              className="reservation-form-input"
              name="check_out"
              value={formData.check_out}
              onChange={handleChange}
              required
            />
          </div>
          <button className="reservation-button" onClick={handleReservation}>
            Rezervasyon Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
