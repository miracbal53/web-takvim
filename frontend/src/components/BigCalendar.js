import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./BigCalendar.css"; // Import the new CSS file

const localizer = momentLocalizer(moment);

const BigCalendar = ({ calendarId, defaultDate }) => {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/events?calendarId=${calendarId}`
        );
        const formattedEvents = res.data.flatMap((event) => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate || event.startDate);
          if (startDate.getTime() === endDate.getTime()) {
            return [
              {
                id: `${event._id}-single`,
                title: `${event.semester} - ${event.name}`,
                start: startDate,
                end: startDate,
              },
            ];
          } else {
            return [
              {
                id: `${event._id}-start`,
                title: `${event.semester} - ${event.name} - Başlangıç`,
                start: startDate,
                end: startDate,
              },
              {
                id: `${event._id}-end`,
                title: `${event.semester} - ${event.name} - Bitiş`,
                start: endDate,
                end: endDate,
              },
            ];
          }
        });
        setEvents(formattedEvents);
      } catch (err) {
        console.error("Etkinlikler getirilirken hata oluştu:", err);
      }
    };

    const checkAdmin = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAdmin(true);
      }
    };

    if (calendarId) {
      fetchEvents();
      checkAdmin();
    }
  }, [calendarId]);

  const handleSelectEvent = async (event) => {
    if (isAdmin) {
      const confirmDelete = window.confirm(
        "Bu olayı silmek istediğinize emin misiniz?"
      );
      if (confirmDelete) {
        try {
          const token = localStorage.getItem("token");
          const config = {
            headers: {
              "x-auth-token": token,
            },
          };
          await axios.delete(
            `http://localhost:5000/api/events/${event.id.split("-")[0]}`,
            config
          );
          setEvents(
            events.filter((e) => e.id.split("-")[0] !== event.id.split("-")[0])
          );
          setMessage("Olay başarıyla silindi.");
          setTimeout(() => {
            setMessage("");
            window.location.reload();
          }, 2000);
        } catch (err) {
          console.error("Olay silinirken hata oluştu:", err);
        }
      }
    }
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable={isAdmin}
        onSelectEvent={handleSelectEvent}
        defaultDate={defaultDate}
        className="custom-calendar" // Add a custom class name
      />
    </div>
  );
};

export default BigCalendar;
