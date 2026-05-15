# They Will Not Be Forgotten — לא יישכחו — لن يُنسَوا

> A digital memorial platform for victims of violence in Arab society in Israel.  
> Turning statistics into human stories.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Reference](#api-reference)
- [Branch Strategy](#branch-strategy)
- [Contributing](#contributing)
- [Team](#team)

---

## About the Project

Every year, dozens of people are killed within Arab society in Israel. They each have a name, a family, a story — yet they are too often reduced to a number in a statistic.

**They Will Not Be Forgotten** is a digital memorial that gives each victim a dedicated page: a biography, a photo, testimonials from family and friends, and a place on a map. The site also features a heat map showing which cities have the highest violence rates, and an "On This Day" popup that surfaces victims who died on this calendar date in previous years.

The goal is emotional impact, collective memory, and historical documentation.

---

## Features

- **Individual victim profile** — biography, photo, profession, city, family status, date of birth/death
- **Family & friend testimonials** — submitted by the public, reviewed before publication
- **Interactive map** — city markers with heat layer showing violence density
- **City drill-down** — click any city to see its victims, stories, and statistics
- **"On This Day" popup** — appears on load, highlights victims who died on today's date
- **Search & filter board** — filter by name, city, year, type of violence
- **Video support** — attach video testimonials or news clips to profiles
- **Progress bar** — tracks how many victims have been documented vs. the known total
- **Admin panel** — secure dashboard to add, edit, and moderate all content
- **Multilingual** — Arabic, Hebrew, and English (i18n throughout)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Map | Leaflet.js + React-Leaflet + OpenStreetMap |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (JWT — admin only) |
| Media | Cloudinary (photos + videos) |
| Frontend hosting | Vercel |
| Backend hosting | Railway |
| CI/CD | GitHub Actions |
| Testing | Vitest (frontend) + Supertest (backend) |

---

## Project Structure

```
digital-memorial/
├── frontend/                  # React app (Vite + TypeScript)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level pages
│   │   │   ├── Home.tsx       # Homepage with "On This Day" popup
│   │   │   ├── VictimPage.tsx # Individual victim profile
│   │   │   ├── MapPage.tsx    # Interactive map
│   │   │   └── SearchPage.tsx # Search & filter board
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # API client, date utils
│   │   ├── i18n/              # Translations: ar / he / en
│   │   └── types/             # Shared TypeScript interfaces
│   └── tests/
│
├── backend/                   # Express REST API
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── models/            # Prisma-generated types
│   │   ├── middleware/        # Auth, validation, file upload
│   │   ├── services/          # Business logic
│   │   └── lib/               # DB client, Cloudinary, mailer
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── tests/
│
├── docs/                      # Architecture diagrams, decisions
├── scripts/                   # Seed data, migration helpers
└── .github/
    ├── workflows/             # CI/CD pipelines
    ├── PULL_REQUEST_TEMPLATE.md
    └── ISSUE_TEMPLATE/
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/org/digital-memorial.git
cd digital-memorial
```

### 2. Install dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 3. Set up environment variables

Copy the example files and fill in your values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

See [Environment Variables](#environment-variables) for the full list.

### 4. Set up the database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed          # optional — loads 50 sample profiles
```

### 5. Run locally

```bash
# In one terminal — backend
cd backend && npm run dev    # runs on http://localhost:3001

# In another terminal — frontend
cd frontend && npm run dev   # runs on http://localhost:5173
```

---

## Environment Variables

### `backend/.env`

```env
DATABASE_URL=postgresql://...          # Supabase connection string
JWT_SECRET=your-64-char-secret
CLOUDINARY_URL=cloudinary://key:secret@cloud-name
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3001
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Never commit `.env` files.** They are listed in `.gitignore`. Production secrets are stored in Vercel and Railway environment settings only.

---

## Database

The schema lives in `backend/prisma/schema.prisma`. The two main tables are:

**`victims`** — one row per person: name (ar/he/en), age, city, coordinates, profession, date of death, type of violence, bio (ar/he/en), photo URL, video URL, publication status.

**`testimonials`** — linked to a victim: author name, relation (brother/friend/colleague), content (ar/he/en), verified flag.

### Useful Prisma commands

```bash
npx prisma migrate dev        # apply pending migrations in development
npx prisma migrate deploy     # apply migrations in production
npx prisma studio             # open visual DB browser at localhost:5555
npx prisma generate           # regenerate the TypeScript client after schema changes
```

---

## API Reference

All endpoints are prefixed with `/api`. Public endpoints require no authentication. Admin endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/victims` | List victims — supports `?search=`, `?city=`, `?year=`, `?type=`, `?page=` | No |
| GET | `/victims/:id` | Full victim profile including testimonials | No |
| GET | `/victims/map` | GeoJSON for map markers and heat layer | No |
| GET | `/victims/on-this-day` | Victims who died on today's calendar date | No |
| GET | `/stats/cities` | Victim count and rate per city | No |
| POST | `/victims/:id/testimonials` | Submit a testimonial (enters moderation queue) | No |
| POST | `/admin/victims` | Create a new victim profile | Admin |
| PUT | `/admin/victims/:id` | Update a victim profile | Admin |
| DELETE | `/admin/victims/:id` | Archive or delete a profile | Admin |
| POST | `/admin/upload` | Upload photo/video to Cloudinary | Admin |
| PATCH | `/admin/testimonials/:id` | Approve or reject a testimonial | Admin |

---

## Branch Strategy

| Branch | Purpose | Who writes? |
|---|---|---|
| `main` | Live production site | Senior Developer only (via PR from `develop`) |
| `develop` | Integration — all Junior work merges here first | Senior (merges reviewed PRs) |
| `feature/*` | New feature: `feature/victim-page` | Junior 1 & Junior 2 |
| `fix/*` | Bug fix: `fix/map-popup-crash` | Any team member |
| `chore/*` | Maintenance: `chore/update-deps` | Any team member |

**Rules:**
- `main` and `develop` are protected — no direct pushes, ever.
- Every PR must reference a GitHub Issue and include a description of what was changed and how to test it.
- No merge without Senior approval + passing CI (tests + lint).
- Keep PRs small — aim for under 300 lines changed.

---

## Contributing

1. Check the [project board](https://github.com/org/digital-memorial/projects) for open tasks.
2. Open or pick up a GitHub Issue and assign it to yourself.
3. Create a branch from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```
4. Make your changes, write tests, and commit using [Conventional Commits](https://www.conventionalcommits.org):
   ```bash
   git commit -m "feat: add countdown timer to victim profile"
   git commit -m "fix: map markers not rendering on mobile"
   ```
5. Push and open a Pull Request against `develop`.
6. Request a review from a teammate. Address all feedback before the Senior merges.

---

## Team

| Role | Responsibilities |
|---|---|
| **Senior Developer** | Architecture, DevOps, CI/CD, code review, sprint planning, deployment |
| **Junior Developer 1** | Frontend — React UI, victim pages, map, search board, components |
| **Junior Developer 2** | Backend — REST API, database, Cloudinary integration, admin panel |

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

*"Each number was a person. Each person had a story. This project exists to tell it."*
