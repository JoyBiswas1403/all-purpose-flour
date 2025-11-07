# Enhancements Pack (Docker + Render + Vercel + Extras)

This pack gives you production-friendly deployment and local one-command runs **without renaming any UI terms like "Marketplace"**.

## Included
- `backend/Dockerfile` — build & run the API in Node 20 alpine
- `backend/.env.example` — copy to `.env`
- `frontend/Dockerfile` — static build served via nginx
- `docker-compose.yml` — `api` + `web` local stack
- `render.yaml` — one-click Render backend deploy (free plan)
- `frontend/vercel.json` — Vercel config (free) with `/api/*` proxy

## Local with Docker
1. Copy `backend/.env.example` to `backend/.env` and adjust.
2. Run: `docker compose up --build`
3. Web: http://localhost:5173  |  API: http://localhost:3000

## Deploy Backend on Render
1. Push repo to GitHub.
2. Update `render.yaml` repo URL and CORS origin.
3. In Render dashboard: **New +** "Blueprint" → select this repo. Choose free plan.
4. After deploy, note your backend URL: `https://apf-backend.onrender.com`

## Deploy Frontend on Vercel
1. Push `frontend` to same repo.
2. Import on Vercel → set Project Root to `frontend`.
3. Set Environment Variable: `VITE_API_URL = https://apf-backend.onrender.com`
4. Deploy. Vercel domain becomes your frontend URL.

## Notes
- Keep `Marketplace` route names as-is; these changes are infra-only.
- For SQLite on Render, we mount a persistent disk at `/opt/render/project/src/database.sqlite`.
- For dev, `docker-compose.yml` maps ports 3000 (API) and 5173 (web).
