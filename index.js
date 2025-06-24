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

// Define allowed origins
const allowedOrigins = [
  'https://dev-sync-frontend-5dtj28h3j-shailly-yadavs-projects.vercel.app', // Vercel deployment
  'http://localhost:5174', // Vite dev server
  'http://localhost:4173', // Vite preview
  process.env.FRONTEND_URL // From env if different
].filter(Boolean); // Remove any undefined/null values

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins // Include allowed origins in health check for debugging
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
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Allowed origins:', allowedOrigins);
    });
  }
})
.catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;
