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

// Get recommended projects for a user
exports.getRecommendedProjects = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id).lean();
    if (!user || !user.skills || user.skills.length === 0) {
      return res.json([]); // Return empty if user has no skills
    }

    const userSkills = new Set(user.skills.map(s => s.toLowerCase()));

    const projects = await Project.find({
      creator: { $ne: user._id },
      members: { $ne: user._id },
      isPublic: true
    }).populate('creator', 'name').lean();

    const scoredProjects = projects.map(project => {
      let matchScore = 0;
      if (project.requiredSkills && project.requiredSkills.length > 0) {
        project.requiredSkills.forEach(skill => {
          if (userSkills.has(skill.toLowerCase())) {
            matchScore++;
          }
        });
      }
      return { ...project, matchScore };
    });

    const recommendedProjects = scoredProjects
      .filter(p => p.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    res.json(recommendedProjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
