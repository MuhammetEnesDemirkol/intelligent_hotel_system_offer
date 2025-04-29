import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationPage = () => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    room_id: '',
    check_in: '',
    check_out: '',
    total_price: 0,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      setRooms(response.data.filter(room => room.status === 'available')); // sadece boş odalar
    } catch (error) {
      console.error('Odalar getirilemedi:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    try {
      // Önce müşteri kaydı yap
      const customerRes = await axios.post('http://localhost:5000/api/customers', {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
      });

      const customerId = customerRes.data.id;

      // Tarihlerden gün sayısını hesapla
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      const dayCount = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

      // Seçilen odanın fiyatını bul
      const selectedRoom = rooms.find(room => room.id === parseInt(formData.room_id));
      const price = dayCount * selectedRoom.price_per_night;

      // Sonra rezervasyon kaydı yap
      await axios.post('http://localhost:5000/api/reservations', {
        customer_id: customerId,
        room_id: formData.room_id,
        check_in: formData.check_in,
        check_out: formData.check_out,
        total_price: price,
      });

      alert('Rezervasyon başarıyla oluşturuldu!');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        room_id: '',
        check_in: '',
        check_out: '',
        total_price: 0,
      });
    } catch (error) {
      console.error('Rezervasyon başarısız:', error);
      alert('Bir hata oluştu.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Rezervasyon Yap</h2>
      <form onSubmit={handleReservation}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="full_name"
            placeholder="Ad Soyad"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="phone"
            placeholder="Telefon"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            required
          >
            <option value="">Oda Seçiniz</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.room_number} - {room.room_type} ({room.capacity} kişi)
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Giriş Tarihi</label>
          <input
            type="date"
            className="form-control"
            name="check_in"
            value={formData.check_in}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Çıkış Tarihi</label>
          <input
            type="date"
            className="form-control"
            name="check_out"
            value={formData.check_out}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Rezervasyon Yap</button>
      </form>
    </div>
  );
};

export default ReservationPage;
