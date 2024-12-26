import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const BigCalendar = ({ calendarId }) => {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events?calendarId=${calendarId}`);
        const formattedEvents = res.data.map(event => ({
          id: event._id,
          title: `${event.semester} İçin ${event.name}`,
          start: new Date(event.startDate),
          end: new Date(event.endDate || event.startDate)
        }));
        setEvents(formattedEvents);
      } catch (err) {
        console.error('Etkinlikler getirilirken hata oluştu:', err);
      }
    };

    const checkAdmin = () => {
      const token = localStorage.getItem('token');
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
      const confirmDelete = window.confirm('Bu olayı silmek istediğinize emin misiniz?');
      if (confirmDelete) {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          await axios.delete(`http://localhost:5000/api/events/${event.id}`, config);
          setEvents(events.filter(e => e.id !== event.id));
        } catch (err) {
          console.error('Olay silinirken hata oluştu:', err);
        }
      }
    }
  };

  return (
    <div>
      <h2>Takvim</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable={isAdmin}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default BigCalendar;