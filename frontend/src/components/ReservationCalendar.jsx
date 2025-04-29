import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const ReservationCalendar = () => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:5000/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const booked = res.data.map((r) => new Date(r.check_in));
      setDates(booked);
    };
    fetchDates();
  }, []);

  const tileClassName = ({ date }) => {
    return dates.some((d) => d.toDateString() === date.toDateString())
      ? "booked-day"
      : null;
  };

  return (
    <div>
      <h5 className="mb-3">Rezervasyon Takvimi</h5>
      <Calendar tileClassName={tileClassName} />
    </div>
  );
};

export default ReservationCalendar;
