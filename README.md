# WanderGen

A travel planner that uses Google Gemini to generate itineraries. Spring Boot backend, React frontend, PostgreSQL database, Redis cache.

## What it does

- Generate day-by-day trip itineraries with AI — tell it your destination, dates, and preferences
- Chat with the AI to adjust plans ("make it cheaper", "add museums", "more outdoorsy")
- Upload trip photos and auto-generate travel journals
- View trip locations on a map (OpenStreetMap)
- Share trips via link, Twitter, Facebook, or export as print/download
- Dark/light theme — baby pink and white in light mode, deep navy with rose accents in dark mode

## Stack

**Backend:** Java 17, Spring Boot 3.1, PostgreSQL, Redis, JWT auth, Google Gemini API

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios

**Deployed on:** Render (backend) + Vercel (frontend)

## Project layout

```
travel-planner/
├── .github/workflows/       CI/CD pipelines
├── backend/WarderGen/        Spring Boot app
│   ├── src/main/java/...     controllers, services, models, config
│   ├── src/main/resources/   application.properties
│   └── src/test/             unit and integration tests
├── frontend/                 React app
│   └── src/
│       ├── components/       UI components (AI chat, itinerary, dashboard, journal, map)
│       ├── pages/            Home, Planner, Trip, Journal, Profile, SignIn, SignUp
│       ├── hooks/            useAuth, useItinerary, useJournal
│       ├── services/         API client
│       ├── styles/           Tailwind CSS
│       └── utils/            helpers, export functions
├── Dockerfile                backend container image
├── render.yaml               Render deployment config
└── vercel.json               Vercel deployment config
```


## Environment variables

Backend vars (set in Render dashboard):

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `JWT_SECRET` | Run `openssl rand -base64 64` |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| `CORS_ORIGINS` | Comma-separated list of your frontend URLs |
| `REDIS_HOST` | From Redis Cloud dashboard |
| `REDIS_PORT` | Usually 6379 |
| `REDIS_PASSWORD` | From Redis Cloud dashboard |

Frontend vars (set in Vercel dashboard):

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

Optional: `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for Google sign-in, `SMTP_*` vars for email verification/password reset.

## Running locally

```bash
# Prerequisites: Java 17+, Node 16+, PostgreSQL, Redis

# Backend
cd backend/WarderGen
cp .env.example .env     # edit with your database creds and API key
./mvnw spring-boot:run
# Runs on http://localhost:8080

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
# Runs on http://localhost:5173
```

## Deployment

**Render (backend):** Push to GitHub — `render.yaml` is picked up automatically. Then set the env vars listed above in the Render dashboard.

**Vercel (frontend):** Import the repo, set root directory to `frontend`, add `VITE_API_URL`, deploy.

## API

When running, Swagger UI is at `http://localhost:8080/swagger-ui/index.html`.

Main endpoints:
- `POST /api/auth/signup` and `/api/auth/signin` — register/login
- `GET/POST /api/trips` — list and create trips
- `POST /api/itineraries/generate/{tripId}` — generate an AI itinerary
- `POST /api/itineraries/adapt/{tripId}` — modify an existing itinerary
- `POST /api/photos/upload/{tripId}` — upload photos
- `POST /api/journal/generate/{tripId}` — generate AI journal from photos
- `GET /api/health` — health check

## Tests

```bash
cd backend/WarderGen
./mvnw test
```

## Deployment checklist

Before pushing:

- [ ] `.env.example` files are committed, actual `.env` files are gitignored
- [ ] `JWT_SECRET`, `GEMINI_API_KEY`, `DATABASE_URL` set in Render dashboard
- [ ] `CORS_ORIGINS` includes your Vercel URL
- [ ] Redis Cloud is set up and `REDIS_HOST/PORT/PASSWORD` configured
- [ ] `VITE_API_URL` set in Vercel dashboard
- [ ] No hardcoded API keys or passwords in committed code
