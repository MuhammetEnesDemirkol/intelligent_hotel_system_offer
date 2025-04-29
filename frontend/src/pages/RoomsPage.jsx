import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Odalar getirilemedi:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Mevcut Odalar</h2>
      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-4 mb-4" key={room.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Oda No: {room.room_number}</h5>
                <p className="card-text">Tür: {room.room_type}</p>
                <p className="card-text">Kapasite: {room.capacity} kişi</p>
                <p className="card-text">Fiyat: {room.price_per_night}₺ / gece</p>
                <p className="card-text">Durum: {room.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
