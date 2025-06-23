const express = require('express');
const router = express.Router({ mergeParams: true });
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// @route   GET /api/projects/:projectId/messages
// @desc    Get all messages for a project
// @access  Private
router.get('/', auth, messageController.getProjectMessages);

// @route   POST /api/projects/:projectId/messages
// @desc    Create a new message
// @access  Private
router.post('/', auth, messageController.createMessage);

module.exports = router; 