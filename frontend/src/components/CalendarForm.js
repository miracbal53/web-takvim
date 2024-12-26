import React, { useState } from 'react';
import axios from 'axios';
import './CalendarForm.css';

const CalendarForm = ({ onCalendarCreated, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    year: ''
  });
  const [message, setMessage] = useState('');

  const { name, year } = formData;

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
      const res = await axios.post('http://localhost:5000/api/calendars', formData, config);
      onCalendarCreated(res.data);
      setMessage('Takvim başarıyla oluşturuldu.');
    } catch (err) {
      console.error('Takvim oluşturulurken hata oluştu:', err);
      setMessage('Takvim oluşturulurken hata oluştu.');
    }
  };

  return (
    <div className="calendar-form">
      <form onSubmit={onSubmit}>
        <div>
          <label>Takvim Adı</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <label>Yıl</label>
          <select name="year" value={year} onChange={onChange} required>
            <option value="">Seçiniz</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2026-2027">2026-2027</option>
            <option value="2027-2028">2027-2028</option>
          </select>
        </div>
        <button type="submit">Takvim Oluştur</button>
        <button type="button" onClick={onClose}>Kapat</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default CalendarForm;