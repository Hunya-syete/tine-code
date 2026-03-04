# Portfolio Resume Website (Next.js + Laravel API + Vercel)

This repository contains a portfolio/resume website for **Christine June M. Jumawan**.

## Stack

- **Frontend**: Next.js (App Router + TypeScript + Tailwind CSS)
- **Backend**: PHP API entrypoint compatible with Laravel-style routing
- **Deployment**: Vercel (frontend + backend as separate projects)

## Features

- Resume landing page with:
  - Contact information
  - Work experience
  - Education
  - Skills
  - Certificates
- Resume content served from backend endpoint:
  - `GET /api/resume`
- Additional sample inventory endpoints remain available in backend:
  - `GET /api/health`
  - `GET /api/items`
  - `POST /api/items`
  - `PUT /api/items/{id}`
  - `DELETE /api/items/{id}`

## Local setup

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local 2>/dev/null || true
# Set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api in .env.local
npm run dev
```

### Backend

```bash
cd backend
php -S 127.0.0.1:8000 -t public
```

## Deploy to Vercel

### Frontend project

1. Import repo to Vercel with **Root Directory** = `frontend`
2. Add env var:
   - `NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api`
3. Deploy

### Backend project

1. Create second Vercel project with **Root Directory** = `backend`
2. Ensure `backend/vercel.json` is used
3. Deploy and test:
   - `https://<your-backend-domain>/api/resume`
