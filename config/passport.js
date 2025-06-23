const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const callbackURL = (process.env.BACKEND_URL || 'http://localhost:5001') + '/api/auth/google/callback';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Try to find user by googleId
    let user = await User.findOne({ googleId: profile.id });
    
    // If not found, try to find by email
    if (!user && profile.emails && profile.emails.length > 0) {
      user = await User.findOne({ email: profile.emails[0].value });
      // If found by email, link googleId
      if (user) {
        user.googleId = profile.id;
        await user.save();
      }
    }
    
    // If still not found, create new user
    if (!user) {
      user = await User.create({
        name: profile.displayName || 'User',
        email: profile.emails[0].value,
        googleId: profile.id,
        bio: '',
        skills: [],
        github: '',
        portfolio: ''
      });
    }
    
    return done(null, user);
  } catch (err) {
    console.error('Google OAuth error:', err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
