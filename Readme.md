# TaskFlow — Task Manager App

A full-stack task management application where users can create, manage, and track tasks across three stages: **Todo**, **In Progress**, and **Done**.

---

## Live Demo

| Layer    | URL                                   |
| -------- | ------------------------------------- |
| Frontend | [https://task-management-xi-sandy.vercel.app/](https://task-management-xi-sandy.vercel.app/)  |
| Backend  | [https://taskflow-backend.onrender.com](https://task-management-ku4m.onrender.com) |

> **Note:** The backend is hosted on Render's free tier. It spins down after 15 minutes of inactivity, so the first request after an idle period may take 30–60 seconds to respond. Subsequent requests are fast.

---

## Tech Stack

| Layer           | Technology        | Reason                                              |
| --------------- | ----------------- | --------------------------------------------------- |
| Frontend        | React 18 + Vite   | Fast dev server, modern build tooling               |
| Styling         | Tailwind CSS v4   | Utility-first, rapid responsive design              |
| Drag & Drop     | @hello-pangea/dnd | Actively maintained fork of react-beautiful-dnd     |
| HTTP Client     | Axios             | Interceptors for token injection and 401 handling   |
| Notifications   | react-hot-toast   | Lightweight, non-intrusive toast alerts             |
| Routing         | React Router v6   | Standard SPA routing with protected routes          |
| Backend         | Node.js + Express | Minimal, flexible REST API                          |
| Database        | MongoDB Atlas     | Free-tier cloud database, flexible document model   |
| ODM             | Mongoose          | Schema validation and typed queries                 |
| Auth            | JWT + bcryptjs    | Stateless authentication, hashed passwords          |
| Frontend Deploy | Vercel            | Zero-config Vite deployment                         |
| Backend Deploy  | Render            | Free-tier Node.js hosting with env variable support |

---

## Features

### Core Requirements

- **Auth** — Register and login flow with form validation and error feedback
- **Tasks** — Create, edit, and delete tasks with a title, description, stage, and priority
- **Stages** — Every task belongs to one of three stages: Todo, In Progress, Done
- **Responsive UI** — Works on mobile and desktop
- **Loading states** — Spinner shown while fetching tasks; buttons disable during API calls
- **Error states** — All API errors are caught and shown as toast notifications

### Bonus Features (All Implemented)

- **Custom backend APIs** — 6 RESTful endpoints built from scratch with Express
- **Database integration** — MongoDB Atlas with Mongoose; all data persisted across sessions
- **Backend authentication** — JWT tokens (7-day expiry) with bcrypt password hashing

### Additional Features (Beyond Requirements)

- Drag and drop tasks between columns
- Priority levels per task — Low, Medium, High — with color-coded indicators
- Stats bar in the navbar showing total tasks, completed count, and urgent count
- Optimistic UI updates on drag — board updates instantly, syncs to backend in background
- Auto logout on token expiry — axios interceptor catches 401 and redirects to login
- Task cards show edit and delete actions on hover only — keeps the UI clean

---

## API Endpoints

| Method | Endpoint             | Description                                       | Auth Required |
| ------ | -------------------- | ------------------------------------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user                               | No            |
| POST   | `/api/auth/login`    | Login and receive JWT                             | No            |
| GET    | `/api/tasks`         | Get all tasks for logged-in user                  | Yes           |
| POST   | `/api/tasks`         | Create a new task                                 | Yes           |
| PUT    | `/api/tasks/:id`     | Update task (title, description, stage, priority) | Yes           |
| DELETE | `/api/tasks/:id`     | Delete a task                                     | Yes           |

All protected routes require the header:

```
Authorization: Bearer <token>
```

---

## Project Structure

```
taskflow/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (name, email, password)
│   │   └── Task.js          # Task schema (title, description, stage, priority, user ref)
│   ├── routes/
│   │   ├── auth.js          # Register and login routes
│   │   └── tasks.js         # CRUD task routes
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── .env                 # Environment variables (not committed)
│   └── server.js            # Express app entry point
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js         # Axios instance with auth interceptor
        ├── context/
        │   └── AuthContext.jsx  # Global auth state (user, login, logout)
        ├── pages/
        │   ├── Login.jsx        # Login page
        │   ├── Register.jsx     # Register page
        │   └── Dashboard.jsx    # Main Kanban board
        ├── components/
        │   ├── TaskCard.jsx     # Individual task card with edit/delete
        │   └── TaskModal.jsx    # Create/edit task modal
        ├── App.jsx              # Routes with public/private guards
        └── main.jsx             # React entry point
```

---

## Assumptions

- **Single user scope** — Each user sees only their own tasks. There is no shared workspace or team feature. This matched the assignment's scope.
- **No email verification** — Registration immediately grants access. Adding email verification was considered out of scope for a 3–4 hour assignment.
- **No pagination** — Tasks are fetched all at once. At the scale of a personal task manager this is fine; pagination would be added if task volume grew significantly.
- **Priority is user-defined** — There is no automatic priority calculation. Users assign priority manually when creating or editing a task.
- **Token stored in localStorage** — Simple and sufficient for this scope. The tradeoff is discussed below.

---

## Tradeoffs

### localStorage vs HttpOnly Cookies for JWT

Storing JWT in `localStorage` is straightforward to implement and works well for a client-rendered SPA. The tradeoff is vulnerability to XSS attacks. In a production application I would use HttpOnly cookies with CSRF protection instead. For this assignment scope, localStorage is acceptable.

### Optimistic UI on Drag and Drop

When a task is dragged between columns, the frontend updates immediately without waiting for the API response. This makes the UI feel instant. The tradeoff is that if the API call fails, the board has to revert — which is handled by re-fetching all tasks on error. This gives the best perceived performance while keeping data consistent.

### MongoDB over SQL

MongoDB Atlas has a generous free tier and works well with the flexible, document-based nature of tasks. A relational database (PostgreSQL via Supabase) would also work here but adds schema migration overhead for a project of this size.

### Render Free Tier for Backend

Render's free tier spins down inactive services after 15 minutes. This means cold starts can be slow. The alternative is Railway or Fly.io, which have slightly better cold start behavior but more complex setup. For a demo/assignment context, Render is the right call.

---

## Technical Decisions

### Why Vite over Create React App

CRA is deprecated and slow. Vite's dev server starts in under a second and HMR is near-instant. There was no reason to use CRA for a new project in 2024.

### Why @hello-pangea/dnd over react-beautiful-dnd

`react-beautiful-dnd` is no longer maintained and has React 18 compatibility issues. `@hello-pangea/dnd` is a drop-in maintained fork with identical API.

### JWT expiry set to 7 days

A short expiry (1 hour) would require refresh token logic, which adds significant complexity. A 7-day expiry is a reasonable middle ground for a task manager — users stay logged in across sessions without the app feeling like it constantly kicks them out.

### Mongoose schema validation

All data is validated at the Mongoose schema level before it reaches MongoDB. This means bad data (missing title, invalid stage value) is rejected at the application layer with a clear error, not silently stored as garbage.

### Axios interceptors

Rather than manually attaching the auth token to every API call and handling 401 errors in every component, a single Axios instance handles both. The request interceptor injects the token; the response interceptor catches 401s and redirects to login. This keeps every component clean.

---

## AI Tools Used

This project was built with AI assistance (Claude by Anthropic). As per the assignment guidelines, backend development is therefore mandatory — which is fully implemented with custom APIs, database integration, and JWT authentication.

---

## Local Setup

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account (free)

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
# → MongoDB connected
# → Server on port 5000
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# → http://localhost:5173
```

###

## Built With

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---
