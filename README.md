# DevSync Backend

DevSync is a comprehensive Node.js + Express + MongoDB backend for a developer collaboration platform. It provides RESTful APIs for user authentication, AI-powered project recommendations, detailed project management, a real-time chat system, and more.

## ✨ Features
- **User Authentication:** Secure user registration and login using JWT, with support for Google OAuth.
- **User Profiles:** Manage user profiles with detailed information, including bio, personal skills, and links to GitHub/portfolio.
- **Project Management:** Full CRUD operations for projects, including title, description, required skills, and GitHub repository URLs.
- **AI-Powered Recommendations:** A smart recommendation engine that suggests projects to users based on the alignment of their skills with project needs.
- **Team Management:** Project creators can manage team members and review applications from other users.
- **Application System:** A complete workflow for users to apply to join projects, and for creators to accept or reject these applications.
- **Kanban-style Task Board:** Each project has a task board with states like 'To Do', 'In Progress', and 'Done'.
- **Real-time Chat:** Integrated chat rooms for each project using Socket.IO for instant communication between team members.
- **Notifications:** A system to notify users of important events (e.g., new applications, accepted requests).

## 🛠 Tech Stack
- **Node.js & Express** for the server framework.
- **MongoDB & Mongoose** for the database.
- **JSON Web Tokens (JWT)** for standard authentication.
- **Passport.js** for Google OAuth integration.
- **Socket.IO** for real-time communication.
- **RESTful API** architecture.

## 🚀 Setup
1. Clone the repo.
2. Navigate to the `DevSync` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file from the example and add your environment variables (MongoDB URI, JWT Secret, Google Client ID/Secret).
5. Start the server:
   ```bash
   npm start
   ```

## 🌐 API Endpoints
- `/api/auth`: User login and Google authentication.
- `/api/users`: User registration and profile management (`/me`).
- `/api/projects`: Full CRUD for projects, including AI-powered recommendations (`/recommendations`).
- `/api/applications`: Apply to projects and manage applications.
- `/api/tasks`: Manage tasks for a specific project.
- `/api/messages`: Real-time chat messaging endpoints.
- `/api/notifications`: Fetch and manage user notifications.

---
Built with collaboration in mind.
