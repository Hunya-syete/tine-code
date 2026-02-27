# Portfolio Web App (Next.js + PHP API + Vercel)

This repository contains a **portfolio/resume website** for Christine June M. Jumawan with:

- **Frontend**: Next.js 15 (App Router + TypeScript + Tailwind)
- **Backend**: PHP API serving resume JSON at `GET /api/resume`
- **Deployment target**: Vercel (frontend + backend as separate projects)

## Project structure

- `frontend/` — Next.js portfolio UI
- `backend/` — API for resume data

## Local setup

### 1) Backend

```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan serve
```

Backend URL: `http://127.0.0.1:8000/api/resume`

### 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env.local 2>/dev/null || true
# Set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api in .env.local
npm run dev
```

Frontend URL: `http://127.0.0.1:3000`

## Fix for `Could not open input file: artisan`

If you see this in PowerShell:

```text
Could not open input file: artisan
```

It means your current folder does not contain the `artisan` file.

Use:

```powershell
cd C:\Users\renny\tine-code\backend
Get-ChildItem artisan
php artisan key:generate
php artisan serve
```

If you also see:

```text
PHP Warning: Module "openssl" is already loaded
```

You likely enabled `extension=openssl` twice in your `php.ini` files (CLI vs Apache). Keep only one entry and restart terminal.

## Vercel deployment

### Frontend

1. Create a Vercel project from `frontend/`.
2. Set `NEXT_PUBLIC_API_URL` to your backend URL (e.g. `https://<backend-domain>/api`).
3. Deploy.

### Backend

1. Create a Vercel project from `backend/`.
2. Vercel will use `backend/vercel.json` and `backend/api/index.php`.
3. Deploy.
