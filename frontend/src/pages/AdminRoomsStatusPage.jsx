import React, { useEffect, useState } from "react";
import axios from "axios";

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
        return "bg-success";
      case "occupied":
        return "bg-danger";
      case "cleaning":
        return "bg-warning text-dark";
      case "maintenance":
        return "bg-secondary";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Oda Durumları</h2>
      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-4 mb-3" key={room.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Oda No: {room.room_number}</h5>
                <p className="card-text">Tür: {room.room_type}</p>
                <p className="card-text">Kapasite: {room.capacity}</p>
                <p className="card-text">Fiyat: {room.price_per_night} ₺</p>
                <span className={`badge ${getBadgeColor(room.status)} p-2`}>
                  {room.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRoomsStatusPage;
