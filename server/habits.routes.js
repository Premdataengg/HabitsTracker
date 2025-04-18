// Habits endpoints
const express = require('express');
const router = express.Router();
const Habit = require('./habit.model');

// POST /api/habits
router.post('/', async (req, res) => {
  try {
    const { user, existingAction, newAction, timeOfDay, reminderTime } = req.body;
    const habitData = {
      user,
      existingAction,
      newAction
    };
    if (typeof timeOfDay !== 'undefined') habitData.timeOfDay = timeOfDay;
    if (typeof reminderTime !== 'undefined') habitData.reminderTime = reminderTime;
    const habit = new Habit(habitData);
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/habits
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    const habits = await Habit.find({ user });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/habits/:id
router.patch('/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/habits/:id
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
