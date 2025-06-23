const Task = require('../models/Task');
const Project = require('../models/Project');

// Get all tasks for a project
exports.getProjectTasks = async (req, res) => {
  try {
    // Check if user is a member of the project
    const project = await Project.findById(req.params.projectId);
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ msg: 'User not a member of this project' });
    }
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title } = req.body;
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ msg: 'User not a member of this project' });
    }

    const newTask = new Task({
      title,
      project: req.params.projectId,
      createdBy: req.user.id,
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { title, status, assignedTo } = req.body;
  try {
    let task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    const project = await Project.findById(task.project);
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ msg: 'User not a member of this project' });
    }
    
    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { $set: { title, status, assignedTo } },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const project = await Project.findById(task.project);
    if (project.creator.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Only the project creator can delete tasks' });
    }

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 