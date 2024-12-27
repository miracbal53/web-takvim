import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import './EventList.css';

const EventList = ({ calendarId, isAdmin, onEditEvent }) => {
  const [events, setEvents] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(`http://localhost:5000/api/events?calendarId=${calendarId}`);
      setEvents(res.data);
    };

    fetchEvents();
  }, [calendarId]);

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
    setShowAddEventForm(false);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Bu olayı silmek istediğinize emin misiniz?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, config);
        setEvents(events.filter(event => event._id !== eventId));
      } catch (err) {
        console.error('Olay silinirken hata oluştu:', err);
      }
    }
  };

  return (
    <div className="event-list">
      <h2>Olay Listesi</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <span>{event.name}</span>
            <span>{event.semester}</span>
            <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}</span>
            <span>{event.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'}</span>
            {isAdmin && (
              <>
                <button onClick={() => onEditEvent(event)}>Düzenle</button>
                <button onClick={() => handleDeleteEvent(event._id)}>Sil</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {isAdmin && (
        <>
          <button onClick={() => setShowAddEventForm(!showAddEventForm)}>
            {showAddEventForm ? 'Formu Kapat' : 'Olay Ekle'}
          </button>
          {showAddEventForm && (
            <EventForm calendarId={calendarId} onSubmit={handleAddEvent} onClose={() => setShowAddEventForm(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default EventList;