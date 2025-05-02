import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    roomType: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Seçenek listeleri
  const roomTypes = [
    "Standart Oda",
    "Deluxe Oda",
    "Suit Oda",
    "Aile Odası",
    "Kral Dairesi",
  ];

  const bedTypes = [
    "Tek Kişilik",
    "Çift Kişilik",
    "İki Tek Kişilik",
    "Kral Yatak",
    "Yataklı Koltuk",
  ];

  const viewTypes = [
    "Deniz Manzarası",
    "Şehir Manzarası",
    "Bahçe Manzarası",
    "Havuz Manzarası",
    "Dağ Manzarası",
  ];

  const statusOptions = [
    { value: "available", label: "Müsait", color: "green" },
    { value: "reserved", label: "Rezerve", color: "red" },
    { value: "maintenance", label: "Bakımda", color: "orange" },
  ];

  const [newRoom, setNewRoom] = useState({
    room_number: "",
    room_type: roomTypes[0],
    capacity: "",
    price_per_night: "",
    status: "available",
    image_url: "",
    description: "",
    bed_type: bedTypes[0],
    has_ac: false,
    has_wifi: false,
    has_minibar: false,
    has_balcony: false,
    view: viewTypes[0],
  });

  // Arama ve filtreleme fonksiyonu
  const applyFiltersAndSearch = () => {
    let result = rooms;

    // Arama filtresi
    if (searchTerm) {
      result = result.filter((room) =>
        room.room_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Oda tipi filtresi
    if (filters.roomType) {
      result = result.filter((room) => room.room_type === filters.roomType);
    }

    // Durum filtresi
    if (filters.status) {
      result = result.filter((room) => room.status === filters.status);
    }

    // Sıralama
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredRooms(result);
  };

  // Sıralama fonksiyonu
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Toplu seçim fonksiyonu
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRooms(filteredRooms.map((room) => room.id));
    } else {
      setSelectedRooms([]);
    }
  };

  // Tekil seçim fonksiyonu
  const handleSelectRoom = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  // Toplu silme fonksiyonu
  const handleBulkDelete = async () => {
    if (!window.confirm("Seçili odaları silmek istediğinizden emin misiniz?"))
      return;
    setLoading(true);
    try {
      await Promise.all(
        selectedRooms.map((id) =>
          axios.delete(`http://localhost:5000/api/rooms/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          })
        )
      );
      setSelectedRooms([]);
      fetchRooms();
    } catch (error) {
      console.error("Odalar silinemedi:", error);
      setError("Odalar silinirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Toplu durum güncelleme fonksiyonu
  const handleBulkStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedRooms.map((id) =>
          axios.put(
            `http://localhost:5000/api/rooms/${id}`,
            { status: newStatus },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
            }
          )
        )
      );
      setSelectedRooms([]);
      fetchRooms();
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
      setError("Durum güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Hızlı durum güncelleme fonksiyonu
  const handleQuickStatusUpdate = async (roomId, newStatus) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/${roomId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      fetchRooms();
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
      setError("Durum güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [rooms, searchTerm, filters, sortConfig]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Odalar getirilemedi:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu odayı silmek istediğinizden emin misiniz?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchRooms();
    } catch (error) {
      console.error("Oda silinemedi:", error);
    }
  };

  const handleAddRoom = async () => {
    try {
      // Oda numarası kontrolü
      const existingRoom = rooms.find(
        (room) => room.room_number === newRoom.room_number
      );
      if (existingRoom) {
        setError("Bu oda numarası zaten kullanılıyor!");
        return;
      }

      const roomData = {
        ...newRoom,
        capacity: parseInt(newRoom.capacity),
        price_per_night: parseFloat(newRoom.price_per_night),
      };

      await axios.post("http://localhost:5000/api/rooms", roomData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setShowAddModal(false);
      setNewRoom({
        room_number: "",
        room_type: roomTypes[0],
        capacity: "",
        price_per_night: "",
        status: "available",
        image_url: "",
        description: "",
        bed_type: bedTypes[0],
        has_ac: false,
        has_wifi: false,
        has_minibar: false,
        has_balcony: false,
        view: viewTypes[0],
      });
      setError(null);
      fetchRooms();
    } catch (error) {
      console.error("Oda eklenemedi:", error);
      setError("Oda eklenirken bir hata oluştu!");
    }
  };

  const handleEditRoom = async () => {
    try {
      // Oda numarası kontrolü
      const existingRoom = rooms.find(
        (room) =>
          room.room_number === selectedRoom.room_number &&
          room.id !== selectedRoom.id
      );
      if (existingRoom) {
        setError("Bu oda numarası zaten kullanılıyor!");
        return;
      }

      const roomData = {
        ...selectedRoom,
        capacity: parseInt(selectedRoom.capacity),
        price_per_night: parseFloat(selectedRoom.price_per_night),
      };

      await axios.put(
        `http://localhost:5000/api/rooms/${selectedRoom.id}`,
        roomData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setShowEditModal(false);
      setError(null);
      fetchRooms();
    } catch (error) {
      console.error("Oda güncellenemedi:", error);
      setError("Oda güncellenirken bir hata oluştu!");
    }
  };

  const RoomCard = ({ room, onEdit, onDelete }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48">
          <img
            src={room.image_url || "https://via.placeholder.com/300x200"}
            alt={room.room_number}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                room.status === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {room.status === "available" ? "Müsait" : "Dolu"}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Oda {room.room_number}
            </h3>
            <span className="text-lg font-bold text-blue-600">
              {room.price_per_night} ₺
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Tip:</span>
              <span className="ml-2">{room.room_type}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Kapasite:</span>
              <span className="ml-2">{room.capacity} Kişi</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Yatak:</span>
              <span className="ml-2">{room.bed_type}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Manzara:</span>
              <span className="ml-2">{room.view}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {room.has_ac && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V5a1 1 0 011-1z" />
                  </svg>
                  Klima
                </div>
              )}
              {room.has_wifi && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V5a1 1 0 011-1z" />
                  </svg>
                  WiFi
                </div>
              )}
              {room.has_minibar && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V5a1 1 0 011-1z" />
                  </svg>
                  Minibar
                </div>
              )}
              {room.has_balcony && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V5a1 1 0 011-1z" />
                  </svg>
                  Balkon
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(room)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Düzenle
            </button>
            <button
              onClick={() => onDelete(room.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-rooms-page">
      <div className="admin-rooms-container">
        <h2 className="admin-rooms-title">Oda Yönetimi</h2>

        {/* Arama ve Filtreleme */}
        <div className="admin-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Oda numarası ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <select
              value={filters.roomType}
              onChange={(e) =>
                setFilters({ ...filters, roomType: e.target.value })
              }
            >
              <option value="">Tüm Oda Tipleri</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Tüm Durumlar</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toplu İşlem Butonları */}
        {selectedRooms.length > 0 && (
          <div className="bulk-actions">
            <button
              className="bulk-delete-btn"
              onClick={handleBulkDelete}
              disabled={loading}
            >
              {loading ? "İşleniyor..." : "Seçili Odaları Sil"}
            </button>
            <div className="bulk-status-update">
              <span>Durum Güncelle:</span>
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleBulkStatusUpdate(status.value)}
                  disabled={loading}
                  className={`status-btn ${status.value}`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="admin-add-btn" onClick={() => setShowAddModal(true)}>
          Yeni Oda Ekle
        </button>

        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRooms.length === filteredRooms.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort("room_number")}>
                Oda No{" "}
                {sortConfig.key === "room_number" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("room_type")}>
                Tür{" "}
                {sortConfig.key === "room_type" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("capacity")}>
                Kapasite{" "}
                {sortConfig.key === "capacity" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("price_per_night")}>
                Fiyat (₺){" "}
                {sortConfig.key === "price_per_night" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("status")}>
                Durum{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room.id)}
                    onChange={() => handleSelectRoom(room.id)}
                  />
                </td>
                <td>{room.room_number}</td>
                <td>{room.room_type}</td>
                <td>{room.capacity}</td>
                <td>{room.price_per_night}</td>
                <td>
                  <select
                    value={room.status}
                    onChange={(e) =>
                      handleQuickStatusUpdate(room.id, e.target.value)
                    }
                    className={`status-select ${room.status}`}
                    disabled={loading}
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="admin-edit-btn"
                    onClick={() => {
                      setSelectedRoom(room);
                      setShowEditModal(true);
                    }}
                    disabled={loading}
                  >
                    Düzenle
                  </button>
                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDelete(room.id)}
                    disabled={loading}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Oda Ekleme Modal */}
        {showAddModal && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <h3>Yeni Oda Ekle</h3>
              {error && <div className="error-message">{error}</div>}
              <div className="admin-form-group">
                <div className="form-field">
                  <label>Oda Numarası</label>
                  <input
                    type="text"
                    value={newRoom.room_number}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, room_number: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Oda Türü</label>
                  <select
                    value={newRoom.room_type}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, room_type: e.target.value })
                    }
                  >
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Kapasite</label>
                  <input
                    type="number"
                    value={newRoom.capacity}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, capacity: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Gecelik Fiyat</label>
                  <input
                    type="number"
                    value={newRoom.price_per_night}
                    onChange={(e) =>
                      setNewRoom({
                        ...newRoom,
                        price_per_night: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Yatak Türü</label>
                  <select
                    value={newRoom.bed_type}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, bed_type: e.target.value })
                    }
                  >
                    {bedTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Manzara</label>
                  <select
                    value={newRoom.view}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, view: e.target.value })
                    }
                  >
                    {viewTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Görsel URL</label>
                  <input
                    type="text"
                    value={newRoom.image_url}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, image_url: e.target.value })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Açıklama</label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, description: e.target.value })
                    }
                  />
                </div>

                <div className="form-field checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newRoom.has_ac}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, has_ac: e.target.checked })
                      }
                    />
                    Klima
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={newRoom.has_wifi}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, has_wifi: e.target.checked })
                      }
                    />
                    WiFi
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={newRoom.has_minibar}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          has_minibar: e.target.checked,
                        })
                      }
                    />
                    Minibar
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={newRoom.has_balcony}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          has_balcony: e.target.checked,
                        })
                      }
                    />
                    Balkon
                  </label>
                </div>
              </div>
              <div className="admin-modal-buttons">
                <button onClick={handleAddRoom}>Ekle</button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                  }}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Oda Düzenleme Modal */}
        {showEditModal && selectedRoom && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <h3>Oda Düzenle</h3>
              {error && <div className="error-message">{error}</div>}
              <div className="admin-form-group">
                <div className="form-field">
                  <label>Oda Numarası</label>
                  <input
                    type="text"
                    value={selectedRoom.room_number}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        room_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Oda Türü</label>
                  <select
                    value={selectedRoom.room_type}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        room_type: e.target.value,
                      })
                    }
                  >
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Kapasite</label>
                  <input
                    type="number"
                    value={selectedRoom.capacity}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        capacity: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Gecelik Fiyat</label>
                  <input
                    type="number"
                    value={selectedRoom.price_per_night}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        price_per_night: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Yatak Türü</label>
                  <select
                    value={selectedRoom.bed_type}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        bed_type: e.target.value,
                      })
                    }
                  >
                    {bedTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Manzara</label>
                  <select
                    value={selectedRoom.view}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        view: e.target.value,
                      })
                    }
                  >
                    {viewTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Görsel URL</label>
                  <input
                    type="text"
                    value={selectedRoom.image_url}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        image_url: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Açıklama</label>
                  <textarea
                    value={selectedRoom.description}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRoom.has_ac}
                      onChange={(e) =>
                        setSelectedRoom({
                          ...selectedRoom,
                          has_ac: e.target.checked,
                        })
                      }
                    />
                    Klima
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRoom.has_wifi}
                      onChange={(e) =>
                        setSelectedRoom({
                          ...selectedRoom,
                          has_wifi: e.target.checked,
                        })
                      }
                    />
                    WiFi
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRoom.has_minibar}
                      onChange={(e) =>
                        setSelectedRoom({
                          ...selectedRoom,
                          has_minibar: e.target.checked,
                        })
                      }
                    />
                    Minibar
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRoom.has_balcony}
                      onChange={(e) =>
                        setSelectedRoom({
                          ...selectedRoom,
                          has_balcony: e.target.checked,
                        })
                      }
                    />
                    Balkon
                  </label>
                </div>
              </div>
              <div className="admin-modal-buttons">
                <button onClick={handleEditRoom}>Güncelle</button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setError(null);
                  }}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRoomsPage;
