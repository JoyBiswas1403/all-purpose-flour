# All Purpose Flour — Shift Swap App

Full‑stack app for managing work events and requesting shift swaps between users.

## Tech Stack
- Backend: Node.js, Express, TypeScript, SQLite
- Frontend: React + Vite + TypeScript, Axios, React Router, Tailwind CSS
- Auth: JWT (Bearer tokens)

## Getting Started

### Prerequisites
- Node.js 18+

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` (already present) and set `JWT_SECRET` if desired.
4. Start dev server: `npm run dev`
   - Server runs on `http://localhost:3000`
   - API base path: `/api`

### Frontend
1. `cd frontend`
2. `npm install`
3. Start dev server: `npm run dev`
   - App runs on `http://localhost:5173` (or next available port)
   - Configure `VITE_API_URL` if backend is not on default: `http://localhost:3000/api`

## API Overview

### Auth
- `POST /api/auth/register` → `{ name, email, password }` → `{ token, user }`
- `POST /api/auth/login` → `{ email, password }` → `{ token, user }`
- `GET /api/auth/me` (Bearer) → `{ user }`

### Events (Bearer)
- `GET /api/events` → User’s events
- `POST /api/events` → `{ title, description?, startTime, endTime }`
- `PATCH /api/events/:id/status` → `{ status: 'scheduled' | 'swappable' }`
- `DELETE /api/events/:id`

### Swaps (Bearer)
- `GET /api/swaps/swappable-slots` → All users’ swappable events
- `POST /api/swaps/request` → `{ targetEventId, requesterEventId }`
- `POST /api/swaps/respond/:id` → `{ status: 'accepted' | 'rejected' }`
- `GET /api/swaps/incoming` → Incoming swap requests
- `GET /api/swaps/outgoing` → Outgoing swap requests

## Frontend Routes
- `/login` and `/register` → Auth pages
- `/` → Dashboard (list, make swappable, delete)
- `/new` → Create event
- `/marketplace` → Browse swappable slots and request swaps
- `/requests` → Review incoming/outgoing requests

## Notes
- First run initializes SQLite automatically; DB file is `backend/database.sqlite`.
- If you see `EADDRINUSE`, stop duplicate servers and re‑start.
- Tailwind is configured via `tailwind.config.js` and `postcss.config.js`.

## Development Tips
- Use Browser devtools Network tab to inspect API calls.
- JWT is stored in `localStorage` as `token`.