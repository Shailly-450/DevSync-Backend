// Project routes for DevSync
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');
const taskController = require('../controllers/taskController');
const messageController = require('../controllers/messageController');

// Public: get all projects
router.get('/', projectController.getAllProjects);

// @route   GET /api/projects/recommendations
// @desc    Get recommended projects for the user
router.get('/recommendations', auth, projectController.getRecommendedProjects);

// Public: get project by ID
router.get('/:id', projectController.getProjectById);

// Auth: create project
router.post('/', auth, projectController.createProject);

// Auth: delete project
router.delete('/:id', auth, projectController.deleteProject);

// Auth: apply to project
router.post('/:projectId/apply', auth, applicationController.applyToProject);

module.exports = router;
