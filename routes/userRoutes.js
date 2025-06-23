// User routes for DevSync
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getProfile, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Register a new user (basic, no auth yet)
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authenticated user profile
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

module.exports = router;
