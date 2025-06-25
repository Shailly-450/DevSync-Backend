const { Server } = require('socket.io');

function isAllowedOrigin(origin) {
  // Allow localhost, production, and any Vercel preview
  return (
    !origin ||
    origin === 'http://localhost:5174' ||
    origin === 'http://localhost:4173' ||
    origin === 'https://dev-sync-frontend-b9dko1538-shailly-yadavs-projects.vercel.app' ||
    /^https:\/\/dev-sync-frontend-[^.]+-shailly-yadavs-projects\.vercel\.app$/.test(origin)
  );
}

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (isAllowedOrigin(origin)) {
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
