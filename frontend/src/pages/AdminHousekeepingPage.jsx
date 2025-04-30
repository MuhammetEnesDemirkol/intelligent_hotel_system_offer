import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminHousekeepingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [personel, setPersonel] = useState({}); // odaId → personel adı

  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://localhost:5000/api/housekeeping", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRooms(res.data);    
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
    await axios.put(`http://localhost:5000/api/housekeeping/${room_id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const handleAssignPerson = (room_id, name) => {
    setPersonel((prev) => ({ ...prev, [room_id]: name }));
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Temizlik Kontrol Paneli</h2>
      <div className="row g-4">
        {rooms.map((room) => (
          <div className="col-md-4" key={room.room_id}>
            <div className="card shadow-sm h-100">
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
                <div className="input-group input-group-sm mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Personel adı"
                    value={personel[room.room_id] || ""}
                    onChange={(e) => handleAssignPerson(room.room_id, e.target.value)}
                  />
                  <button
                    className="btn btn-outline-primary"
                    onClick={() =>
                      alert(`"${personel[room.room_id]}" bu odaya atandı.`)
                    }
                  >
                    Ata
                  </button>
                </div>

                {/* Temizlik Kontrolleri */}
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
    </div>
  );
};

export default AdminHousekeepingPage;
