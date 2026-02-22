# Personal Website + Guestbook

This project now contains:

- Main profile page: `personal-profile/frontend/main.html`
- Separate guestbook React app: `personal-profile/frontend/guestbook-app`
- Flask API backend: `personal-profile/backend`
- Supabase as the guestbook database

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Flask |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel (frontend), Render (backend) |

## 1) Supabase Setup

Create a table in Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.guestbook_entries (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	message text not null,
	created_at timestamptz not null default now()
);
```

> The backend uses `SUPABASE_SERVICE_ROLE_KEY`, so keep it only on Render/backend (never in frontend).

## 2) Backend (Flask) Local Run

Location: `personal-profile/backend`

1. Copy env file:

```bash
cp .env.example .env
```

2. Fill required values in `.env`:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_LOGIN_USERNAME`
- `APP_LOGIN_PASSWORD`
- `FRONTEND_ORIGIN` (for local React use `http://localhost:5173`)
- `AFTER_LOGIN_URL` (where login redirects, default is `/main.html`)

3. Install and run:

```bash
pip install -r requirements.txt
python app.py
```

Backend base URL: `http://localhost:5000`

## 3) Frontend (React) Local Run

Location: `personal-profile/frontend/guestbook-app`

1. Copy env file:

```bash
cp .env.example .env
```

2. Set:
- `VITE_API_BASE_URL=http://localhost:5000`
- `VITE_AFTER_LOGIN_URL=/main.html` (or your hosted main page URL)

3. Install and run:

```bash
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints

- `POST /api/auth/login`
- `GET /api/entries`
- `POST /api/entries`
- `PUT /api/entries/:id`
- `DELETE /api/entries/:id`

All `/api/entries` routes require `Authorization: Bearer <token>` from login.

## Deployment

### Deploy Flask backend on Render

Root: `personal-profile/backend`

Use:
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`

Set Render environment variables from `personal-profile/backend/.env.example`.

Important production values:
- `FRONTEND_ORIGIN=https://<your-vercel-domain>`
- `AFTER_LOGIN_URL=https://<where-your-main-page-is-hosted>/main.html`

### Deploy React app on Vercel

Root: `personal-profile/frontend/guestbook-app`

Set Vercel environment variables:
- `VITE_API_BASE_URL=https://<your-render-backend-domain>`
- `VITE_AFTER_LOGIN_URL=https://<where-your-main-page-is-hosted>/main.html`

`vercel.json` is included for SPA route rewrites.

## Notes

- `main.html` includes an "Open Guestbook" link (`/guestbook`). Update this link to your actual Vercel guestbook URL if your main page is hosted elsewhere.
- Login success currently redirects to `AFTER_LOGIN_URL` returned by Flask.
