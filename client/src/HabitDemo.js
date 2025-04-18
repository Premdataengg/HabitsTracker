import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import CalendarHeatmap from './CalendarHeatmap';
import CompleteCircle from './CompleteCircle';
import { FiPlusCircle } from 'react-icons/fi';

const API_URL = 'http://localhost:5050/api/habits';
const TEST_USER_ID = '000000000000000000000000';

// Grouped options for Existing Actions (Atomic Habits style)
const EXISTING_ACTION_GROUPS = [
  {
    label: 'Morning Routine',
    options: [
      { value: 'Wake up', label: 'Wake up' },
      { value: 'Brush teeth', label: 'Brush teeth' },
      { value: 'Take a shower', label: 'Take a shower' },
      { value: 'Use deodorant', label: 'Use deodorant' },
      { value: 'Skincare or grooming', label: 'Skincare or grooming' },
      { value: 'Get dressed', label: 'Get dressed' },
      { value: 'Comb/brush hair', label: 'Comb/brush hair' },
      { value: 'Clip nails (occasionally)', label: 'Clip nails (occasionally)' },
      { value: 'Use the restroom', label: 'Use the restroom' },
      { value: 'Wash hands regularly', label: 'Wash hands regularly' },
    ]
  },
  {
    label: 'Eating & Drinking',
    options: [
      { value: 'Drink water', label: 'Drink water' },
      { value: 'Eat breakfast', label: 'Eat breakfast' },
      { value: 'Have lunch', label: 'Have lunch' },
      { value: 'Have dinner', label: 'Have dinner' },
      { value: 'Drink coffee or tea', label: 'Drink coffee or tea' },
      { value: 'Snack between meals (optional)', label: 'Snack between meals (optional)' },
    ]
  },
  {
    label: 'Work & Productivity',
    options: [
      { value: 'Check phone', label: 'Check phone' },
      { value: 'Check emails', label: 'Check emails' },
      { value: 'Attend meetings or calls', label: 'Attend meetings or calls' },
      { value: 'Work on tasks/projects', label: 'Work on tasks/projects' },
      { value: 'Take breaks', label: 'Take breaks' },
      { value: 'Commute (or log into work)', label: 'Commute (or log into work)' },
      { value: 'Make to-do list (optional)', label: 'Make to-do list (optional)' },
      { value: 'Shut down/log off from work', label: 'Shut down/log off from work' },
    ]
  },
  {
    label: 'Home & Daily Chores',
    options: [
      { value: 'Make the bed', label: 'Make the bed' },
      { value: 'Do dishes', label: 'Do dishes' },
      { value: 'Tidy up/clean', label: 'Tidy up/clean' },
      { value: 'Take out trash (as needed)', label: 'Take out trash (as needed)' },
      { value: 'Do laundry (a few times a week)', label: 'Do laundry (a few times a week)' },
    ]
  },
  {
    label: 'Relaxation & Wind-down',
    options: [
      { value: 'Watch TV / YouTube / scroll phone', label: 'Watch TV / YouTube / scroll phone' },
      { value: 'Talk to family or friends', label: 'Talk to family or friends' },
      { value: 'Spend time with kids/pets', label: 'Spend time with kids/pets' },
      { value: 'Read a book / browse the news', label: 'Read a book / browse the news' },
      { value: 'Take evening shower (optional)', label: 'Take evening shower (optional)' },
      { value: 'Go to bed / sleep', label: 'Go to bed / sleep' },
    ]
  }
];

