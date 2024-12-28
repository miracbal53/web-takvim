import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import { createEvents } from 'ics';
import './EventList.css';

const EventList = ({ calendarId, isAdmin, onEditEvent }) => {
  const [events, setEvents] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sortOption, setSortOption] = useState('dateAdded');
  const [searchTerm, setSearchTerm] = useState('');
  const [calendarName, setCalendarName] = useState('');
  const [calendarYears, setCalendarYears] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(`http://localhost:5000/api/events?calendarId=${calendarId}`);
      setEvents(res.data);
    };

    const fetchCalendarName = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/calendars/${calendarId}`);
        setCalendarName(res.data.name);
        setCalendarYears(res.data.year);
      } catch (error) {
        console.error('Takvim adı alınırken hata oluştu:', error);
        if (error.response && error.response.status === 404) {
          setCalendarName('Takvim Bulunamadı');
        } else {
          setCalendarName('Takvim');
        }
      }
    };

    fetchEvents();
    fetchCalendarName();
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
      const now = new Date();
      if (sortOption === 'dateAdded') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === 'endDate') {
        const endDateA = new Date(a.endDate || a.startDate);
        const endDateB = new Date(b.endDate || b.startDate);
        if (endDateA < now && endDateB < now) {
          return endDateB - endDateA; // Both events are in the past, sort by most recent past event
        } else if (endDateA < now) {
          return 1; // Event A is in the past, move it down
        } else if (endDateB < now) {
          return -1; // Event B is in the past, move it down
        } else {
          return endDateA - endDateB; // Both events are in the future, sort by nearest future event
        }
      } else if (sortOption === 'pastEvents') {
        const endDateA = new Date(a.endDate || a.startDate);
        const endDateB = new Date(b.endDate || b.startDate);
        return endDateB - endDateA; // Sort past events by most recent past event
      }
      return 0;
    })
    .filter(event => {
      if (sortOption === 'pastEvents') {
        const now = new Date();
        const endDate = new Date(event.endDate || event.startDate);
        return endDate < now; // Only show past events
      }
      return true;
    });

  const downloadICS = () => {
    const icsEvents = events.map(event => ({
      title: event.name,
      start: [new Date(event.startDate).getFullYear(), new Date(event.startDate).getMonth() + 1, new Date(event.startDate).getDate()],
      end: [new Date(event.endDate || event.startDate).getFullYear(), new Date(event.endDate || event.startDate).getMonth() + 1, new Date(event.endDate || event.startDate).getDate()],
      description: event.semester,
    }));
    createEvents(icsEvents, (error, value) => {
      if (error) {
        console.error(error);
        return;
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${calendarName} (${calendarYears.start}-${calendarYears.end}).ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const downloadVCS = () => {
    const vcsEvents = events.map(event => ({
      title: event.name,
      start: [new Date(event.startDate).getFullYear(), new Date(event.startDate).getMonth() + 1, new Date(event.startDate).getDate()],
      end: [new Date(event.endDate || event.startDate).getFullYear(), new Date(event.endDate || event.startDate).getMonth() + 1, new Date(event.endDate || event.startDate).getDate()],
      description: `${calendarName} - ${event.semester}`,
    }));
    createEvents(vcsEvents, (error, value) => {
      if (error) {
        console.error(error);
        return;
      }
      const blob = new Blob([value], { type: 'text/x-vcalendar;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${calendarName} (${calendarYears.start}-${calendarYears.end}).vcs`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

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
            <option value="pastEvents">Son Tarihi Geçmiş</option>
          </select>
        </label>
        <label>
          Ara:
          <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Olay adına göre ara" />
        </label>
        <button onClick={downloadICS}>ICS İndir</button>
        <button onClick={downloadVCS}>VCS İndir</button>
      </div>
      <ul>
        <li className="event-list-header">
          <span>Akademik Olay</span>
          <span>Yarıyıl</span>
          <span>Başlangıç</span>
          <span>Bitiş</span>
          {isAdmin && <span>İşlemler</span>}
        </li>
        {sortedEvents.map(event => {
          const now = new Date();
          const endDate = new Date(event.endDate || event.startDate);
          const isPastEvent = endDate < now;
          return (
            <li key={event._id} className={isPastEvent ? 'past-event' : ''}>
              <span>{event.name}</span>
              <span>{event.semester}</span>
              <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}</span>
              <span>
                {event.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'}
                {isPastEvent && <span className="past-event-label">(Son Tarihi Geçti)</span>}
              </span>
              {isAdmin && (
                <div className="button-group">
                  <button onClick={() => onEditEvent(event)}>Düzenle</button>
                  <button onClick={() => handleDeleteEvent(event._id)}>Sil</button>
                </div>
              )}
            </li>
          );
        })}
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