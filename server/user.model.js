const mongoose = require('mongoose');

const loginLimitSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  count: { type: Number, default: 0 }
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
