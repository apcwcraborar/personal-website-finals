# NestJS Guestbook API

Backend API for the personal website guestbook built with NestJS, Supabase, and TypeScript.

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Main application module
├── app.controller.ts       # Health check endpoint
├── auth/                   # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   └── auth.service.ts
├── entries/                # Guestbook entries module
│   ├── entries.module.ts
│   ├── entries.controller.ts
│   └── entries.service.ts
└── common/                 # Shared services and guards
    ├── services/
    │   ├── token.service.ts
    │   └── supabase.service.ts
    └── guards/
        └── auth.guard.ts
```

## Setup

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### Production

```bash
npm run build
npm run prod
```

## API Endpoints

### Authentication

**POST** `/api/auth/login`

Login with username and password.

Request:
```json
{
  "username": "admin",
  "password": "your-password"
}
```

Response:
```json
{
  "token": "...",
  "redirectUrl": "/main.html"
}
```

### Guestbook Entries

**GET** `/api/entries`

Retrieve all guestbook entries (requires authentication).

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
[
  {
    "id": "...",
    "name": "John Doe",
    "message": "Great website!",
    "created_at": "2024-02-23T10:00:00Z"
  }
]
```

**POST** `/api/entries`

Create a new guestbook entry (requires authentication).

Headers:
```
Authorization: Bearer <token>
```

Request:
```json
{
  "name": "John Doe",
  "message": "Great website!"
}
```

Response:
```json
{
  "id": "...",
  "name": "John Doe",
  "message": "Great website!",
  "created_at": "2024-02-23T10:00:00Z"
}
```

**GET** `/api/health`

Health check endpoint (no authentication required).

Response:
```json
{
  "status": "ok",
  "time": "2024-02-23T10:00:00.000Z"
}
```

## Environment Variables

```env
# Server
PORT=3000

# Authentication
FLASK_SECRET_KEY=your-secret-key
APP_LOGIN_USERNAME=admin
APP_LOGIN_PASSWORD=your-password
TOKEN_MAX_AGE_SECONDS=86400

# Frontend
FRONTEND_ORIGIN=http://localhost:5173
AFTER_LOGIN_URL=/main.html

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-publishable-key
SUPABASE_GUESTBOOK_TABLE=guestbook
```

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Create a Vercel project**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `personal-profile/backend` directory as the root

3. **Add environment variables**
   - In Vercel project settings, add all variables from `.env.example`
   - Make sure to use your actual Supabase credentials

4. **Deploy**
   - Vercel will automatically deploy on push to main branch

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prod` - Build and start production server
- `npm run format` - Format code with Prettier

## Technologies

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Supabase** - PostgreSQL database and auth
- **Express** - HTTP server (used by NestJS)
