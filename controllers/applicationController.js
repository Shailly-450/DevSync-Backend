const Application = require('../models/Application');
const Project = require('../models/Project');
const User = require('../models/User');

// Apply to a project
exports.applyToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user has already applied
    const existingApplication = await Application.findOne({ project: projectId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this project.' });
    }

    // Check if user is already a member
    const project = await Project.findById(projectId);
    if (project.members.includes(userId)) {
      return res.status(400).json({ error: 'You are already a member of this project.' });
    }

    const newApplication = new Application({
      project: projectId,
      applicant: userId,
      status: 'pending',
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all applications for a project (for project owner)
exports.getProjectApplications = async (req, res) => {
  try {
    const applications = await Application.find({ project: req.params.projectId }).populate('applicant', 'name email');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Accept an application
exports.acceptApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Ensure the current user is the project creator
    const project = await Project.findById(application.project);
    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized to perform this action' });
    }
    
    // Prevent re-processing
    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'This application has already been processed.' });
    }

    // Update application status
    application.status = 'accepted';
    await application.save();

    // Add applicant to project members and project to applicant's list
    await Project.findByIdAndUpdate(application.project, { $addToSet: { members: application.applicant } });
    await User.findByIdAndUpdate(application.applicant, { $addToSet: { projects: application.project } });

    res.json({ msg: 'Application accepted successfully.', application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Reject an application
exports.rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Ensure the current user is the project creator
    const project = await Project.findById(application.project);
    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized to perform this action' });
    }

    // Update application status
    application.status = 'rejected';
    await application.save();

    res.json({ msg: 'Application rejected.', application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};