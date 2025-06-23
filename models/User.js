// User schema for DevSync
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // hashed, if using JWT
  googleId: { type: String }, // if using Google Auth
  bio: { type: String },
  skills: [{ type: String }],
  github: { type: String },
  portfolio: { type: String },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
