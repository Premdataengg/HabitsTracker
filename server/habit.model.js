const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  existingAction: {
    type: String,
    required: true
  },
  newAction: {
    type: String,
    required: true
  },
  timeOfDay: {
    type: String, // e.g., 'morning', 'afternoon', 'evening'
    required: true
  },
  reminderTime: {
    type: String // e.g., '19:00' (24h format)
  },
  completedDates: [{
    type: Date
  }],
  streak: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Habit', habitSchema);
