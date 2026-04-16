# TaskFlow - Full-Stack Production Task Management System

TaskFlow is a production-ready, SaaS-like task management system designed to emulate real-world platforms like Asana or Trello. It features an advanced API-first backend architecture built on Express/Node.js, matched with a beautiful, highly interactive Kanban UI built with React/Vite.

## 🌟 Key Features

* **Advanced Kanban Board**: Interactive Drag-and-Drop capability for intuitive task management.
* **Premium Vanilla UI**: Fully custom CSS styling leveraging CSS variables, dark mode natively supported, and micro-animations for interactions.
* **JWT Authentication**: Full role-based authorization (Admin/User access levels).
* **Document Uploading**: Robust PDF attachment integration using `multer` (Max 3 files per task).
* **High Performance Data Handling**: Utilizes Redux Toolkit and RTK Query to enforce rapid caching and minimized re-renders.
* **Zod Validation**: Fully type-safe validation schema guarding backend routes.
* **Containerized Deployment**: One-command complete deployment via Docker Compose.

---

## 🏗️ Architecture

- **Frontend**: React (Vite), Redux Toolkit (RTK Query), `@dnd-kit` (Drag & Drop functionality), Vanilla CSS Modules.
- **Backend**: Node.js, Express, MongoDB (Mongoose ODM), JWT Auth, Multer for static PDF processing.
- **Infrastructure**: Nginx (Frontend serve), Docker, Docker Compose.

---

## 🚀 Quick Start (Production via Docker)

You can launch the entire ecosystem (Database, API, Frontend network) seamlessly using Docker.

```bash
# 1. Clone this repository

# 2. Build and power up the containers
docker-compose up --build -d

# 3. Access
# - App is live at: http://localhost
# - API is live at: http://localhost:5000
```

---

## 💻 Local Development Setup

If you prefer to run it locally without Docker:

### 1. Database
Ensure you have an active MongoDB instance running.

### 2. Backend
```bash
cd backend
npm install
npm run dev
# The API will begin responding at http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# The Client will be live at http://localhost:5173
```
