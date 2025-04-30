import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/user.css";


const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms/summary")
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("Oda özetleri alınamadı", err));
  }, []);

  return (
    <div className="user-section">
      <h2 className="text-center mb-5">Oda Kategorileri</h2>
      <div className="row g-4">
        {rooms.map((room) => (
          <div className="col-md-4" key={room.id}>
            <div className="card room-card h-100 shadow-sm">
              <img
                src={room.image_url || "/default-room.jpg"}
                className="card-img-top"
                alt={room.room_type}
              />
              <div className="card-body">
                <h5 className="card-title">{room.room_type}</h5>
                <p className="card-text">
                  {room.capacity} kişilik • {room.price_per_night} ₺ / gece
                </p>

                {room.status === "available" ? (
                  <Link to={`/rooms/${room.id}`} className="btn btn-primary w-100">
                    Uygun Odayı İncele
                  </Link>
                ) : (
                  <div className="text-center text-muted mt-3">
                    <p className="mb-2">
                      En erken <strong>{room.next_available?.split("T")[0]}</strong> tarihinde müsait
                    </p>
                    <Link to={`/rooms/${room.id}`} className="btn btn-outline-primary w-100">
                      İncele & Rezervasyon Yap
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
