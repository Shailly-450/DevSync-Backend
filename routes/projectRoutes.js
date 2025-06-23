// Project routes for DevSync
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

// Public: get all projects
router.get('/', projectController.getAllProjects);

// Public: get project by ID
router.get('/:id', projectController.getProjectById);

// Auth: create project
router.post('/', auth, projectController.createProject);

// Auth: delete project
router.delete('/:id', auth, projectController.deleteProject);

// Auth: apply to project
router.post('/:projectId/apply', auth, applicationController.applyToProject);

module.exports = router;
