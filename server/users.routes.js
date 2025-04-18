const express = require('express');
const router = express.Router();
const User = require('./user.model');
const Habit = require('./habit.model');

// Register a new user (username only)
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'Username is required.' });
    }
    const user = new User({ username: username.trim().toLowerCase() });
    await user.save();
    res.status(201).json({ _id: user._id, username: user.username });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: 'Username already exists.' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// Get user by username, limit to 50 logins per day, and return today's dailyState
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.trim().toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // --- LOGIN ATTEMPT LIMIT LOGIC ---
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let loginEntry = user.loginAttempts.find(a => a.date === today);
    if (!loginEntry) {
      loginEntry = { date: today, count: 0 };
      user.loginAttempts.push(loginEntry);
    }
    if (loginEntry.count >= 50) {
      return res.status(429).json({ error: 'Login limit reached for today (50).' });
    }
    loginEntry.count += 1;
    // Keep only the last 7 days for cleanup
    user.loginAttempts = user.loginAttempts.filter(a => a.date >= new Date(Date.now() - 8*24*60*60*1000).toISOString().slice(0,10));
    // --- END LOGIN ATTEMPT LIMIT LOGIC ---

    // --- DAILY STATE LOGIC ---
    let state = user.dailyState.find(s => s.date === today);
    if (!state) {
      state = { date: today, completedHabits: [], score: 0, completionPct: 0 };
      user.dailyState.push(state);
    } else {
      if (!Array.isArray(state.completedHabits)) state.completedHabits = [];
      // Always use stored completedHabits (persisted by PATCH)
      state.score = state.completedHabits.length;
      // Calculate completionPct from user's habits for today
      const habitsCount = await Habit.countDocuments({ user: user._id });
      state.completionPct = habitsCount > 0 ? Math.round((state.completedHabits.length / habitsCount) * 100) : 0;
    }
    // Clean up old state (keep last 7 days)
    user.dailyState = user.dailyState.filter(s => s.date >= new Date(Date.now() - 8*24*60*60*1000).toISOString().slice(0,10));
    await user.save();
    // --- END DAILY STATE LOGIC ---

    res.json({ _id: user._id, username: user.username, dailyState: state });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH endpoint to update today's dailyState (completedHabits, score, completionPct)
router.patch('/:username/daily', async (req, res) => {
  try {
    const { completedHabits, score, completionPct } = req.body;
    const user = await User.findOne({ username: req.params.username.trim().toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const today = new Date().toISOString().slice(0, 10);
    let state = user.dailyState.find(s => s.date === today);
    if (!state) {
      state = { date: today, completedHabits: [], score: 0, completionPct: 0 };
      user.dailyState.push(state);
    }
    if (Array.isArray(completedHabits)) state.completedHabits = completedHabits;
    if (typeof score === 'number') state.score = score;
    if (typeof completionPct === 'number') state.completionPct = completionPct;
    await user.save();
    res.json({ dailyState: state });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
