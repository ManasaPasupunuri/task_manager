# TaskForge

A full-stack team collaboration and task management platform built with modern web technologies. TaskForge enables teams to manage projects, assign tasks, track progress, monitor overdue work, and collaborate through a secure role-based system.

Designed with scalable backend architecture, responsive UI, and production-ready practices.

---

## Features

### Authentication & Authorization

* JWT-based authentication
* Secure signup/login flow
* Protected routes
* Password hashing with bcrypt
* Persistent authentication state

### Role-Based Access Control (RBAC)

* Two-tier role system:

  * Global roles
  * Project-level roles
* Fine-grained access permissions
* Admin/member project permissions
* Route-level authorization middleware

### Project Management

* Create and manage projects
* Add/remove project members
* Project-specific team collaboration
* Role badges for project members

### Task Management

* Create, assign, edit, and delete tasks
* Task priorities and statuses
* Due date tracking
* Overdue task detection
* Project-scoped task organization

### Dashboard & Analytics

* Task statistics overview
* Overdue task tracking
* Assigned task monitoring
* Upcoming task visibility

### UI/UX

* Responsive design
* Modern dark-themed interface
* Glassmorphism-inspired UI
* Reusable component architecture
* Optimized navigation flow

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL

### Authentication & Security

* JWT Authentication
* bcrypt password hashing
* Middleware-based authorization

---

## Project Structure

```plaintext
Web App/
├── client/
├── output screens/
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Architecture Highlights

### Clean Architecture

The project follows a scalable backend structure with clear separation of concerns:

* Controllers handle request/response logic
* Services contain business logic
* Middleware manages authentication, authorization, and validation
* Routes define API endpoints
* Prisma handles database interactions

### Middleware Architecture

Centralized middleware handling for:

* Authentication
* Authorization
* Validation
* Error handling

### Prisma ORM Integration

* Schema-driven database modeling
* Type-safe database queries
* Relational data management
* Migration support

### Scalable Folder Structure

Frontend and backend are modularized for maintainability and scalability.

---

## RBAC System

TaskForge implements a two-tier RBAC model.

### Global Roles

| Role   | Access                            |
| ------ | --------------------------------- |
| ADMIN  | System-wide administrative access |
| MEMBER | Standard application access       |

### Project Roles

| Role   | Permissions                       |
| ------ | --------------------------------- |
| ADMIN  | Manage project, members, tasks    |
| MEMBER | Access project and assigned tasks |

### Access Flow

```plaintext
Request → JWT Authentication → Role Middleware → Controller
```

---

## Overdue Task Logic

A task becomes overdue when:

```javascript
task.dueDate < currentDate && task.status !== "DONE"
```

Overdue tasks are:

* Highlighted in the dashboard
* Counted in analytics
* Visually emphasized in project views

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | `/api/auth/signup` | Register user    |
| POST   | `/api/auth/login`  | Login user       |
| GET    | `/api/auth/me`     | Get current user |

### Projects

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/projects`     | Get user projects   |
| POST   | `/api/projects`     | Create project      |
| GET    | `/api/projects/:id` | Get project details |
| PUT    | `/api/projects/:id` | Update project      |
| DELETE | `/api/projects/:id` | Delete project      |

### Members

| Method | Endpoint                            | Description   |
| ------ | ----------------------------------- | ------------- |
| POST   | `/api/projects/:id/members`         | Add member    |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |

### Tasks

| Method | Endpoint                         | Description |
| ------ | -------------------------------- | ----------- |
| POST   | `/api/projects/:projectId/tasks` | Create task |
| PUT    | `/api/tasks/:id`                 | Update task |
| DELETE | `/api/tasks/:id`                 | Delete task |

### Dashboard

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/dashboard` | Dashboard analytics |

---

## Screenshots

Project screenshots are available in the `output screens/` directory.

Suggested screenshots:

* Login Page
* Dashboard
* Projects Page
* Task Management
* Team Management

---

## Environment Variables

Create a `.env` file inside the `server/` directory.

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskforge"

JWT_SECRET="your_jwt_secret"

JWT_EXPIRES_IN="24h"

PORT=5000

NODE_ENV=development

CLIENT_URL="http://localhost:5173"
```

---

## Local Setup

### 1. Clone Repository

```bash
git clone <your-repository-url>
```

---

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

### 3. Setup Database

Ensure PostgreSQL is installed and running.

Create database:

```sql
CREATE DATABASE taskforge;
```

---

### 4. Run Prisma Migration

```bash
npx prisma migrate dev --name init
```

---

### 5. Seed Database

```bash
node prisma/seed.js
```

---

### 6. Start Backend

```bash
npm run dev
```

Backend runs on:

```plaintext
http://localhost:5000
```

---

### 7. Install Frontend Dependencies

Open a second terminal:

```bash
cd client
npm install
```

---

### 8. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```plaintext
http://localhost:5173
```

---

## Demo Credentials

```plaintext
Email: admin@example.com
Password: Admin123!
```

---

## Deployment Status

Deployment is currently pending.

Target platform:

* Railway

---

## Future Improvements

* Real-time notifications
* Activity logs
* File attachments
* Team chat integration
* Email reminders
* Advanced analytics
* Kanban board support

---

## Project Goals

TaskForge was built to demonstrate:

* Full-stack application development
* Secure authentication systems
* Role-based authorization
* REST API architecture
* Database relationship management
* Scalable backend organization
* Responsive frontend engineering

---

## Author

Manasa Pasupunuri

B.Tech Information Technology
Sreenidhi Institute of Science and Technology
