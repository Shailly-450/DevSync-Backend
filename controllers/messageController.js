const Message = require('../models/Message');

// Get all messages for a project
exports.getProjectMessages = async (req, res) => {
  try {
    const messages = await Message.find({ project: req.params.projectId })
      .populate('user', 'name')
      .sort({ createdAt: 'asc' });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = new Message({
      content,
      project: req.params.projectId,
      user: req.user.id,
    });
    await message.save();
    
    // Populate user data before sending back
    const populatedMessage = await Message.findById(message._id).populate('user', 'name');

    // Emit message via socket.io
    req.io.to(req.params.projectId).emit('newMessage', populatedMessage);
    
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 