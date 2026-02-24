# WENSI'S Personal Website

A personal website with an emo/scenecore aesthetic (similar to friendster and/or myspace) featuring a public guestbook, profile page, clickable image gallery, and music playlist.

This repository contains:

- **WENSI Guestbook React App** (Landing Page) - `personal-profile/frontend/guestbook-app`
- **Profile Page** - `personal-profile/frontend/guestbook-app/src/Home.jsx`
- **NestJS API Backend** - `personal-profile/backend`
- **Supabase Database** - For guestbook message storage

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + React Router |
| Backend | NestJS + Express |
| Database | Supabase (PostgreSQL) |
| Styling | Custom CSS (emo/scenecore theme) |
| Deployment | Vercel |

## Features

- 🎨 Custom emo/scenecore aesthetic with animated background
- 💬 Public guestbook (no login required to view or post)
- 🖼️ Gallery page with Pinterest-style layout
- 🔎 Gallery images open full-size when clicked
- 📱 Responsive design
- 🎵 Randomized multi-track music player (changes on each site open)
- ▶️ Clickable song cards to play specific tracks
- ⚡ Fast loading with Vite

## 1) Supabase Setup

Create a table in Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.guestbook (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	message text not null,
	created_at timestamptz not null default now()
);
```

**Important:** The backend uses the `service_role` key (or `anon` key) to bypass Row Level Security. Keep credentials secure and only in backend environment variables.

## 2) Backend (NestJS) Local Development

Location: `personal-profile/backend`

1. Install dependencies:

```bash
cd personal-profile/backend
npm install
```

2. Copy env file and configure:

```bash
cp .env.example .env
```

3. Configure `.env` with your values:

```env
PORT=3000
JWT_SECRET=your-secret-key-here
APP_LOGIN_USERNAME=your-admin-username
APP_LOGIN_PASSWORD=your-admin-password
TOKEN_MAX_AGE_SECONDS=86400
FRONTEND_ORIGIN=http://localhost:5173
AFTER_LOGIN_URL=/home
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-or-anon-key
SUPABASE_GUESTBOOK_TABLE=guestbook
```

4. Run development server:

```bash
npm run dev
```

Backend will run on: `http://localhost:3000`

The API endpoints are prefixed with `/api/` (e.g., `/api/entries`)

## 3) Frontend (React) Local Development

Location: `personal-profile/frontend/guestbook-app`

1. Install dependencies:

```bash
cd personal-profile/frontend/guestbook-app
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Configure environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AFTER_LOGIN_URL=/home
```

4. Run development server:

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Routes

- `/` - WENSI guestbook (landing page)
- `/home` - Main profile page
- `/gallery` - Image gallery (masonry layout)

## API Endpoints

### Public Endpoints (No Authentication Required)

- `GET /` - API info and status
- `GET /api/health` - Health check
- `GET /api/entries` - Get all guestbook entries
- `POST /api/entries` - Create a new guestbook entry
  - Body: `{ "name": "string", "message": "string" }`

### Admin Endpoints (Authentication Required)

- `POST /api/auth/login` - Admin login
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: JWT token

**Note:** The guestbook is fully public - no authentication needed to view or post messages.

## Deployment (Vercel)

### Backend Deployment

1. **Deploy via Vercel Dashboard:**
   - Import repository from GitHub
   - Set root directory: `personal-profile/backend`
   - Framework Preset: Other
   - Add all environment variables from your `.env` file
   - Important: Update `FRONTEND_ORIGIN` to your frontend Vercel URL

2. **Deploy via CLI:**
   ```bash
   cd personal-profile/backend
   vercel --prod
   ```

The backend uses serverless functions via `api/index.ts`.

### Frontend Deployment

1. **Deploy via Vercel Dashboard:**
   - Import repository from GitHub
   - Set root directory: `personal-profile/frontend/guestbook-app`
   - Framework Preset: Vite
   - Add environment variables:
     - `VITE_API_BASE_URL` = Your backend Vercel URL (e.g., `https://your-backend.vercel.app`)
     - `VITE_AFTER_LOGIN_URL` = `/home`

2. **Deploy via CLI:**
   ```bash
   cd personal-profile/frontend/guestbook-app
   vercel --prod
   ```

### Post-Deployment

After deploying both:

1. **Update Backend Environment:**
   - Set `FRONTEND_ORIGIN` to your deployed frontend URL
   - Redeploy backend

2. **Update Frontend Environment:**
   - Set `VITE_API_BASE_URL` to your deployed backend URL
   - Redeploy frontend

This ensures CORS is properly configured for production.

## Project Structure

```
personal-profile/
├── backend/                 # NestJS API
│   ├── api/                # Vercel serverless function entry
│   │   └── index.ts
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── auth/           # Authentication module (admin only)
│   │   ├── entries/        # Guestbook entries module
│   │   └── common/         # Shared services (Supabase, guards)
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
│
└── frontend/
    └── guestbook-app/      # React + Vite app
      ├── public/         # Static assets (bg.gif, separate.png, gallery/, music, etc.)
        ├── src/
        │   ├── App.jsx     # Main app with routing
        │   ├── Home.jsx    # Profile page
        │   ├── api.js      # API client
        │   ├── styles.css  # Guestbook styles
        │   └── Home.css    # Profile page styles
        ├── .env.example
        ├── package.json
        └── vercel.json
```

## Assets

The project includes custom-generated assets:
- `bg.gif` - Animated background with gradient effect
- `separate.png` - Decorative line separator
- `emo.jpg` - Profile image
- `internetfame.png` - Cover image for Faster N Harder
- `on dat b.jpg` - Cover image for ON DAT BXTCH [Instrumental]
- `dance til we die.jpg` - Cover image for DANCE! Till We Die
- `Sassy Scene - Faster n Harder (Instrumental).mp3` - Music track
- `Lumi Athena - ON DAT BXTCH [INSTRUMENTAL].mp3` - Music track
- `DANCE! Till We Die.mp3` - Music track
- `gallery/` - Gallery images shown on `/gallery`

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure:
- Backend `FRONTEND_ORIGIN` matches your frontend URL exactly
- No trailing slashes in URLs
- Both servers are running (for local dev)

### Comments Not Loading
- Check that backend is running and accessible
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for errors
- Verify Supabase credentials are correct

### 404 on Deployment
- Ensure root directories are set correctly in Vercel
- Frontend: `personal-profile/frontend/guestbook-app`
- Backend: `personal-profile/backend`

## License

MIT

## Notes

- The guestbook is fully public - anyone can view and post messages without authentication
- Authentication system exists for potential admin features but is not used for guestbook functionality
- All API endpoints are under the `/api` prefix except the root endpoint `/`
