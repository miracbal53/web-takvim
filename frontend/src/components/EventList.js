import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import './EventList.css';

const EventList = ({ calendarId, isAdmin, onEditEvent }) => {
  const [events, setEvents] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sortOption, setSortOption] = useState('dateAdded');
  const [searchTerm, setSearchTerm] = useState('');

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
        setMessage('Olay başarıyla silindi.');
        setTimeout(() => {
          setMessage('');
        }, 2000);
      } catch (err) {
        console.error('Olay silinirken hata oluştu:', err);
        setMessage('Olay silinirken hata oluştu.');
      }
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortedEvents = events
    .filter(event => event.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'dateAdded') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === 'endDate') {
        const endDateA = new Date(a.endDate || a.startDate);
        const endDateB = new Date(b.endDate || b.startDate);
        return endDateA - endDateB;
      }
      return 0;
    });

  return (
    <div className="event-list">
      <h2>Olay Listesi</h2>
      {message && <p>{message}</p>}
      <div className="controls">
        <label>
          Sırala:
          <select value={sortOption} onChange={handleSortChange}>
            <option value="dateAdded">Ekleme Tarihine Göre</option>
            <option value="endDate">Bitiş Tarihi Yaklaşan</option>
          </select>
        </label>
        <label>
          Ara:
          <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Olay adına göre ara" />
        </label>
      </div>
      <ul>
        <li className="event-list-header">
          <span>Akademik Olay</span>
          <span>Yarıyıl</span>
          <span>Başlangıç</span>
          <span>Bitiş</span>
          {isAdmin && <span>İşlemler</span>}
        </li>
        {sortedEvents.map(event => (
          <li key={event._id}>
            <span>{event.name}</span>
            <span>{event.semester}</span>
            <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}</span>
            <span>{event.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'}</span>
            {isAdmin && (
              <div className="button-group">
                <button onClick={() => onEditEvent(event)}>Düzenle</button>
                <button onClick={() => handleDeleteEvent(event._id)}>Sil</button>
              </div>
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