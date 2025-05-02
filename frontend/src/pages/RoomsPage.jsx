import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/user.css";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    roomType: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
    hasAc: false,
    hasWifi: false,
    hasMinibar: false,
    hasBalcony: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms/summary")
      .then((res) => {
        setRooms(res.data);
        setFilteredRooms(res.data);
      })
      .catch((err) => console.error("Oda özetleri alınamadı", err));
  }, []);

  useEffect(() => {
    let filtered = [...rooms];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.room_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Oda tipi filtresi
    if (filters.roomType) {
      filtered = filtered.filter((room) => room.room_type === filters.roomType);
    }

    // Fiyat filtresi
    if (filters.minPrice) {
      filtered = filtered.filter(
        (room) => room.price_per_night >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (room) => room.price_per_night <= Number(filters.maxPrice)
      );
    }

    // Kapasite filtresi
    if (filters.capacity) {
      filtered = filtered.filter(
        (room) => room.capacity === Number(filters.capacity)
      );
    }

    // Özellik filtreleri
    if (filters.hasAc) {
      filtered = filtered.filter((room) => room.has_ac);
    }
    if (filters.hasWifi) {
      filtered = filtered.filter((room) => room.has_wifi);
    }
    if (filters.hasMinibar) {
      filtered = filtered.filter((room) => room.has_minibar);
    }
    if (filters.hasBalcony) {
      filtered = filtered.filter((room) => room.has_balcony);
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const uniqueRoomTypes = [...new Set(rooms.map((room) => room.room_type))];

  return (
    <div className="user-section">
      <h2 className="text-center mb-5">Oda Kategorileri</h2>

      {/* Arama ve Filtreleme Alanı */}
      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Oda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Oda Tipi</label>
            <select
              name="roomType"
              value={filters.roomType}
              onChange={handleFilterChange}
            >
              <option value="">Tümü</option>
              {uniqueRoomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Fiyat Aralığı</label>
            <div className="price-range">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <span>-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Kapasite</label>
            <select
              name="capacity"
              value={filters.capacity}
              onChange={handleFilterChange}
            >
              <option value="">Tümü</option>
              <option value="1">1 Kişi</option>
              <option value="2">2 Kişi</option>
              <option value="3">3 Kişi</option>
              <option value="4">4 Kişi</option>
            </select>
          </div>

          <div className="filter-group features">
            <label>Özellikler</label>
            <div className="feature-checkboxes">
              <label>
                <input
                  type="checkbox"
                  name="hasAc"
                  checked={filters.hasAc}
                  onChange={handleFilterChange}
                />
                Klima
              </label>
              <label>
                <input
                  type="checkbox"
                  name="hasWifi"
                  checked={filters.hasWifi}
                  onChange={handleFilterChange}
                />
                WiFi
              </label>
              <label>
                <input
                  type="checkbox"
                  name="hasMinibar"
                  checked={filters.hasMinibar}
                  onChange={handleFilterChange}
                />
                Minibar
              </label>
              <label>
                <input
                  type="checkbox"
                  name="hasBalcony"
                  checked={filters.hasBalcony}
                  onChange={handleFilterChange}
                />
                Balkon
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Oda Listesi */}
      <div className="rooms-grid">
        {filteredRooms.map((room) => (
          <div className="room-card" key={room.id}>
            <div className="room-image-container">
              <img
                src={"/images/room-1.png"}
                alt={room.room_type}
                className="room-image"
              />
              <div className="room-status-badge">
                {room.status === "available" ? "Müsait" : "Dolu"}
              </div>
            </div>

            <div className="room-content">
              <div className="room-header">
                <h3 className="room-title">{room.room_type}</h3>
                <div className="room-price">
                  {room.price_per_night} ₺ <span>/ gece</span>
                </div>
              </div>

              <div className="room-details">
                <div className="room-feature">
                  <i className="fas fa-user-friends"></i>
                  <span>{room.capacity} Kişilik</span>
                </div>
                <div className="room-feature">
                  <i className="fas fa-bed"></i>
                  <span>{room.bed_type}</span>
                </div>
                <div className="room-feature">
                  <i className="fas fa-mountain"></i>
                  <span>{room.view}</span>
                </div>
              </div>

              <div className="room-amenities">
                <div className="amenity-group">
                  <h4>Oda Özellikleri</h4>
                  <div className="amenity-list">
                    {room.has_ac && (
                      <div className="amenity-item">
                        <i className="fas fa-snowflake"></i>
                        <span>Klima</span>
                      </div>
                    )}
                    {room.has_wifi && (
                      <div className="amenity-item">
                        <i className="fas fa-wifi"></i>
                        <span>WiFi</span>
                      </div>
                    )}
                    {room.has_minibar && (
                      <div className="amenity-item">
                        <i className="fas fa-glass-martini-alt"></i>
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

              <p className="room-description">{room.description}</p>

              <div className="room-actions">
                {room.status === "available" ? (
                  <Link to={`/rooms/${room.id}`} className="book-button">
                    Rezervasyon Yap
                  </Link>
                ) : (
                  <div className="unavailable-info">
                    <p>
                      En erken{" "}
                      <strong>{room.next_available?.split("T")[0]}</strong>{" "}
                      tarihinde müsait
                    </p>
                    <Link to={`/rooms/${room.id}`} className="view-button">
                      Detayları Gör
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
