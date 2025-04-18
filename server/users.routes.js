const express = require('express');
const router = express.Router();
const User = require('./user.model');

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

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.trim().toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ _id: user._id, username: user.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
