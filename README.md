# Personal Website + Guestbook

This repository contains:

- Main profile page + static frontend assets in `personal-profile/frontend`
- Guestbook React app in `personal-profile/frontend/guestbook-app`
- NestJS API backend in `personal-profile/backend`
- Supabase for guestbook data storage

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | NestJS |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

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

Keep `SUPABASE_SERVICE_ROLE_KEY` in backend environment variables only.

## 2) Backend (NestJS) Local Run

Location: `personal-profile/backend`

1. Install dependencies:

```bash
npm install
```

2. Copy env file:

```bash
cp .env.example .env
```

3. Fill required values in `.env`:

- `PORT` (default `3000`)
- `FLASK_SECRET_KEY` (used by legacy naming in code; keep a strong random string)
- `APP_LOGIN_USERNAME`
- `APP_LOGIN_PASSWORD`
- `TOKEN_MAX_AGE_SECONDS`
- `FRONTEND_ORIGIN` (for local React use `http://localhost:5173`)
- `AFTER_LOGIN_URL` (for example `/main.html`)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_GUESTBOOK_TABLE` (for example `guestbook_entries`)

4. Run development server:

```bash
npm run dev
```

Backend base URL: `http://localhost:3000`

## 3) Frontend (React) Local Run

Location: `personal-profile/frontend/guestbook-app`

1. Install dependencies:

```bash
npm install
```

2. Copy env file:

```bash
cp .env.example .env
```

3. Set frontend variables:

- `VITE_API_BASE_URL=http://localhost:3000`
- `VITE_AFTER_LOGIN_URL=/main.html` (or your hosted main page URL)

4. Run development server:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints

- `POST /api/auth/login`
- `GET /api/entries`
- `POST /api/entries`
- `PUT /api/entries/:id`
- `DELETE /api/entries/:id`
- `GET /api/health`

All `/api/entries` routes require `Authorization: Bearer <token>` from login.

## Deployment (Vercel)

### Backend

Project root: `personal-profile/backend`

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Set environment variables from `personal-profile/backend/.env.example`.

### Guestbook Frontend

Project root: `personal-profile/frontend/guestbook-app`

Set environment variables:

- `VITE_API_BASE_URL=https://<your-backend-domain>`
- `VITE_AFTER_LOGIN_URL=https://<where-your-main-page-is-hosted>/main.html`

`vercel.json` is included for SPA route rewrites.

## Notes

- If your static profile page is hosted separately, update guestbook links accordingly.
- Login returns a token and redirect URL.
