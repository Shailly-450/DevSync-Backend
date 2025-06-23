// Project application (join request) routes for DevSync
const express = require('express');
const router = express.Router({ mergeParams: true });
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// Note: This route is prepended with /api/projects/:projectId from index.js
// Handles GET /api/projects/:projectId/applications
router.get('/', auth, applicationController.getProjectApplications);

// @route   POST /api/projects/:projectId/apply
// @desc    Apply to join a project
// @access  Private
// This route is slightly different and mounted separately in index.js
// For now, we define the controller and will create a separate route file for it.

// @route   POST /api/applications/:appId/accept
// @desc    Accept an application (creator only)
// @access  Private
router.post('/:appId/accept', auth, applicationController.acceptApplication);

// @route   POST /api/applications/:appId/reject
// @desc    Reject an application (creator only)
// @access  Private
router.post('/:appId/reject', auth, applicationController.rejectApplication);

module.exports = router;
