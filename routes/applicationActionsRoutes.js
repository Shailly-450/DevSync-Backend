const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// Note: These routes would typically be protected and only accessible to project creators.
// The auth middleware and logic within the controller should handle authorization.

// @route   POST /api/applications/:id/accept
// @desc    Accept a join request
// @access  Private (Project Creator)
router.post('/:id/accept', auth, applicationController.acceptApplication);

// @route   POST /api/applications/:id/reject
// @desc    Reject a join request
// @access  Private (Project Creator)
router.post('/:id/reject', auth, applicationController.rejectApplication);

module.exports = router; 