import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminHousekeepingPage = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/housekeeping",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecords(response.data);
    } catch (error) {
      console.error("Temizlik verileri alınamadı:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(
        `http://localhost:5000/api/housekeeping/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData(); // yenile
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Temizlik Takibi</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Oda No</th>
            <th>Durum</th>
            <th>Son Temizlik</th>
            <th>Güncelle</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.id}>
              <td>{item.room_number}</td>
              <td>
                <span
                  className={`badge ${
                    item.status === "clean"
                      ? "bg-success"
                      : item.status === "cleaning"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td>{item.last_cleaned || "-"}</td>
              <td>
                <select
                  className="form-select"
                  value={item.status}
                  onChange={(e) => updateStatus(item.id, e.target.value)}
                >
                  <option value="clean">Temiz</option>
                  <option value="cleaning">Temizleniyor</option>
                  <option value="maintenance">Bakımda</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHousekeepingPage;
