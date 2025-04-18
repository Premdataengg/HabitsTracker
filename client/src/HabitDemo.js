import React, { useState } from 'react';

const API_URL = 'http://localhost:5050/api/habits';
const TEST_USER_ID = '000000000000000000000000';

const EXISTING_ACTIONS = [
  'After waking up',
  'After breakfast',
  'After brushing my teeth',
  'After lunch',
  'After checking email',
  'After afternoon meetings',
  'After dinner',
  'After washing dishes',
  'After getting into bed',
];

const NEW_ACTIONS = [
  'Drink a glass of water',
  'Plan my daily tasks',
  'Stretch for two minutes',
  'Take a five-minute walk',
  'Note my priority task',
  'Do one minute of deep breathing',
  'Read for five minutes',
  'Write down one gratitude statement',
  'Journal briefly',
];

export default function HabitDemo() {
  const [existingAction, setExistingAction] = useState(EXISTING_ACTIONS[0]);
  const [newAction, setNewAction] = useState(NEW_ACTIONS[0]);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [reminderTime, setReminderTime] = useState('');
  const [habits, setHabits] = useState([]);
  const [message, setMessage] = useState('');

  const fetchHabits = async () => {
    const res = await fetch(`${API_URL}?user=${TEST_USER_ID}`);
    const data = await res.json();
    setHabits(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: TEST_USER_ID,
          existingAction,
          newAction,
          timeOfDay,
          reminderTime
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Habit created!');
        fetchHabits();
      } else {
        setMessage(data.error || 'Error creating habit');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F7FAFC 0%, #E3F0FF 100%)', padding: 0, margin: 0 }}>
      <section style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 700, margin: 0, letterSpacing: '-2px', color: '#222' }}>HabitsTracker</h1>
          <p style={{ fontSize: '1.15rem', color: '#555', marginTop: 12, marginBottom: 0 }}>
            Build new habits by stacking them onto your existing routines. Simple. Effective. Inspired by Atomic Habits.
          </p>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px #0001', padding: 28, marginBottom: 32 }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: 20, color: '#1a237e' }}>Create a Habit Stack</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ fontWeight: 500, color: '#333' }}>
              Existing Action
              <select value={existingAction} onChange={e => setExistingAction(e.target.value)} style={selectStyle}>
                {EXISTING_ACTIONS.map((action, i) => <option key={i} value={action}>{action}</option>)}
              </select>
            </label>
            <label style={{ fontWeight: 500, color: '#333' }}>
              New Habit
              <select value={newAction} onChange={e => setNewAction(e.target.value)} style={selectStyle}>
                {NEW_ACTIONS.map((action, i) => <option key={i} value={action}>{action}</option>)}
              </select>
            </label>
            <label style={{ fontWeight: 500, color: '#333' }}>
              Time of Day
              <select value={timeOfDay} onChange={e => setTimeOfDay(e.target.value)} style={selectStyle}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </label>
            <label style={{ fontWeight: 500, color: '#333' }}>
              Reminder Time (optional)
              <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} style={inputStyle} />
            </label>
            <button type="submit" style={buttonStyle}>Add Habit</button>
          </form>
          {message && <div style={{ color: '#388e3c', margin: '14px 0', fontWeight: 500 }}>{message}</div>}
        </div>
        <div style={{ background: '#f4f7fb', borderRadius: 14, boxShadow: '0 2px 12px #0001', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#222', margin: 0 }}>Your Habit Stacks</h3>
            <button onClick={fetchHabits} style={{ ...buttonStyle, fontSize: '0.95rem', padding: '7px 16px', margin: 0 }}>Fetch Habits</button>
          </div>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {habits.map(habit => (
              <li key={habit._id} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 6px #0001', margin: '9px 0', padding: '13px 18px' }}>
                <span style={{ fontWeight: 600, color: '#3949ab' }}>{habit.existingAction}</span> → <span style={{ color: '#222' }}>{habit.newAction}</span> <span style={{ fontSize: '0.95em', color: '#888' }}>({habit.timeOfDay})</span>
              </li>
            ))}
          </ul>
          {habits.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>No habits yet. Add one above!</div>}
        </div>
      </section>
    </main>
  );
}

const selectStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 7,
  border: '1px solid #bbb',
  marginTop: 5,
  marginBottom: 0,
  fontSize: '1rem',
  background: '#f9fafd',
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 7,
  border: '1px solid #bbb',
  marginTop: 5,
  marginBottom: 0,
  fontSize: '1rem',
  background: '#f9fafd',
};

const buttonStyle = {
  background: 'linear-gradient(90deg, #4f8cff 0%, #38b6ff 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '1.08rem',
  padding: '10px 0',
  marginTop: 10,
  cursor: 'pointer',
  transition: 'background 0.2s',
  boxShadow: '0 2px 8px #4f8cff22',
};
