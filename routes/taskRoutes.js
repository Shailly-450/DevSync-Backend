// Task routes for DevSync
const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Note: All routes in this file are automatically prepended with '/api/projects/:projectId'

// @route   GET /api/projects/:projectId/tasks
// @desc    Get all tasks for a project
// @access  Private
router.get('/', auth, taskController.getProjectTasks);

// @route   POST /api/projects/:projectId/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, taskController.createTask);

// @route   PUT /api/projects/:projectId/tasks/:taskId
// @desc    Update a task
// @access  Private
router.put('/:taskId', auth, taskController.updateTask);

// @route   DELETE /api/projects/:projectId/tasks/:taskId
// @desc    Delete a task
// @access  Private
router.delete('/:taskId', auth, taskController.deleteTask);

module.exports = router;
