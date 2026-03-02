# Inventory Management System (Next.js + Tailwind + Laravel-style API)

This repository now contains a full-stack inventory system with:

- **Frontend**: Next.js (App Router + TypeScript + Tailwind CSS)
- **Backend**: PHP/Laravel-style API endpoints for inventory CRUD
- **Deployment target**: Vercel (frontend + backend as separate projects)

## Features

- Inventory dashboard with total SKU count and total stock value
- Create, edit, and delete inventory items
- Categories, SKU, quantity, and pricing support
- API endpoints for listing and mutating inventory
- Vercel-ready backend routing via `backend/vercel.json`

## Project structure

- `frontend/` — Next.js UI for inventory operations
- `backend/` — API service entrypoint (`public/index.php`) and inventory seed/data files

## API routes

- `GET /api/health` — health check
- `GET /api/items` — list inventory items
- `POST /api/items` — create item
- `PUT /api/items/{id}` — update item
- `DELETE /api/items/{id}` — delete item

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
php -S 127.0.0.1:8000 -t public
```

The API persists data to `backend/data/inventory-db.json` and auto-seeds from `backend/data/inventory.php` on first run.

## Deploy to Vercel

### Frontend deployment

1. Import this repository into Vercel and set **Root Directory** to `frontend`.
2. Set environment variable:
   - `NEXT_PUBLIC_API_URL=https://<your-backend-vercel-domain>/api`
3. Deploy.

### Backend deployment

1. Create another Vercel project from the same repository with **Root Directory** set to `backend`.
2. Ensure `backend/vercel.json` is detected.
3. Deploy.
4. Confirm endpoint responds:
   - `https://<your-backend-vercel-domain>/api/health`

## Notes

- This backend implementation uses a lightweight Laravel-style API entrypoint for compatibility with constrained environments.
- For production at scale, replace file-based persistence with a managed database.
