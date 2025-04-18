const mongoose = require('mongoose');

const loginLimitSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  count: { type: Number, default: 0 }
}, { _id: false });

const dailyStateSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  completedHabits: [String], // Array of habit IDs completed that day
  score: { type: Number, default: 0 }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  loginAttempts: [loginLimitSchema],
  dailyState: [dailyStateSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
