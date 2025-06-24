const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Get current user
router.get('/me', auth, getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth?error=google_login_failed`
  }), 
  (req, res) => {
    try {
      // Generate JWT for the authenticated user
      const token = jwt.sign(
        { 
          id: req.user._id,
          email: req.user.email,
          name: req.user.name
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      // Redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/google/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth?error=token_generation_failed`);
    }
  }
);

module.exports = router;
