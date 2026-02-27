# Portfolio Web App (Next.js + Laravel + Vercel)

This repository contains a **portfolio/resume website** for Christine June M. Jumawan with:

- **Frontend**: Next.js 15 (App Router + TypeScript + Tailwind)
- **Backend**: Laravel API that serves resume data
- **Deployment target**: Vercel (frontend + backend as separate projects)

## Project structure

- `frontend/` — Next.js portfolio UI
- `backend/` — Laravel API (`GET /api/resume`)

## Features

- Modern responsive one-page portfolio
- Resume sections:
  - Profile summary and contacts
  - Work experience
  - Education
  - Skills
  - Certificates
- API-powered content so you can update resume data from the backend
- Vercel-ready setup for both frontend and backend

## Local setup

## 1) Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

API will be available at: `http://127.0.0.1:8000/api/resume`

## 2) Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local 2>/dev/null || true
# Set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api in .env.local
npm run dev
```

App will be available at: `http://127.0.0.1:3000`

## Vercel deployment

### Frontend deployment

1. Create a Vercel project using `frontend/` as root.
2. Set env var `NEXT_PUBLIC_API_URL` to your backend URL (e.g. `https://<backend-domain>/api`).
3. Deploy.

### Backend deployment

1. Create another Vercel project using `backend/` as root.
2. Vercel uses `backend/vercel.json` and routes all requests to `api/index.php`.
3. Set environment variables in Vercel (`APP_KEY`, `APP_ENV`, DB settings if needed).
4. Deploy.

## API endpoint

- `GET /api/resume` → returns complete resume data used by the frontend.
