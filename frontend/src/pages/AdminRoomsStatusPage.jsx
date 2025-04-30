import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminRoomsStatusPage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Odalar getirilemedi:", error);
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "available":
        return "admin-status-available";
      case "occupied":
        return "admin-status-occupied";
      case "cleaning":
        return "admin-status-cleaning";
      case "maintenance":
        return "admin-status-maintenance";
      default:
        return "";
    }
  };

  return (
    <div className="admin-status-page">
      <div className="admin-status-container">
        <h2 className="admin-status-title">Oda Durumları</h2>
        <div className="admin-status-grid">
          {rooms.map((room) => (
            <div className="admin-room-card" key={room.id}>
              <div className="admin-room-content">
                <h5 className="admin-room-title">Oda No: {room.room_number}</h5>
                <p className="admin-room-info">Tür: {room.room_type}</p>
                <p className="admin-room-info">Kapasite: {room.capacity}</p>
                <p className="admin-room-info">
                  Fiyat: {room.price_per_night} ₺
                </p>
                <span
                  className={`admin-status-badge ${getBadgeColor(room.status)}`}
                >
                  {room.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRoomsStatusPage;
