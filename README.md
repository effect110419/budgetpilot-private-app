# BudgetPilot

BudgetPilot is a personal finance app for tracking income and expenses across web, iOS, and Android.

## Vision

Help people understand where money goes, plan budgets, and build sustainable financial habits.

## Core Platforms

- Mobile app (iOS/Android): fast daily expense logging.
- Web app: full analytics and account management.
- Admin web panel: product metrics, moderation, and support workflows.

## Initial Feature Set

- Income and expense transactions
- Categories and tags
- Monthly budgets per category
- Dashboard with trends and summaries
- Notifications and reminders

## Repository Structure

- `docs/PRD.md` - product requirements
- `docs/ROADMAP.md` - phased delivery plan
- `docs/MVP_PLAN.md` - 30-day execution plan
- `docs/MONETIZATION.md` - revenue model
- `docs/PLATFORM_AUTH_DB_HOSTING.md` - architecture (auth, DB, hosting)
- `docs/SUPABASE_SETUP_RU.md` - **пошаговая настройка облака и входа (RU)**
- `supabase/migrations/` - SQL для PostgreSQL (Supabase)
- `web/` - working web MVP (React + TypeScript + Vite)

## Status

Web MVP is implemented and ready for local testing.

## Run Web MVP

1. Install Node.js LTS.
2. Open terminal:
   - `cd web`
   - `npm install`
   - (Optional cloud sync) Copy `web/.env.example` to `web/.env.local` and add Supabase URL + anon key — see **`docs/SUPABASE_SETUP_RU.md`**.
   - `npm run dev`
   - `npm run lint` — check TypeScript/React code style (optional before commit).
   - `npm run build` — production build.
3. Open the local URL shown in terminal (usually `http://localhost:5173`).

Without `.env.local`, the app uses **local storage only** (same as before). With Supabase keys, you get **sign-in** and **cloud sync** for transactions and budgets.
