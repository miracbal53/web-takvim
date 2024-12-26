import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventForm.css';

const EventForm = ({ calendarId, event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    semester: '',
    startDate: '',
    endDate: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        semester: event.semester,
        startDate: event.startDate ? event.startDate.split('T')[0] : '',
        endDate: event.endDate ? event.endDate.split('T')[0] : ''
      });
    }
  }, [event]);

  const { name, semester, startDate, endDate } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const eventData = {
        ...formData,
        calendarId,
        endDate: endDate || startDate
      };

      if (event) {
        await axios.put(`http://localhost:5000/api/events/${event._id}`, eventData, config);
        setMessage('Olay başarıyla güncellendi.');
      } else {
        await axios.post(`http://localhost:5000/api/events`, eventData, config);
        setMessage('Olay başarıyla eklendi.');
      }

      onSubmit(eventData);
      onClose();
    } catch (err) {
      console.error('Olay eklenirken/güncellenirken hata oluştu:', err);
      setMessage('Olay eklenirken/güncellenirken hata oluştu.');
    }
  };

  return (
    <div className="event-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Olay Adı</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <label>Yarıyıl</label>
          <select name="semester" value={semester} onChange={onChange} required>
            <option value="">Seçiniz</option>
            <option value="Güz Yarıyılı">Güz Yarıyılı</option>
            <option value="Bahar Yarıyılı">Bahar Yarıyılı</option>
          </select>
        </div>
        <div>
          <label>Başlangıç Tarihi</label>
          <input type="date" name="startDate" value={startDate} onChange={onChange} required />
        </div>
        <div>
          <label>Bitiş Tarihi</label>
          <input type="date" name="endDate" value={endDate} onChange={onChange} />
        </div>
        <button type="submit">Olay {event ? 'Güncelle' : 'Ekle'}</button>
        <button type="button" onClick={onClose}>Kapat</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default EventForm;