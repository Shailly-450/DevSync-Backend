const Project = require('../models/Project');

// Get all projects (public)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('creator members');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('creator members', 'name email');
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Create a new project (auth required)
exports.createProject = async (req, res) => {
  try {
    const { title, description, requiredSkills, githubUrl, isPublic } = req.body;
    const project = new Project({
      title,
      description,
      requiredSkills,
      githubUrl,
      creator: req.user.id,
      members: [req.user.id],
      isPublic
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a project (auth required)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if the user is the creator
    if (project.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await project.deleteOne();

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
};
