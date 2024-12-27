import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import CalendarList from './components/CalendarList';
import CalendarForm from './components/CalendarForm';
import BigCalendar from './components/BigCalendar';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import './App.css';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          setIsAdmin(false);
          setSelectedCalendar(null);
          setStatusMessage('Oturum süresi doldu, lütfen tekrar giriş yapın.');
          setTimeout(() => {
            setStatusMessage('');
          }, 2000);
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Token decoding error:', error);
        localStorage.removeItem('token');
        setIsAdmin(false);
        setSelectedCalendar(null);
        setStatusMessage('Geçersiz token, lütfen tekrar giriş yapın.');
        setTimeout(() => {
          setStatusMessage('');
        }, 2000);
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Her 1 dakikada bir kontrol et
    return () => clearInterval(interval);
  }, []);

  const handleAdminLogin = (status, name) => {
    setIsAdmin(status);
    setShowAdminLogin(false);
    setStatusMessage('Başarıyla giriş yapıldı.');
    setTimeout(() => {
      setStatusMessage('');
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    setSelectedCalendar(null);
    setStatusMessage('Başarıyla çıkış yapıldı.');
    setTimeout(() => {
      setStatusMessage('');
    }, 2000);
  };

  const handleCalendarSelect = calendar => {
    setSelectedCalendar(calendar);
  };

  const handleEditEvent = event => {
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
              <h2>{selectedCalendar.name} ({selectedCalendar.year.start} - {selectedCalendar.year.end})</h2> {/* Seçilen takvimin adını ve yılını göster */}
              <BigCalendar calendarId={selectedCalendar._id} defaultDate={new Date(selectedCalendar.year.start, 0, 1)} />
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