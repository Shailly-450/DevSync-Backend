// Project schema for DevSync
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  requiredSkills: [{ type: String }],
  githubUrl: { type: String }, // GitHub repository URL
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  chatRoom: { type: String }, // Socket.IO room id
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
