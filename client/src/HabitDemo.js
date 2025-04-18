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

// SVG Trash Icon
const TrashIcon = ({color = '#888'}) => (
  <svg height="20" width="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8.5V14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 8.5V14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 8.5V14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="4" y="5.5" width="12" height="12" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M2 5.5H18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 5.5V4.5C8 3.94772 8.44772 3.5 9 3.5H11C11.5523 3.5 12 3.94772 12 4.5V5.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export default function HabitDemo() {
  const [existingAction, setExistingAction] = useState(EXISTING_ACTIONS[0]);
  const [newAction, setNewAction] = useState(NEW_ACTIONS[0]);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [reminderTime, setReminderTime] = useState('');
  const [habits, setHabits] = useState([]);
  const [message, setMessage] = useState('');
  const [deleteId, setDeleteId] = useState(null);

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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHabits(habits.filter(h => h._id !== id));
        setMessage('Habit deleted.');
      } else {
        setMessage('Failed to delete habit.');
      }
    } catch {
      setMessage('Network error while deleting.');
    }
    setDeleteId(null);
  };

  const openDeleteModal = (id) => setDeleteId(id);
  const closeDeleteModal = () => setDeleteId(null);

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
              <li key={habit._id} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 6px #0001', margin: '9px 0', padding: '13px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <span style={{ fontWeight: 600, color: '#3949ab' }}>{habit.existingAction}</span> → <span style={{ color: '#222' }}>{habit.newAction}</span> <span style={{ fontSize: '0.95em', color: '#888' }}>({habit.timeOfDay})</span>
                </span>
                <button
                  onClick={() => openDeleteModal(habit._id)}
                  style={trashButtonStyle}
                  title="Delete habit"
                  onMouseEnter={e => e.currentTarget.firstChild.style.color = '#ff5252'}
                  onMouseLeave={e => e.currentTarget.firstChild.style.color = '#888'}
                >
                  <TrashIcon color={deleteId === habit._id ? '#ff5252' : '#888'} />
                </button>
              </li>
            ))}
          </ul>
          {habits.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>No habits yet. Add one above!</div>}
        </div>
      </section>
      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ marginBottom: 18, fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>Delete this habit?</div>
            <div style={{ marginBottom: 24, color: '#555' }}>This action cannot be undone.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => handleDelete(deleteId)} style={modalDeleteBtnStyle}>Delete</button>
              <button onClick={closeDeleteModal} style={modalCancelBtnStyle}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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

const trashButtonStyle = {
  background: 'none',
  border: 'none',
  borderRadius: '50%',
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  outline: 'none',
  transition: 'background 0.2s',
  marginLeft: 12,
  padding: 0,
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle = {
  background: '#fff',
  borderRadius: 14,
  boxShadow: '0 8px 32px #0002',
  padding: '2rem 2.2rem',
  minWidth: 260,
  textAlign: 'center',
};

const modalDeleteBtnStyle = {
  background: 'linear-gradient(90deg, #ff5252 0%, #ff1744 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 7,
  fontWeight: 600,
  fontSize: '1rem',
  padding: '8px 22px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px #ff525222',
};

const modalCancelBtnStyle = {
  background: '#f4f7fb',
  color: '#222',
  border: 'none',
  borderRadius: 7,
  fontWeight: 500,
  fontSize: '1rem',
  padding: '8px 22px',
  cursor: 'pointer',
  boxShadow: '0 1px 4px #0001',
};
