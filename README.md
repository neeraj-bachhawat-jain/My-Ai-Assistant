# My AI Assistant

A full-stack web application featuring an AI-powered assistant with user authentication and customization capabilities.

## Project Structure

This project is organized into two main directories:

### [Backend](./backend/)

The backend is built with Node.js and Express, providing API services and AI integration.

**Key Features:**

- User authentication and authorization
- Integration with Gemini AI API
- Image upload with Cloudinary
- Database management (MongoDB)
- User profile management

**Key Files:**

- [index.mjs](./backend/index.mjs) - Main server entry point
- [gemini.mjs](./backend/gemini.mjs) - Gemini AI integration
- [package.json](./backend/package.json) - Backend dependencies

**Directories:**

- `config/` - Configuration files (database, tokens, Cloudinary)
- `controllers/` - Route controllers for authentication and user management
- `middlewares/` - Custom middleware (authentication, file uploads)
- `models/` - Database models (User model)
- `routes/` - API routes (auth, user routes)
- `public/` - Static files

---

### [Frontend](./frontend/)

The frontend is built with React and Vite, providing an interactive user interface.

**Key Features:**

- User authentication (Login/Signup)
- Customization pages
- User context for state management
- Responsive design with CSS

**Key Files:**

- [App.jsx](./frontend/src/App.jsx) - Main application component
- [main.jsx](./frontend/src/main.jsx) - React entry point
- [index.html](./frontend/index.html) - HTML template
- [package.json](./frontend/package.json) - Frontend dependencies
- [vite.config.js](./frontend/vite.config.js) - Vite configuration

**Directories:**

- `src/` - Source code
  - `Components/` - Reusable React components
  - `Context/` - Context API for state management
  - `Pages/` - Page components (Home, Login, Signup, Customize)
  - `assets/` - Static assets (images)
- `public/` - Public assets

---

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with required environment variables

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Technology Stack

**Backend:**

- Node.js
- Express
- MongoDB
- Gemini AI API
- Cloudinary

**Frontend:**

- React
- Vite
- Tailwind CSS

---

## Features

- **User Authentication** - Secure login and signup
- **AI Integration** - Powered by Gemini AI
- **Profile Management** - Update user information
- **Image Upload** - With Cloudinary integration
- **Customization** - Multiple customization pages
- **Responsive Design** - Works on all devices

---
