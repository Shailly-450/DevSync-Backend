# Authentication Setup Guide

## Environment Variables

Create a `.env` file in the `DevSync` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/devsync

# JWT Secret (generate a strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Secret (generate a strong secret for production)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BACKEND_URL=http://localhost:5001

# Frontend URL (should match your frontend development server)
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development

# Port (This should match the port your server is running on)
PORT=5001
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `http://localhost:5001/api/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

## Frontend Environment Variables

Create a `.env` file in the `DevSync-frontend/DevSync` directory:

```env
VITE_API_URL=http://localhost:5001
```

## Installation

1. Install backend dependencies:
   ```bash
   cd DevSync
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd DevSync-frontend/DevSync
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd DevSync
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd DevSync-frontend/DevSync
   npm run dev
   ```

## Authentication Features

- **JWT-based authentication** for API requests
- **Session-based authentication** for Google OAuth
- **Password hashing** with bcrypt
- **Token expiration** (7 days)
- **Automatic token refresh** handling
- **Secure logout** functionality
- **Error handling** for expired/invalid tokens

## Security Improvements Made

1. Added session middleware for Passport.js
2. Improved password hashing (12 rounds instead of 10)
3. Added proper error handling and validation
4. Implemented secure token management
5. Added user existence verification in auth middleware
6. Improved CORS configuration with credentials support
7. Added proper logout functionality
8. Enhanced Google OAuth error handling
9. Added request/response interceptors for token management
10. Improved frontend error handling and user feedback 