import React, { useState } from 'react';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import BigCalendar from './components/BigCalendar';
import AdminLogin from './components/AdminLogin';
import CalendarList from './components/CalendarList';
import CalendarForm from './components/CalendarForm';
import './App.css';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(null);

  const handleAdminLogin = (status, name) => {
    setIsAdmin(status);
    setAdminName(name);
    setShowAdminLogin(false);
  };

  const handleCalendarSelect = (calendar) => {
    setSelectedCalendar(calendar);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    setAdminName('');
    setSelectedCalendar(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Akademik Takvim</h1>
        {!isAdmin && !showAdminLogin && (
          <button onClick={() => setShowAdminLogin(true)}>Admin Girişi</button>
        )}
        {isAdmin && (
          <>
            <p>Hoşgeldin Admin !</p>
            <button onClick={handleLogout}>Çıkış Yap</button>
          </>
        )}
      </header>
      <main>
        {showAdminLogin && <AdminLogin onLogin={handleAdminLogin} />}
        <CalendarList onSelectCalendar={handleCalendarSelect} />
        {selectedCalendar && (
          <>
            <h2>{selectedCalendar.name} - {selectedCalendar.year.start} - {selectedCalendar.year.end}</h2>
            <BigCalendar calendarId={selectedCalendar._id} />
            <EventList calendarId={selectedCalendar._id} isAdmin={isAdmin} />
            {isAdmin && (
              <>
                <button onClick={() => setShowEventForm(true)}>Olay Ekle</button>
                {showEventForm && (
                  <EventForm calendarId={selectedCalendar._id} onClose={() => setShowEventForm(false)} />
                )}
              </>
            )}
          </>
        )}
        {isAdmin && (
          <>
            <button onClick={() => setShowCalendarForm(true)}>Takvim Ekle</button>
            {showCalendarForm && (
              <CalendarForm onCalendarCreated={handleCalendarSelect} onClose={() => setShowCalendarForm(false)} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;