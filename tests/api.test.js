const request = require('supertest');
const app = require('../index');
let token;
let projectId;

describe('DevSync API', () => {
  const testUser = {
    name: 'Test User',
    email: `testuser${Date.now()}@example.com`,
    password: 'password123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    token = res.body.token;
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should get the user profile', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', testUser.email);
  });

  it('should update the user profile', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Updated bio' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('bio', 'Updated bio');
  });

  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Project',
        description: 'A project for testing',
        requiredSkills: ['Node.js', 'React']
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Project');
    projectId = res.body._id;
  });

  it('should get all projects', async () => {
    const res = await request(app)
      .get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a task for the project', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        project: projectId,
        title: 'Test Task',
        description: 'A task for testing'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });

  it('should get all tasks for the project', async () => {
    const res = await request(app)
      .get(`/api/tasks/project/${projectId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a notification', async () => {
    // Get userId from profile
    const userRes = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    const userId = userRes.body._id;
    const res = await request(app)
      .post('/api/notifications')
      .send({
        user: userId,
        type: 'invite',
        message: 'You have been invited!'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('type', 'invite');
  });

  it('should get all notifications for the user', async () => {
    // Get userId from profile
    const userRes = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    const userId = userRes.body._id;
    const res = await request(app)
      .get(`/api/notifications/user/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
