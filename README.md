# DevSync Backend

DevSync is a Node.js + Express + MongoDB backend for a developer collaboration platform. It provides RESTful APIs for user authentication, project management, matchmaking, real-time chat (via Socket.IO), and task tracking.

## Features
- User registration and profiles
- Project creation and team management
- Skill-based matchmaking
- Real-time chat (planned)
- Kanban-style task management
- Notifications

## Tech Stack
- Node.js, Express
- MongoDB (Mongoose)
- RESTful API

## Setup
1. Clone the repo
2. Install dependencies:
   ```zsh
   npm install
   ```
3. Copy `.env.example` to `.env` and set your MongoDB URI and JWT secret.
4. Start the server:
   ```zsh
   node index.js
   ```

## API Endpoints
- `/api/users` – User registration and listing
- `/api/projects` – Project CRUD
- `/api/applications` – Project join requests
- `/api/tasks` – Task management
- `/api/notifications` – Notifications

---

For more details, see each route file in `/routes` and schema in `/models`.
