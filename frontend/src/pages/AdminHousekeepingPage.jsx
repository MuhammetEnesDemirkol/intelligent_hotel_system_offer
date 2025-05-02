import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminHousekeepingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [cleaningStaff, setCleaningStaff] = useState([]);
  const [assignedStaff, setAssignedStaff] = useState({}); // odaId → personel adı
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Oturum açmanız gerekiyor");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [roomsRes, staffRes] = await Promise.all([
        axios.get("http://localhost:5000/api/housekeeping", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/personnel/cleaning", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRooms(roomsRes.data);
      setCleaningStaff(staffRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (room_id, status) => {
    const token = localStorage.getItem("adminToken");
    const payload = {
      status,
      last_cleaned: status === "clean" ? new Date().toISOString() : null,
    };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/housekeeping/${room_id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error("Status update failed:", error);
      alert(
        error.response?.data?.error || "Durum güncellenirken bir hata oluştu."
      );
    }
  };

  const handleAssignStaff = (room_id, staffId) => {
    const selectedStaff = cleaningStaff.find((staff) => staff.id === staffId);
    if (selectedStaff) {
      setAssignedStaff((prev) => ({ ...prev, [room_id]: selectedStaff.name }));
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case "clean":
        return <span className="badge bg-success">Temiz</span>;
      case "cleaning":
        return <span className="badge bg-warning text-dark">Temizleniyor</span>;
      case "dirty":
        return <span className="badge bg-danger">Kirli</span>;
      case "maintenance":
        return <span className="badge bg-secondary">Bakımda</span>;
      default:
        return <span className="badge bg-light">Bilinmiyor</span>;
    }
  };

  const getCardBackgroundColor = (status) => {
    switch (status) {
      case "dirty":
        return "bg-light-red";
      case "cleaning":
        return "bg-light-yellow";
      default:
        return "";
    }
  };

  const filteredRooms = rooms.filter(
    (room) => statusFilter === "all" || room.status === statusFilter
  );

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Temizlik Kontrol Paneli</h2>

      {/* Filtreleme Dropdown'ı */}
      <div className="mb-4">
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tüm Odalar</option>
          <option value="clean">Temiz</option>
          <option value="cleaning">Temizleniyor</option>
          <option value="dirty">Kirli</option>
          <option value="maintenance">Bakımda</option>
        </select>
      </div>

      {rooms.length === 0 ? (
        <div className="alert alert-info" role="alert">
          Henüz hiç oda bulunmuyor.
        </div>
      ) : (
        <div className="row g-4">
          {filteredRooms.map((room) => (
            <div className="col-md-4" key={room.room_id}>
              <div
                className={`card shadow-sm h-100 ${getCardBackgroundColor(
                  room.status
                )}`}
              >
                <div className="card-body">
                  <h5 className="card-title">Oda No: {room.room_number}</h5>
                  <p>
                    Durum: {getBadge(room.status)}
                    <br />
                    <small>
                      Son temizlik:{" "}
                      {room.last_cleaned
                        ? new Date(room.last_cleaned).toLocaleDateString()
                        : "Yok"}
                    </small>
                  </p>

                  {/* Personel Atama */}
                  <div className="mb-3">
                    <select
                      className="form-select"
                      value={
                        assignedStaff[room.room_id]
                          ? cleaningStaff.find(
                              (staff) =>
                                staff.name === assignedStaff[room.room_id]
                            )?.id
                          : ""
                      }
                      onChange={(e) =>
                        handleAssignStaff(
                          room.room_id,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="">Personel seçin</option>
                      {cleaningStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                    {assignedStaff[room.room_id] && (
                      <small className="text-muted d-block mt-1">
                        Atanan personel: {assignedStaff[room.room_id]}
                      </small>
                    )}
                  </div>

                  {/* Temizlik Kontrolleri */}
                  <button
                    className="btn btn-outline-danger w-100 mb-2"
                    disabled={room.status === "dirty"}
                    onClick={() => handleStatusUpdate(room.room_id, "dirty")}
                  >
                    Kirli Olarak İşaretle
                  </button>
                  <button
                    className="btn btn-outline-warning w-100 mb-2"
                    disabled={room.status === "cleaning"}
                    onClick={() => handleStatusUpdate(room.room_id, "cleaning")}
                  >
                    Temizliği Başlat
                  </button>
                  <button
                    className="btn btn-outline-success w-100"
                    disabled={room.status === "clean"}
                    onClick={() => handleStatusUpdate(room.room_id, "clean")}
                  >
                    Temiz Olarak İşaretle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHousekeepingPage;
