import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardChart from "../components/DashboardChart";
import ReservationCalendar from "../components/ReservationCalendar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    rooms: 0,
    customers: 0,
    reservations: 0,
    totalPayments: 0,
  });

  const [chartData, setChartData] = useState({ labels: [], values: [] });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);

      const chartRes = await axios.get(
        "http://localhost:5000/api/reservations/weekly",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChartData(chartRes.data || { labels: [], values: [] });
    } catch (err) {
      console.error("İstatistik alınamadı", err);
    }
  };

  return (
    <div className="container mt-4">
      {/* Başlık */}
      <div className="dashboard-header text-center mb-5">
        <h2>Admin Paneline Hoş Geldiniz</h2>
      </div>

      {/* Kartlar */}
      <div className="dashboard-cards d-flex gap-3 flex-wrap justify-content-center mb-5">
        <div className="dashboard-card">
          <h5>Toplam Odalar</h5>
          <p className="fs-3 text-primary">{stats.rooms}</p>
        </div>
        <div className="dashboard-card">
          <h5>Müşteriler</h5>
          <p className="fs-3 text-success">{stats.customers}</p>
        </div>
        <div className="dashboard-card">
          <h5>Rezervasyonlar</h5>
          <p className="fs-3 text-warning">{stats.reservations}</p>
        </div>
        <div className="dashboard-card">
          <h5>Toplam Ödeme</h5>
          <p className="fs-3 text-danger">{stats.totalPayments.toFixed(2)} ₺</p>
        </div>
      </div>

      {/* Grafik + Takvim */}
      <div className="dashboard-section row g-4">
        <div className="col-md-6">
          <div className="dashboard-chart">
            <h5 className="text-center mb-3">Haftalık Rezervasyonlar</h5>
            {chartData.labels?.length > 0 ? (
              <DashboardChart data={chartData} />
            ) : (
              <p className="text-center text-muted">
                Grafik verisi bulunamadı.
              </p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="dashboard-calendar">
            <h5 className="text-center mb-3">Rezervasyon Takvimi</h5>
            <ReservationCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