// Grouped options for New Habit (same as user provided list)
const NEW_ACTION_GROUPS = [
  {
    label: 'Health Habits',
    options: [
      'Drink 8 glasses of water daily',
      'Exercise for 30 minutes',
      'Walk 10,000 steps',
      'Eat 5 servings of fruits/vegetables',
      'Take vitamins or supplements',
      'Limit sugar intake',
      'Avoid junk food',
      'No soda consumption',
      'No alcohol consumption',
      'No smoking',
      'Sleep at least 7 hours',
      'Morning stretches or yoga',
      'Track calorie intake',
      'Meditate for 10 minutes',
      'Practice deep breathing exercises',
      'Monitor blood pressure',
      'Track blood sugar levels',
      'Floss teeth',
      'Skincare routine',
      'Take prescribed medications',
      'Limit caffeine intake',
      'Spend time outdoors',
      'Track menstrual cycle',
      'Practice gratitude journaling',
      'Maintain proper posture',
    ]
  },
  {
    label: 'Productivity Habits',
    options: [
      'Plan daily tasks',
      'Review weekly goals',
      'Use a to-do list',
      'Time block work sessions',
      'Limit social media usage',
      'Check emails at designated times',
      'Declutter workspace',
      'Set daily priorities',
      'Use the Pomodoro technique',
      'Reflect on daily achievements',
      'Read for 30 minutes',
      'Learn a new skill',
      'Attend professional development sessions',
      'Network with a colleague',
      'Update project statuses',
      'Organize digital files',
      'Backup important data',
      'Automate repetitive tasks',
      'Set SMART goals',
      'Review monthly progress',
      'Limit multitasking',
      'Take regular short breaks',
      'Use productivity apps/tools',
      'Maintain a consistent work schedule',
      'Prepare for the next day',
    ]
  },
  {
    label: 'Wellness Habits',
    options: [
      'Meditate for 10 minutes',
      'Practice daily gratitude',
      'Write in a journal',
      'Say positive affirmations',
      'Do a digital detox (no phone/screens for 1+ hour)',
      'Spend time in nature',
      'Practice mindfulness (e.g., while eating or walking)',
      'Sleep by a specific time (e.g., 10 PM)',
      'Track mood or emotions',
      'Do something relaxing (e.g., take a bath, listen to music)',
    ]
  },
  {
    label: 'Lifestyle Habits',
    options: [
      'Read a book/article',
      'Clean a room or declutter',
      'Cook a homemade meal',
      'Limit screen time after dinner',
      'Spend quality time with family or pets',
      'Connect with a friend (call or message)',
      'Practice a hobby (e.g., drawing, music, crafts)',
      'No unnecessary spending',
      'Make your bed',
      'Wake up at the same time daily',
    ]
  }
];

// Combine all unique items from EXISTING_ACTION_GROUPS into NEW_ACTION_GROUPS
const existingActionsFlat = EXISTING_ACTION_GROUPS.flatMap(g => g.options.map(o => (typeof o === 'string' ? o : o.value)));
const newActionsFlat = NEW_ACTION_GROUPS.flatMap(g => g.options);
const allUniqueNewActions = Array.from(new Set([...newActionsFlat, ...existingActionsFlat]));

// Add to New Habit as an extra group
const NEW_ACTION_GROUPS_WITH_EXISTING = [
  ...NEW_ACTION_GROUPS,
  {
    label: 'Routine & Daily Actions',
    options: existingActionsFlat.filter(a => !newActionsFlat.includes(a)),
  }
];

