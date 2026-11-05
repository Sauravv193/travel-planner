# WanderGen

A travel planner that uses Google Gemini to generate itineraries. Spring Boot backend, React frontend, PostgreSQL database, Redis cache.

## What it does

- Generate day-by-day trip itineraries with AI — tell it your destination, dates, and preferences
- Chat with the AI to adjust plans ("make it cheaper", "add museums", "more outdoorsy")
- Upload trip photos and auto-generate travel journals
- Share trips through revocable public links, Twitter, Facebook, or export as print/download
- Dark/light theme — warm neutral light mode and midnight-indigo with cyan/lavender accents in dark mode

## Stack

**Backend:** Java 17, Spring Boot 3.1, PostgreSQL, Redis, JWT auth, Google Gemini API

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios

**Deployed on:** Render (backend) + Vercel (frontend)

## Project layout

```
travel-planner/
├── .github/workflows/       CI/CD pipelines
├── backend/        Spring Boot app
│   ├── src/main/java/...     controllers, services, models, config
│   ├── src/main/resources/   application.properties
│   └── src/test/             unit and integration tests
├── frontend/                 React app
│   └── src/
│       ├── components/       UI components (AI chat, itinerary, dashboard, journal)
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
| `PHOTO_STORAGE_PROVIDER` | `r2` in production after configuring R2; `local` for local development |
| `R2_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 S3 API token access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 S3 API token secret |
| `R2_BUCKET` | Private R2 bucket name |
| `R2_REGION` | `auto` for Cloudflare R2 |

Frontend vars (set in Vercel dashboard):

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

Optional: `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for Google sign-in, `SMTP_*` vars for email verification/password reset.

### Persistent photo storage

Render free web services have an ephemeral filesystem, so local photo files disappear on restarts, spin-downs, and redeploys. For durable production uploads, create a **private Cloudflare R2 Standard bucket**, create an S3 API token scoped to that bucket, and set the R2 variables above in Render. Set `PHOTO_STORAGE_PROVIDER=r2` and `R2_REGION=auto`. Do not enable public bucket access and do not commit any R2 credentials. Local development defaults to `PHOTO_STORAGE_PROVIDER=local`.

New uploads are stored in R2 once the provider is enabled. Existing photo rows that point to Render's old local filesystem are not automatically migrated; download any existing photos before redeploying if you need to preserve them.

## Running locally

```bash
# Prerequisites: Java 17+, Node 16+, PostgreSQL, Redis

# Backend
cd backend
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

- `POST /api/v1/auth/signup` and `POST /api/v1/auth/signin` — register/login
- `GET /api/v1/trips` and `POST /api/v1/trips` — list and create trips
- `POST /api/v1/itineraries/generate/{tripId}` — start asynchronous itinerary generation
- `PUT /api/v1/itineraries/regenerate/{tripId}` and `POST /api/v1/itineraries/adapt/{tripId}` — start asynchronous updates
- `GET /api/v1/jobs/{jobId}` — check an asynchronous job's status
- `POST /api/v1/photos/upload/{tripId}`, `GET /api/v1/photos/trip/{tripId}`, `GET /api/v1/photos/serve/{photoId}` — authenticated photo operations
- `POST /api/v1/journal/generate/{tripId}` — generate an AI journal from trip photos
- `POST /api/v1/trips/{tripId}/share` and `DELETE /api/v1/trips/{tripId}/share` — create/revoke a public share link
- `GET /api/v1/public/trips/{shareToken}` — read a shared trip without signing in
- `GET /api/health` — health check

## Tests

```bash
cd backend
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
