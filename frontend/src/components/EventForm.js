import React, { useState } from 'react';
import axios from 'axios';
import './EventForm.css';

const EventForm = ({ calendarId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    semester: '',
    startDate: '',
    endDate: ''
  });
  const [message, setMessage] = useState('');

  const { name, semester, startDate, endDate } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
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

      const res = await axios.post(`http://localhost:5000/api/events`, eventData, config);
      setMessage('Olay başarıyla eklendi.');
      console.log(res.data);
    } catch (err) {
      console.error('Olay eklenirken hata oluştu:', err);
      setMessage('Olay eklenirken hata oluştu.');
    }
  };

  return (
    <div className="event-form">
      <form onSubmit={onSubmit}>
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
        <button type="submit">Olay Ekle</button>
        <button type="button" onClick={onClose}>Kapat</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default EventForm;