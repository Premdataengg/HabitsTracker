import React, { useState, useEffect } from 'react';
import './App.css';
import HabitDemo from './HabitDemo';
import Login from './Login';
import { FiLogOut } from 'react-icons/fi';

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [dailyState, setDailyState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dailyState')) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]);

  useEffect(() => {
    if (dailyState && typeof dailyState === 'object') {
      localStorage.setItem('dailyState', JSON.stringify(dailyState));
    }
  }, [dailyState]);

  // On login, receive all info
  const handleLogin = (id, uname, state) => {
    setUserId(id);
    setUsername(uname);
    setDailyState(state);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('dailyState');
    setUserId('');
    setUsername('');
    setDailyState({});
  };

  // At midnight, refresh state
  useEffect(() => {
    if (!userId || !username) return;
    const checkMidnight = () => {
      const today = new Date().toISOString().slice(0, 10);
      if (dailyState?.date !== today) {
        // Fetch new state from backend
        fetch(`http://localhost:5050/api/users/${username}`)
          .then(res => res.json())
          .then(data => {
            if (data.dailyState) setDailyState(data.dailyState);
          });
      }
    };
    const interval = setInterval(checkMidnight, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [userId, username, dailyState]);

  if (!userId) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        background: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
      }}>
        <div style={{ width: 480, display: 'flex', justifyContent: 'flex-end', paddingRight: 14 }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(244, 247, 251, 0.85)',
              border: 'none',
              borderRadius: 20,
              color: '#3949ab',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '8px 18px 8px 14px',
              margin: '18px 0 0 0',
              boxShadow: '0 2px 8px #3949ab11',
              cursor: 'pointer',
              transition: 'background 0.18s',
              outline: 'none',
            }}
            title="Logout"
            onMouseOver={e => (e.currentTarget.style.background = '#e3f0ff')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(244, 247, 251, 0.85)')}
          >
            <FiLogOut size={20} />
            <span style={{fontWeight: 500}}>Logout</span>
          </button>
        </div>
      </header>
      <HabitDemo userId={userId} username={username} dailyState={dailyState} setDailyState={setDailyState} />
    </div>
  );
}

export default App;
