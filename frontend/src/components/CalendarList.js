import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CalendarList.css";

const CalendarList = ({ onSelectCalendar }) => {
  const [calendars, setCalendars] = useState([]);

  // Takvimleri getir
  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/calendars");
        setCalendars(res.data);
      } catch (err) {
        console.error("Takvimler getirilirken hata oluştu:", err);
      }
    };

    fetchCalendars();
  }, []);

  return (
    <div>
      <h2>Takvimler</h2>
      <ul>
        {calendars.map((calendar) => (
          <li key={calendar._id}>
            <span onClick={() => onSelectCalendar(calendar)}>
              {calendar.name} - {calendar.year.start} - {calendar.year.end}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarList;
