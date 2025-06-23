const { Server } = require('socket.io');

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ['GET', 'POST']
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
