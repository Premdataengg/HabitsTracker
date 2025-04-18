import React, { useState, useEffect } from 'react';
import './App.css';
import HabitDemo from './HabitDemo';
import Login from './Login';
import { FiLogOut } from 'react-icons/fi';

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId('');
  };

  if (!userId) {
    return <Login onLogin={setUserId} />;
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
      <HabitDemo userId={userId} />
    </div>
  );
}

export default App;
