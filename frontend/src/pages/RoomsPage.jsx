import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/user.css";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("Odalar alınamadı", err));
  }, []);

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h2 className="rooms-title">Odalarımız</h2>
      </div>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room.id}>
            <img
              src={"/images/room-1.png"}
              className="room-image"
              alt={`Oda ${room.room_number}`}
            />
            <div className="room-content">
              <h5 className="room-title">Oda No: {room.room_number}</h5>
              <p className="room-details">
                {room.room_type} • {room.capacity} kişilik
              </p>
              <p className="room-price">{room.price_per_night} ₺ / gece</p>
              <Link
                to={`/rooms/${room.id}`}
                className="btn btn-outline-primary room-button"
              >
                Detayları Gör
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
