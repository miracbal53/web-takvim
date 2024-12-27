import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarForm from './CalendarForm';
import './CalendarList.css';

const CalendarList = ({ onSelectCalendar, isAdmin }) => {
  const [calendars, setCalendars] = useState([]);
  const [editingCalendar, setEditingCalendar] = useState(null);

  useEffect(() => {
    const fetchCalendars = async () => {
      const res = await axios.get('http://localhost:5000/api/calendars');
      setCalendars(res.data);
    };

    fetchCalendars();
  }, []);

  const handleEditCalendar = (calendar) => {
    setEditingCalendar(calendar);
  };

  const handleUpdateCalendar = async (updatedCalendar) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const res = await axios.put(`http://localhost:5000/api/calendars/${updatedCalendar._id}`, updatedCalendar, config);
      setCalendars(calendars.map(calendar => (calendar._id === updatedCalendar._id ? res.data : calendar)));
      setEditingCalendar(null);
    } catch (err) {
      console.error('Takvim güncellenirken hata oluştu:', err);
    }
  };

  return (
    <div className="calendar-list">
      <h2>Takvim Listesi</h2>
      <ul>
        {calendars.map(calendar => (
          <li key={calendar._id}>
            <span onClick={() => onSelectCalendar(calendar)}>{calendar.name} ({calendar.year.start} - {calendar.year.end})</span>
            {isAdmin && (
              <>
                <button onClick={() => handleEditCalendar(calendar)}>Düzenle</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {editingCalendar && (
        <CalendarForm
          calendar={editingCalendar}
          onSubmit={handleUpdateCalendar}
          onClose={() => setEditingCalendar(null)}
        />
      )}
    </div>
  );
};

export default CalendarList;