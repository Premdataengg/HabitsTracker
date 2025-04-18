import React, { useState } from 'react';

const API_URL = 'http://localhost:5050/api/users';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${username.trim().toLowerCase()}`);
      const data = await res.json();
      if (res.ok) {
        onLogin(data._id); // pass ObjectId to App
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase() })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data._id);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F7FAFC 0%, #E3F0FF 100%)' }}>
      <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #0001', padding: '34px 28px', minWidth: 320 }}>
        <h2 style={{ margin: 0, marginBottom: 18, color: '#3949ab', fontWeight: 700 }}>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <label style={{ display: 'block', marginBottom: 12, color: '#333', fontWeight: 500 }}>
          Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', fontSize: '1rem', borderRadius: 7, border: '1px solid #bbb', marginTop: 6, background: '#f9fafd' }}
            placeholder="Enter your username"
            autoFocus
            disabled={loading}
          />
        </label>
        {error && <div style={{ color: '#d32f2f', marginBottom: 10 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg, #4f8cff 0%, #38b6ff 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1.08rem', padding: '10px 0', width: '100%', cursor: 'pointer', marginTop: 8 }}>
          {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}
        </button>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          {mode === 'login' ? (
            <>
              <span>Don't have an account?{' '}</span>
              <button type="button" style={{ color: '#3949ab', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }} onClick={() => { setMode('register'); setError(''); }} disabled={loading}>Register</button>
            </>
          ) : (
            <>
              <span>Already have an account?{' '}</span>
              <button type="button" style={{ color: '#3949ab', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }} onClick={() => { setMode('login'); setError(''); }} disabled={loading}>Login</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
