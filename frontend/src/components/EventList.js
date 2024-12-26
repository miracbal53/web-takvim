import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventList.css';

const EventList = ({ calendarId, isAdmin }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(`http://localhost:5000/api/events?calendarId=${calendarId}`);
      setEvents(res.data);
    };

    fetchEvents();
  }, [calendarId]);

  const handleEdit = (event) => {
    // Düzenleme işlemi için gerekli kodları buraya ekleyin
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
              <button onClick={() => handleEdit(event)}>Düzenle</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;