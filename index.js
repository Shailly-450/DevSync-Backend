require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const http = require('http');
const setupSocket = require('./config/socket');
const taskRoutes = require('./routes/taskRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const applicationActionsRoutes = require('./routes/applicationActionsRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DevSync Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import and use routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/projects/:projectId/applications', applicationRoutes);
app.use('/api/applications', applicationActionsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/projects/:projectId/messages', messageRoutes);
app.use('/api/auth', require('./routes/authRoutes'));

// Passport configuration
require('./config/passport');

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = setupSocket(server);

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  if (require.main === module) {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
})
.catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;
