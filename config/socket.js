const { Server } = require('socket.io');

function setupSocket(server) {
  // Define allowed origins (keep in sync with main app)
  const allowedOrigins = [
    'https://dev-sync-frontend-5dtj28h3j-shailly-yadavs-projects.vercel.app', // Vercel deployment
    'http://localhost:5174', // Vite dev server
    'http://localhost:4173', // Vite preview
    process.env.FRONTEND_URL // From env if different
  ].filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log('Socket.io blocked origin:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Authorization']
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Join project room
    socket.on('joinRoom', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined room ${projectId}`);
    });
    // Leave project room
    socket.on('leaveRoom', (projectId) => {
      socket.leave(projectId);
      console.log(`User ${socket.id} left room ${projectId}`);
    });
    // Handle chat message (renamed to newMessage for frontend compatibility)
    socket.on('newMessage', ({ roomId, message, user }) => {
      io.to(roomId).emit('newMessage', { message, user, createdAt: new Date() });
    });
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = setupSocket;
