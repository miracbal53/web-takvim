import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import AdminLogin from './components/AdminLogin';
import CalendarList from './components/CalendarList';
import CalendarForm from './components/CalendarForm';
import BigCalendar from './components/BigCalendar'; // BigCalendar bileşenini ekleyin
import './App.css';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = (status, name) => {
    setIsAdmin(status);
    setShowAdminLogin(false);
    setStatusMessage('Başarıyla giriş yapıldı.');
    localStorage.setItem('token', 'your-token'); // Token'ı localStorage'a kaydedin

    setTimeout(() => {
      setStatusMessage('');
    }, 2000); // 2 saniye sonra mesajı temizle

    setTimeout(() => {
      window.location.href = '/'; // 3 saniye sonra ana sayfaya yönlendir
    }, 2000);
  };

  const handleCalendarSelect = (calendar) => {
    setSelectedCalendar(calendar);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    setSelectedCalendar(null);
    setStatusMessage('Başarıyla çıkış yapıldı.');
    setTimeout(() => {
      setStatusMessage('');
    }, 2000); // 2 saniye sonra mesajı temizle
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Akademik Takvim</h1>
          {statusMessage && <p>{statusMessage}</p>}
          {!isAdmin && !showAdminLogin && (
            <button onClick={() => setShowAdminLogin(true)}>Admin Girişi</button>
          )}
          {isAdmin && (
            <>
              <p>Hoşgeldin Admin!</p>
              <button onClick={handleLogout}>Çıkış Yap</button>
            </>
          )}
        </header>
        <main>
          {showAdminLogin && <AdminLogin onLogin={handleAdminLogin} />}
          <CalendarList onSelectCalendar={handleCalendarSelect} />
          {isAdmin && (
            <button onClick={() => setShowCalendarForm(!showCalendarForm)}>
              Takvim Ekle
            </button>
          )}
          {showCalendarForm && <CalendarForm onSubmit={() => setShowCalendarForm(false)} />}
          {selectedCalendar && (
            <>
              <BigCalendar calendarId={selectedCalendar._id} /> {/* BigCalendar bileşenini ekleyin */}
              <EventList calendarId={selectedCalendar._id} isAdmin={isAdmin} onEditEvent={handleEditEvent} />
              {editingEvent && (
                <div className="event-form">
                  <h2>Olay Düzenleme</h2>
                  <EventForm calendarId={selectedCalendar._id} event={editingEvent} onSubmit={() => setEditingEvent(null)} onClose={() => setEditingEvent(null)} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </Router>
  );
};

export default App;