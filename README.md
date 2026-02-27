# Online Quiz / Exam Website (Next.js + Laravel + Vercel)

This repository contains a **classroom online quiz/exam platform** with:

- **Frontend**: Next.js (App Router + TypeScript + Tailwind)
- **Backend**: Laravel API (quiz listing + attempt submission)
- **Deployment target**: Vercel (frontend + backend as separate projects)

## Project structure

- `frontend/` — Next.js app for students
- `backend/` — Laravel API for quizzes and exam attempts

## Features included

- Student dashboard showing available quizzes
- Laravel API endpoint to fetch quizzes (`GET /api/quizzes`)
- Laravel API endpoint to submit attempts (`POST /api/attempts`)
- CORS config prepared for local frontend-backend integration
- Vercel config for Laravel serverless entrypoint (`backend/vercel.json`)

## Local setup

### 1) Frontend

```bash
cd frontend
npm install
cp .env.example .env.local 2>/dev/null || true
# Set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api in .env.local
npm run dev
```

### 2) Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
mkdir -p database && touch database/database.sqlite
php artisan migrate
php artisan serve
```

## Vercel deployment

### Frontend (Next.js)

1. Create a new Vercel project from `frontend/`.
2. Add env var `NEXT_PUBLIC_API_URL` pointing to your deployed Laravel API URL.
3. Deploy.

### Backend (Laravel)

1. Create another Vercel project from `backend/`.
2. Vercel will use `backend/vercel.json` and route requests to `api/index.php`.
3. Configure environment variables (`APP_KEY`, DB credentials, etc.) in Vercel.

## Notes

Because package registries may be restricted in some environments, this repository includes the source scaffold but expects dependency installation in your own machine/CI.
