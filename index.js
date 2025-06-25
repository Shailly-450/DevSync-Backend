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

// Allow all Vercel preview URLs, production, and localhost
function isAllowedOrigin(origin) {
  return (
    !origin ||
    origin === 'http://localhost:5174' ||
    origin === 'http://localhost:4173' ||
    origin === 'https://dev-sync-frontend-b9dko1538-shailly-yadavs-projects.vercel.app' ||
    /^https:\/\/dev-sync-frontend-[^.]+-shailly-yadavs-projects\.vercel\.app$/.test(origin)
  );
}

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
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
