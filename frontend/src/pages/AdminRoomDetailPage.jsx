import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/admin.css";

const AdminRoomDetailPage = () => {
  const { id } = useParams();
  const [bookedDates, setBookedDates] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [newRes, setNewRes] = useState({
    full_name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
  });

  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");

    // Takvim verileri
    const resDates = await axios.get(
      `http://localhost:5000/api/rooms/${id}/reservations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const dateList = [];
    resDates.data.forEach((r) => {
      const start = new Date(r.check_in);
      const end = new Date(r.check_out);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        dateList.push(new Date(d));
      }
    });
    setBookedDates(dateList);

    // Rezervasyon detayları
    const resList = await axios.get(
      `http://localhost:5000/api/rooms/${id}/reservations/details`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setReservations(resList.data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const found = bookedDates.find(
        (d) => d.toDateString() === date.toDateString()
      );
      return found ? "react-calendar__tile--booked" : null;
    }
  };

  const handleCancel = async (reservationId) => {
    const confirmed = window.confirm(
      "Bu rezervasyonu iptal etmek istediğinize emin misiniz?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");
    await axios.delete(
      `http://localhost:5000/api/reservations/${reservationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await fetchData();
  };

  const handleCreateReservation = async () => {
    const token = localStorage.getItem("adminToken");
    const { full_name, email, phone, check_in, check_out } = newRes;

    const dayCount =
      (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24);

    if (dayCount <= 0) {
      return alert("Geçerli bir tarih aralığı seçin.");
    }

    try {
      // 1. Tarih çakışma kontrolü
      const resvCheck = await axios.get(
        `http://localhost:5000/api/rooms/${id}/reservations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const isOverlap = resvCheck.data.some((r) => {
        const rStart = new Date(r.check_in);
        const rEnd = new Date(r.check_out);
        const nStart = new Date(check_in);
        const nEnd = new Date(check_out);
        return nStart <= rEnd && nEnd >= rStart;
      });

      if (isOverlap) {
        return alert("Seçilen tarihlerde bu odada zaten rezervasyon var.");
      }

      // 2. Aynı müşteri var mı kontrol et (email ile)
      let customer_id;
      const customerSearch = await axios.get(
        "http://localhost:5000/api/customers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const existing = customerSearch.data.find((c) => c.email === email);

      if (existing) {
        customer_id = existing.id;
      } else {
        const newCustomer = await axios.post(
          "http://localhost:5000/api/customers",
          { full_name, email, phone },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        customer_id = newCustomer.data.id;
      }

      // 3. Oda fiyatı
      const room = await axios.get(`http://localhost:5000/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const total_price = dayCount * room.data.price_per_night;

      // 4. Rezervasyon oluştur
      await axios.post(
        "http://localhost:5000/api/reservations",
        {
          customer_id,
          room_id: id,
          check_in,
          check_out,
          total_price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Rezervasyon başarıyla eklendi.");
      setNewRes({
        full_name: "",
        email: "",
        phone: "",
        check_in: "",
        check_out: "",
      });
      fetchData();
    } catch (err) {
      console.error("Rezervasyon eklenemedi:", err);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Oda ID: {id} | Rezervasyon Takvimi</h3>

      <div className="mt-4 mb-5">
        <Calendar tileClassName={tileClassName} />
      </div>

      <h4>İleriye Yönelik Rezervasyonlar</h4>
      {reservations.length === 0 ? (
        <p className="text-muted">Henüz rezervasyon yapılmamış.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Müşteri</th>
              <th>Giriş</th>
              <th>Çıkış</th>
              <th>Gün</th>
              <th>Tutar</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => {
              const days =
                (new Date(r.check_out) - new Date(r.check_in)) /
                (1000 * 60 * 60 * 24);
              return (
                <tr key={r.id}>
                  <td>
                    {r.full_name}
                    <br />
                    <small>{r.email}</small>
                  </td>
                  <td>{r.check_in.split("T")[0]}</td>
                  <td>{r.check_out.split("T")[0]}</td>
                  <td>{days}</td>
                  <td>{r.total_price} ₺</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancel(r.id)}
                    >
                      İptal Et
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <h4 className="mt-5">Yeni Rezervasyon Ekle</h4>
      <div className="card p-3 mt-3">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Ad Soyad"
              value={newRes.full_name}
              onChange={(e) =>
                setNewRes({ ...newRes, full_name: e.target.value })
              }
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="email"
              className="form-control"
              placeholder="E-posta"
              value={newRes.email}
              onChange={(e) => setNewRes({ ...newRes, email: e.target.value })}
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Telefon"
              value={newRes.phone}
              onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
            />
          </div>
          <div className="col-md-6 mb-2">
            <label>Giriş</label>
            <input
              type="date"
              className="form-control"
              value={newRes.check_in}
              onChange={(e) =>
                setNewRes({ ...newRes, check_in: e.target.value })
              }
            />
          </div>
          <div className="col-md-6 mb-2">
            <label>Çıkış</label>
            <input
              type="date"
              className="form-control"
              value={newRes.check_out}
              onChange={(e) =>
                setNewRes({ ...newRes, check_out: e.target.value })
              }
            />
          </div>
        </div>

        <button
          className="btn btn-success mt-3"
          onClick={handleCreateReservation}
        >
          Kaydet
        </button>
      </div>
    </div>
  );
};

export default AdminRoomDetailPage;
