require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Notification = require('./models/Notification');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear collections
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
  await Notification.deleteMany({});

  // Create users
  const users = await User.insertMany([
    {
      name: 'Alice Dev',
      email: 'alice@example.com',
      password: 'hashedpassword1',
      bio: 'Frontend React developer',
      skills: ['React', 'JavaScript', 'CSS'],
      github: 'https://github.com/alice',
      portfolio: 'https://alice.dev'
    },
    {
      name: 'Bob Backend',
      email: 'bob@example.com',
      password: 'hashedpassword2',
      bio: 'Node.js & MongoDB expert',
      skills: ['Node.js', 'MongoDB', 'Express'],
      github: 'https://github.com/bob',
      portfolio: 'https://bob.dev'
    }
  ]);

  // Create a project that Alice and Bob are already in
  const project = await Project.create({
    title: 'DevSync Platform',
    description: 'A platform for developer collaboration, helping connect developers with projects and teams.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'UI/UX Design'],
    creator: users[0]._id,
    members: [users[0]._id, users[1]._id],
    isPublic: true
  });

  // Add more projects for exploration
  await Project.insertMany([
    {
      title: 'Eco-Tracker Mobile App',
      description: 'A mobile application to track and reduce personal carbon footprint. Built with React Native and Firebase.',
      requiredSkills: ['React Native', 'Firebase', 'JavaScript', 'Mobile UI'],
      creator: users[0]._id,
      isPublic: true
    },
    {
      title: 'Open Source DataViz Library',
      description: 'A new charting and data visualization library for the web. Looking for contributors passionate about D3 and SVG.',
      requiredSkills: ['D3.js', 'TypeScript', 'SVG', 'Data Visualization'],
      creator: users[1]._id,
      isPublic: true
    },
    {
      title: 'AI-Powered Personal Finance Bot',
      description: 'A chatbot that helps users manage their finances using AI-driven insights. Backend in Python.',
      requiredSkills: ['Python', 'Flask', 'NLP', 'Machine Learning'],
      creator: users[0]._id,
      isPublic: true
    },
    {
        title: 'Community Health Connect',
        description: 'A web portal to connect local volunteers with healthcare facilities in need. Built with Vue.js and a Rails API.',
        requiredSkills: ['Vue.js', 'Ruby on Rails', 'PostgreSQL', 'CSS'],
        creator: users[1]._id,
        isPublic: true
    }
  ]);

  // Add project to users
  await User.findByIdAndUpdate(users[0]._id, { $push: { projects: project._id } });
  await User.findByIdAndUpdate(users[1]._id, { $push: { projects: project._id } });

  // Create tasks
  await Task.insertMany([
    {
      project: project._id,
      title: 'Set up backend',
      description: 'Initialize Node.js and Express',
      assignedTo: users[1]._id,
      status: 'done'
    },
    {
      project: project._id,
      title: 'Build frontend',
      description: 'Create React app',
      assignedTo: users[0]._id,
      status: 'in-progress'
    }
  ]);

  // Create notifications
  await Notification.insertMany([
    {
      user: users[0]._id,
      type: 'invite',
      message: 'You have been invited to DevSync Platform!'
    },
    {
      user: users[1]._id,
      type: 'application',
      message: 'Your application to DevSync Platform was accepted.'
    }
  ]);

  console.log('Dummy data inserted!');
  await mongoose.disconnect();
}

seed();
