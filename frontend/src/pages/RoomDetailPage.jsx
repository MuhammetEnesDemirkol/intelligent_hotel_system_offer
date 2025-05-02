import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReservationForm from "../components/ReservationForm";
import "../styles/room-detail.css";

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      axios
        .get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        });
    };

    checkAuth();

    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/rooms/${id}`
        );
        setRoom(response.data);
      } catch (err) {
        setError("Oda bilgileri yüklenemedi");
        console.error("Oda bilgileri yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailability = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/rooms/${id}/availability`,
          {
            params: {
              month: selectedMonth + 1,
              year: selectedYear,
            },
          }
        );
        setAvailability(response.data);
      } catch (err) {
        console.error("Müsaitlik bilgileri yüklenirken hata:", err);
      }
    };

    fetchRoom();
    fetchAvailability();
  }, [id, selectedMonth, selectedYear]);

  const handleReservationClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/rooms/${id}` } });
      return;
    }
  };

  const handleMonthChange = (increment) => {
    const newMonth = selectedMonth + increment;
    if (newMonth < 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else if (newMonth > 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(newMonth);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateAvailable = (date) => {
    const dateString = date.toISOString().split("T")[0];
    const availabilityData = availability.find(
      (avail) => avail.date === dateString
    );
    return availabilityData ? availabilityData.is_available : true;
  };

  const handleReservationSuccess = () => {
    setModalMessage("Rezervasyon başarıyla oluşturuldu!");
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Tekrar Dene</button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="not-found-container">
        <i className="fas fa-search"></i>
        <p>Oda bulunamadı</p>
        <button onClick={() => navigate("/rooms")}>Odalara Dön</button>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);
  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  return (
    <div className="room-detail-container">
      <div className="room-header">
        <div className="room-title-section">
          <h1>Oda {room.room_number}</h1>
          <div className="room-status-badge">
            <span className={`status ${room.status.toLowerCase()}`}>
              {room.status === "available" ? "Müsait" : "Dolu"}
            </span>
          </div>
        </div>
        <div className="room-price-tag">
          <span className="price">{room.price_per_night} ₺</span>
          <span className="per-night">/gece</span>
        </div>
      </div>

      <div className="room-content">
        <div className="room-gallery">
          <div className="main-image">
            <img src={"/images/room-1.png"} alt={`Oda ${room.room_number}`} />
          </div>
        </div>

        <div className="room-info-section">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              <i className="fas fa-info-circle"></i> Detaylar
            </button>
            <button
              className={`tab ${activeTab === "availability" ? "active" : ""}`}
              onClick={() => setActiveTab("availability")}
            >
              <i className="fas fa-calendar-alt"></i> Müsaitlik
            </button>
            <button
              className={`tab ${activeTab === "reservation" ? "active" : ""}`}
              onClick={() => setActiveTab("reservation")}
            >
              <i className="fas fa-calendar-check"></i> Rezervasyon
            </button>
          </div>

          {activeTab === "details" && (
            <div className="tab-content">
              <div className="room-details">
                <div className="detail-group">
                  <h3>
                    <i className="fas fa-bed"></i> Oda Bilgileri
                  </h3>
                  <div className="detail-item">
                    <span className="label">Oda Tipi:</span>
                    <span className="value">{room.room_type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Kapasite:</span>
                    <span className="value">{room.capacity} kişi</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Yatak Tipi:</span>
                    <span className="value">{room.bed_type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Manzara:</span>
                    <span className="value">{room.view}</span>
                  </div>
                </div>

                <div className="amenities-group">
                  <h3>
                    <i className="fas fa-star"></i> Oda Özellikleri
                  </h3>
                  <div className="amenities-grid">
                    {room.has_ac && (
                      <div className="amenity-item">
                        <i className="fas fa-snowflake"></i>
                        <span>Klima</span>
                      </div>
                    )}
                    {room.has_wifi && (
                      <div className="amenity-item">
                        <i className="fas fa-wifi"></i>
                        <span>Wi-Fi</span>
                      </div>
                    )}
                    {room.has_minibar && (
                      <div className="amenity-item">
                        <i className="fas fa-wine-bottle"></i>
                        <span>Minibar</span>
                      </div>
                    )}
                    {room.has_balcony && (
                      <div className="amenity-item">
                        <i className="fas fa-door-open"></i>
                        <span>Balkon</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "availability" && (
            <div className="tab-content">
              <div className="availability-section">
                <div className="calendar-controls">
                  <button
                    onClick={() => handleMonthChange(-1)}
                    className="calendar-nav-btn"
                  >
                    ←
                  </button>
                  <span className="calendar-title">
                    {monthNames[selectedMonth]} {selectedYear}
                  </span>
                  <button
                    onClick={() => handleMonthChange(1)}
                    className="calendar-nav-btn"
                  >
                    →
                  </button>
                </div>

                <div className="calendar">
                  <div className="calendar-header">
                    <span>Pzt</span>
                    <span>Sal</span>
                    <span>Çar</span>
                    <span>Per</span>
                    <span>Cum</span>
                    <span>Cmt</span>
                    <span>Paz</span>
                  </div>
                  <div className="calendar-body">
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="calendar-day empty"
                      ></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const date = new Date(
                        selectedYear,
                        selectedMonth,
                        index + 1
                      );
                      const isAvailable = isDateAvailable(date);
                      return (
                        <div
                          key={`day-${index}`}
                          className={`calendar-day ${
                            isAvailable ? "available" : "unavailable"
                          }`}
                        >
                          {index + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="availability-legend">
                  <div className="legend-item">
                    <div className="legend-color available"></div>
                    <span>Müsait</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color unavailable"></div>
                    <span>Dolu</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reservation" && (
            <div className="tab-content">
              <div className="reservation-section">
                {isAuthenticated ? (
                  <ReservationForm
                    roomId={room.id}
                    roomPrice={room.price_per_night}
                    onReservationSuccess={handleReservationSuccess}
                  />
                ) : (
                  <div className="auth-required">
                    <i className="fas fa-lock"></i>
                    <p>Rezervasyon yapmak için giriş yapmalısınız.</p>
                    <button
                      onClick={handleReservationClick}
                      className="login-btn"
                    >
                      Giriş Yap
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <i className="fas fa-check-circle success-icon"></i>
            <h3>Başarılı!</h3>
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

export default RoomDetailPage;