const ALL_EXISTING_OPTIONS = EXISTING_ACTION_GROUPS.flatMap(g => g.options);
const ALL_NEW_ACTIONS = NEW_ACTION_GROUPS_WITH_EXISTING.flatMap(g => g.options);

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
  const [existingAction, setExistingAction] = useState(ALL_EXISTING_OPTIONS[0]);
  const [newAction, setNewAction] = useState(ALL_NEW_ACTIONS[0]);
  const [habits, setHabits] = useState([]);
  const [message, setMessage] = useState('');

  // Gamification: Score and Completion Percentage
  const [score, setScore] = useState(0);
  const [completionPct, setCompletionPct] = useState(0);

  // Track completed habits by date (key: date string, value: Set of habit IDs)
  const [completedHabits, setCompletedHabits] = useState({});
  const todayStr = new Date().toISOString().slice(0, 10);

  // Mark habit as completed for today
  const markHabitDone = (habitId) => {
    setCompletedHabits(prev => {
      const updated = { ...prev };
      if (!updated[todayStr]) updated[todayStr] = new Set();
      updated[todayStr] = new Set(updated[todayStr]);
      updated[todayStr].add(habitId);
      return updated;
    });
  };

  // Unmark habit as completed for today
  const unmarkHabitDone = (habitId) => {
    setCompletedHabits(prev => {
      const updated = { ...prev };
      if (!updated[todayStr]) return updated;
      updated[todayStr] = new Set(updated[todayStr]);
      updated[todayStr].delete(habitId);
      return updated;
    });
  };

  // Calculate score and completion percentage whenever habits or completedHabits change
  useEffect(() => {
    const todayDone = completedHabits[todayStr] ? completedHabits[todayStr].size : 0;
    setScore(todayDone * 10); // 10 points per habit completed
    setCompletionPct(habits.length ? Math.round((todayDone / habits.length) * 100) : 0);
  }, [habits, completedHabits, todayStr]);

  // Build a map of day->completion percentage for the calendar (last 30 days)
  const calendarCompletionMap = React.useMemo(() => {
    const map = {};
    const days = 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const done = completedHabits[dayStr] ? completedHabits[dayStr].size : 0;
      map[dayStr] = habits.length ? Math.round((done / habits.length) * 100) : 0;
    }
    return map;
  }, [completedHabits, habits]);

  const fetchHabits = async () => {
    const res = await fetch(`${API_URL}?user=${TEST_USER_ID}`);
    const data = await res.json();
    setHabits(Array.isArray(data) ? data : []);
  };

  // On mount, fetch habits automatically
  useEffect(() => {
    fetchHabits();
  }, []);

  const isDuplicate = (optionA, optionB) => {
    if (!optionA || !optionB) return false;
    const valA = typeof optionA === 'string' ? optionA : optionA.value;
    const valB = typeof optionB === 'string' ? optionB : optionB.value;
    return valA && valB && valA.trim().toLowerCase() === valB.trim().toLowerCase();
  };

  const isStackDuplicate = (existingAction, newAction) => {
    const getValue = v => (typeof v === 'object' && v !== null ? v.value : v);
    const ex = getValue(existingAction);
    const nw = getValue(newAction);
    return habits.some(h =>
      h.existingAction.trim().toLowerCase() === ex.trim().toLowerCase() &&
      h.newAction.trim().toLowerCase() === nw.trim().toLowerCase()
    );
  };

  const customNoOptionsMessage = ({ inputValue, selectType }) => {
    if (isDuplicate(existingAction, newAction)) {
      return 'Action and Habit cannot be the same.';
    }
    return selectType === 'menu' ? 'No options' : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (isDuplicate(existingAction, newAction)) {
      setMessage('Action and Habit cannot be the same.');
      return;
    }
    if (isStackDuplicate(existingAction, newAction)) {
      setMessage('This habit stack already exists.');
      return;
    }
    const getValue = v => (typeof v === 'object' && v !== null ? v.value : v);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: TEST_USER_ID,
          existingAction: getValue(existingAction),
          newAction: getValue(newAction),
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
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F7FAFC 0%, #E3F0FF 100%)', padding: 0, margin: 0 }}>
      <section style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 700, margin: 0, letterSpacing: '-2px', color: '#222' }}>HabitsTracker</h1>
          <p style={{ fontSize: '1.15rem', color: '#555', marginTop: 12, marginBottom: 0 }}>
            Build new habits by stacking them onto your existing routines. Simple. Effective.
          </p>
        </div>

        {/* --- HABIT STACK (TOP) --- */}
        <section style={{ background: '#f4f7fb', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '32px 24px 28px 24px', margin: '30px 0 38px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#222', margin: 0 }}>Your Habit Stack</h3>
          </div>
          {/* Gamification: Score & Completion Bar */}
          <div style={{ margin: '30px 0 18px 0', textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '1.13rem', color: '#3949ab' }}>
              Daily Score: <span style={{ color: '#38b6ff' }}>{score}</span>
            </div>
            <div style={{ margin: '10px 0 0 0', fontWeight: 500, color: '#222' }}>
              Completion: {completionPct}%
            </div>
            <div style={{ margin: '8px 0 0 0', background: '#e3f0ff', borderRadius: 8, height: 18, width: 260, display: 'inline-block', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #38b6ff 0%, #4f8cff 100%)', width: `${completionPct}%`, height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
            </div>
            {/* Calendar Heatmap */}
            <div style={{ margin: '20px 0 0 0' }}>
              <CalendarHeatmap completionMap={calendarCompletionMap} days={30} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 4, fontSize: '0.98em' }}>
                <span><span style={{ display: 'inline-block', width: 16, height: 16, background: '#ff9800', borderRadius: 3, marginRight: 4, verticalAlign: 'middle' }} />33%</span>
                <span><span style={{ display: 'inline-block', width: 16, height: 16, background: '#ffeb3b', borderRadius: 3, marginRight: 4, verticalAlign: 'middle' }} />66%</span>
                <span><span style={{ display: 'inline-block', width: 16, height: 16, background: '#4caf50', borderRadius: 3, marginRight: 4, verticalAlign: 'middle' }} />99%</span>
              </div>
            </div>
          </div>
          {/* Encouragement Banner (dynamic, based on progress) */}
          {habits.length > 0 && completionPct > 0 && completionPct < 100 && (
            <div style={{
              background: 'linear-gradient(90deg, #fffbe7 0%, #e3f0ff 100%)',
              borderRadius: 10,
              margin: '0 0 18px 0',
              padding: '13px 20px',
              fontWeight: 600,
              color: '#3949ab',
              fontSize: '1.08rem',
              boxShadow: '0 2px 8px #3949ab11',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              {(() => {
                const left = habits.length - (completedHabits[todayStr]?.size || 0);
                if (left === 1) return <>Almost there! Just <span style={{color:'#38b6ff'}}>1</span> left to go 🎯</>;
                if (left <= 3) return <>You're so close! Only <span style={{color:'#38b6ff'}}>{left}</span> more to finish your stack 🚀</>;
                if (completionPct >= 66) return <>Great progress! <span style={{color:'#38b6ff'}}>{left}</span> left for a perfect day 💪</>;
                if (completionPct >= 33) return <>Nice start! <span style={{color:'#38b6ff'}}>{left}</span> more for a winning streak 🙌</>;
                return <>Let's get started! Mark your first habit complete to build momentum 🌱</>;
              })()}
            </div>
          )}
          {/* Habit List with completion checkmarks */}
          <div style={{ marginTop: 18 }}>
            {habits.length === 0 && <div style={{ color: '#888', fontWeight: 500 }}>No habits added yet.</div>}
            {habits.map(habit => {
              const done = completedHabits[todayStr] && completedHabits[todayStr].has(habit._id);
              return (
                <div key={habit._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: '10px 16px' }}>
                  <CompleteCircle
                    done={!!done}
                    onClick={() => done ? unmarkHabitDone(habit._id) : markHabitDone(habit._id)}
                  />
                  <div style={{ flex: 1, fontWeight: 500, color: done ? '#4f8cff' : '#333', textDecoration: done ? 'line-through' : 'none', marginLeft: 12 }}>
                    <span>{habit.existingAction}</span>
                    <span style={{ margin: '0 8px', color: '#888' }}>→</span>
                    <span>{habit.newAction}</span>
                  </div>
                  {/* Existing delete button/icon here */}
                  <button onClick={() => handleDelete(habit._id)} style={trashButtonStyle}>
                    <TrashIcon color="#f44336" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- CREATE HABIT STACK (BOTTOM) --- */}
        <section style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '32px 24px 28px 24px', margin: '38px 0 30px 0' }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#3949ab', marginBottom: 18 }}>Create Habit Stack</div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
            <label style={{ fontWeight: 500, color: '#333' }}>
              Existing Action
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                <CreatableSelect
                  options={ALL_EXISTING_OPTIONS}
                  value={existingAction}
                  onChange={option => {
                    if (!isDuplicate(option, newAction)) setExistingAction(option);
                  }}
                  styles={{ ...reactSelectStyles, container: base => ({ ...base, width: '100%' }) }}
                  placeholder="Choose or add existing action..."
                  isClearable
                  isSearchable
                  formatCreateLabel={inputValue => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#388e3c', fontSize: '1.03em' }}>
                      <FiPlusCircle style={{ fontSize: 22, color: '#38b6ff' }} />
                      Add <span style={{ color: '#3949ab', fontWeight: 700, marginLeft: 3 }}>&quot;{inputValue}&quot;</span>
                    </div>
                  )}
                  onCreateOption={inputValue => {
                    if (!isDuplicate({ value: inputValue }, newAction)) setExistingAction({ value: inputValue, label: inputValue });
                  }}
                  noOptionsMessage={customNoOptionsMessage}
                />
              </div>
            </label>
            <label style={{ fontWeight: 500, color: '#333' }}>
              New Habit
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                <CreatableSelect
                  options={NEW_ACTION_GROUPS_WITH_EXISTING.map(group => ({
                    label: group.label,
                    options: group.options.map(a => typeof a === 'string' ? { value: a, label: a } : a)
                  }))}
                  value={typeof newAction === 'string' ? { value: newAction, label: newAction } : newAction}
                  onChange={option => {
                    if (!isDuplicate(existingAction, option)) setNewAction(option);
                  }}
                  styles={{ ...reactSelectStyles, container: base => ({ ...base, width: '100%' }) }}
                  placeholder="Choose or add new habit..."
                  isClearable
                  isSearchable
                  formatCreateLabel={inputValue => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#388e3c', fontSize: '1.03em' }}>
                      <FiPlusCircle style={{ fontSize: 22, color: '#38b6ff' }} />
                      Add <span style={{ color: '#3949ab', fontWeight: 700, marginLeft: 3 }}>&quot;{inputValue}&quot;</span>
                    </div>
                  )}
                  onCreateOption={inputValue => {
                    if (!isDuplicate(existingAction, { value: inputValue })) setNewAction({ value: inputValue, label: inputValue });
                  }}
                  noOptionsMessage={customNoOptionsMessage}
                />
              </div>
            </label>
            <button type="submit" style={buttonStyle}>Add Habit</button>
          </form>
          {message && <div style={{ color: '#388e3c', margin: '14px 0', fontWeight: 500 }}>{message}</div>}
        </section>
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

const reactSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: 7,
    borderColor: state.isFocused ? '#4f8cff' : '#bbb',
    boxShadow: state.isFocused ? '0 0 0 2px #4f8cff33' : 'none',
    fontSize: '1rem',
    background: '#f9fafd',
    minHeight: 42,
    paddingLeft: 2,
  }),
  menu: base => ({
    ...base,
    borderRadius: 8,
    boxShadow: '0 4px 24px #0002',
    zIndex: 10,
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? '#e3f0ff' : state.isFocused ? '#f4f7fb' : '#fff',
    color: '#222',
    fontWeight: state.isSelected ? 600 : 400,
    fontSize: '1rem',
    cursor: 'pointer',
  }),
  groupHeading: base => ({
    ...base,
    color: '#3949ab',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '6px 12px',
  }),
};
