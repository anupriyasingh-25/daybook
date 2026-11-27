# Daybook — Daily Task Manager

A full-stack task manager for keeping everyday work organized. Each account has a private task list stored in MongoDB, and authentication uses JWTs in HttpOnly cookies.

## Features

- Account registration with email validation, password confirmation, and bcrypt password hashing.
- Login, logout, persistent sessions, and protected dashboard routes.
- Add, edit, complete/reopen, and delete tasks, with optional descriptions and due dates.
- Filter by all, pending, or completed; search task titles without reloading.
- Per-user task ownership enforced by the API on every task operation.
- Responsive dashboard, summary counts, empty states, loading indicators, and helpful error messages.

## Technologies

- React 18, Vite, JavaScript, React Router, Lucide icons
- Node.js, Express, REST API
- MongoDB and Mongoose
- JWT, bcryptjs, HttpOnly cookies

## Project layout

```text
daily-task-manager/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── components/       # Forms, task cards, route guards, shared UI
│       ├── context/          # Authentication state
│       ├── pages/            # Login, registration, dashboard
│       ├── services/         # Fetch API client
│       └── styles/           # Responsive app styles
├── server/
│   ├── config/               # MongoDB connection
│   ├── controllers/          # Authentication and task logic
│   ├── middleware/           # Authentication and errors
│   ├── models/               # Mongoose User and Task
│   ├── routes/               # REST endpoints
│   ├── utils/
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## Requirements

- Node.js 18 or newer and npm
- MongoDB running locally, or a MongoDB Atlas cluster

## Install and configure

1. Copy `.env.example` to `server/.env` (or create `server/.env` yourself).
2. Set `MONGO_URI` to your MongoDB connection string. For a local MongoDB server, the example URI is `mongodb://127.0.0.1:27017/daily-task-manager`. For Atlas, use its connection string and replace the username, password, and database name. Do not commit credentials.
3. Set `JWT_SECRET` to a random secret of at least 32 characters. For example, generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and paste the result into `server/.env`.
4. Keep `PORT=5000`, `CLIENT_URL=http://localhost:5173`, and `NODE_ENV=development` for local development.
5. From the project root, install all dependencies:

   ```bash
   npm run install-all
   ```

## Run the application

Start the backend and Vite frontend together from the project root:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API runs on [http://localhost:5000](http://localhost:5000), and Vite proxies `/api` requests to it.

Run either side separately if preferred:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

Create your account in the registration page, log in, then manage tasks in the dashboard. MongoDB must be running and reachable before the server starts.

## Environment variables

| Variable | Purpose | Local example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/daily-task-manager` |
| `JWT_SECRET` | Secret used to sign session JWTs (32+ characters) | Generate a private random value |
| `PORT` | Express server port | `5000` |
| `CLIENT_URL` | Allowed browser origin for credentialed CORS | `http://localhost:5173` |
| `NODE_ENV` | Enables secure cookie behavior in production | `development` |

The actual `.env` belongs in `server/.env` and is ignored by Git. In production, use HTTPS, set `NODE_ENV=production`, and configure `CLIENT_URL` to the exact frontend origin. The Vercel frontend proxies `/api` requests to the Render API so authentication cookies remain same-origin; do not set `VITE_API_URL` to the Render URL.

## REST API

All responses are JSON. Protected endpoints require the session cookie issued at login.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user (`name`, `email`, `password`, `confirmPassword`) |
| `POST` | `/api/auth/login` | Log in and set the HttpOnly cookie (`email`, `password`) |
| `POST` | `/api/auth/logout` | Clear the session cookie |
| `GET` | `/api/auth/me` | Get the current safe user profile |
| `GET` | `/api/tasks` | List the signed-in user's tasks, newest first |
| `POST` | `/api/tasks` | Create a task (`title`, optional `description`, `dueDate`) |
| `GET` | `/api/tasks/:id` | Get one owned task |
| `PUT` | `/api/tasks/:id` | Update title, description, and/or due date |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle completed status |
| `DELETE` | `/api/tasks/:id` | Delete an owned task |
| `GET` | `/api/health` | Check whether the API is responding |

The task owner is always taken from the verified JWT, never from client-provided IDs. Responses never include password hashes.

## Screenshots

Screenshots can be added here after running the application locally.

## Future improvements

- Task priority and category labels
- Pagination and calendar views
- Password reset and email verification
- Automated API and browser end-to-end tests

## Notes for deployment

Use a strong private `JWT_SECRET`, a restricted MongoDB network allowlist, HTTPS, and an exact `CLIENT_URL`. The frontend sends API requests through its Vercel origin, and session cookies are `HttpOnly`, `SameSite=Lax`, and marked `Secure` in production.
