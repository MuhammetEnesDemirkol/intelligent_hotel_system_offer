import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminRoomPricingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [bulkChangeType, setBulkChangeType] = useState("percentage");
  const [bulkChangeValue, setBulkChangeValue] = useState("");
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Odalar alınamadı:", error);
    }
  };

  const fetchPriceHistory = async (roomId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `http://localhost:5000/api/rooms/${roomId}/price-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPriceHistory(response.data);
      setSelectedRoomId(roomId);
      setShowPriceHistory(true);
    } catch (error) {
      console.error("Fiyat geçmişi alınamadı:", error);
    }
  };

  const handlePriceChange = (e) => {
    setPriceInput(e.target.value);
  };

  const handleEdit = (room) => {
    setEditingRoomId(room.id);
    setPriceInput(room.price_per_night);
  };

  const handleSave = async (room) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:5000/api/rooms/${room.id}`,
        {
          ...room,
          price_per_night: priceInput,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingRoomId(null);
      fetchRooms();
    } catch (error) {
      console.error("Fiyat güncellenemedi:", error);
    }
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRooms(
      selectedRooms.length === rooms.length ? [] : rooms.map((room) => room.id)
    );
  };

  const handleBulkUpdate = async () => {
    if (selectedRooms.length === 0 || !bulkChangeValue) return;

    try {
      const token = localStorage.getItem("adminToken");
      const numericValue = parseFloat(bulkChangeValue);

      if (isNaN(numericValue)) {
        console.error("Geçersiz değişim değeri");
        return;
      }

      await axios.put(
        "http://localhost:5000/api/rooms/bulk-update-prices",
        {
          room_ids: selectedRooms,
          change_type: bulkChangeType,
          change_value: numericValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBulkChangeValue("");
      fetchRooms();
    } catch (error) {
      console.error("Toplu fiyat güncelleme başarısız:", error);
      if (error.response) {
        console.error("Sunucu hatası:", error.response.data);
      }
    }
  };

  return (
    <div className="admin-pricing-page">
      <div className="admin-pricing-container">
        <h2 className="admin-pricing-title">Oda Fiyat Yönetimi</h2>

        {/* Toplu Fiyat Güncelleme */}
        <div className="bulk-update-section">
          <h3>Toplu Fiyat Güncelleme</h3>
          <div className="bulk-update-controls">
            <select
              value={bulkChangeType}
              onChange={(e) => setBulkChangeType(e.target.value)}
              className="admin-select"
            >
              <option value="percentage">Yüzde (%)</option>
              <option value="fixed">Sabit Değer (₺)</option>
            </select>
            <select
              value={bulkChangeValue.startsWith("-") ? "decrease" : "increase"}
              onChange={(e) => {
                const currentValue = Math.abs(parseFloat(bulkChangeValue) || 0);
                setBulkChangeValue(
                  e.target.value === "decrease"
                    ? `-${currentValue}`
                    : currentValue.toString()
                );
              }}
              className="admin-select"
            >
              <option value="increase">Zam</option>
              <option value="decrease">İndirim</option>
            </select>
            <input
              type="number"
              value={Math.abs(parseFloat(bulkChangeValue) || 0)}
              onChange={(e) => {
                const value = e.target.value;
                const isNegative = bulkChangeValue.startsWith("-");
                setBulkChangeValue(isNegative ? `-${value}` : value);
              }}
              placeholder={
                bulkChangeType === "percentage" ? "Yüzde" : "Sabit Değer"
              }
              className="admin-input"
              min="0"
              step={bulkChangeType === "percentage" ? "0.1" : "1"}
            />
            <button
              className="admin-button"
              onClick={handleBulkUpdate}
              disabled={selectedRooms.length === 0 || !bulkChangeValue}
            >
              Seçili Odalara Uygula
            </button>
          </div>
        </div>

        <table className="admin-pricing-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRooms.length === rooms.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Oda No</th>
              <th>Tür</th>
              <th>Mevcut Fiyat (₺)</th>
              <th>Yeni Fiyat</th>
              <th>İşlem</th>
              <th>Geçmiş</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room.id)}
                    onChange={() => handleRoomSelect(room.id)}
                  />
                </td>
                <td>{room.room_number}</td>
                <td>{room.room_type}</td>
                <td>{room.price_per_night}</td>
                <td>
                  {editingRoomId === room.id ? (
                    <input
                      type="number"
                      className="admin-price-input"
                      value={priceInput}
                      onChange={handlePriceChange}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {editingRoomId === room.id ? (
                    <button
                      className="admin-save-button"
                      onClick={() => handleSave(room)}
                    >
                      Kaydet
                    </button>
                  ) : (
                    <button
                      className="admin-edit-button"
                      onClick={() => handleEdit(room)}
                    >
                      Düzenle
                    </button>
                  )}
                </td>
                <td>
                  <button
                    className="admin-history-button"
                    onClick={() => fetchPriceHistory(room.id)}
                  >
                    Detay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fiyat Geçmişi Modal */}
      {showPriceHistory && (
        <div className="modal-overlay">
          <div className="modal-content price-history-modal">
            <div className="modal-header">
              <h3>Fiyat Geçmişi Detayları</h3>
              <button
                className="close-button"
                onClick={() => setShowPriceHistory(false)}
              >
                ×
              </button>
            </div>

            <div className="price-history-summary">
              <div className="summary-item">
                <span className="summary-label">Oda No:</span>
                <span className="summary-value">
                  {rooms.find((r) => r.id === selectedRoomId)?.room_number}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Oda Türü:</span>
                <span className="summary-value">
                  {rooms.find((r) => r.id === selectedRoomId)?.room_type}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Güncel Fiyat:</span>
                <span className="summary-value">
                  {rooms.find((r) => r.id === selectedRoomId)?.price_per_night}{" "}
                  ₺
                </span>
              </div>
            </div>

            <div className="price-history-table-container">
              <table className="price-history-table">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Eski Fiyat</th>
                    <th>Yeni Fiyat</th>
                    <th>Değişim Tipi</th>
                    <th>Değişim Değeri</th>
                    <th>İşlemi Yapan</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((record) => (
                    <tr key={record.id}>
                      <td>{record.changed_at}</td>
                      <td>{record.old_price} ₺</td>
                      <td>
                        <span className="new-price">{record.new_price} ₺</span>
                      </td>
                      <td>{record.change_type}</td>
                      <td>
                        <span
                          className={`change-value ${
                            record.change_value >= 0 ? "positive" : "negative"
                          }`}
                        >
                          {record.change_value >= 0 ? "+" : ""}
                          {record.change_value}
                          {record.change_type === "Yüzde (%)" ? "%" : " ₺"}
                        </span>
                      </td>
                      <td>{record.changed_by_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="price-history-footer">
              <button
                className="close-modal-button"
                onClick={() => setShowPriceHistory(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoomPricingPage;
