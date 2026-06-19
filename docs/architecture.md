# Architecture Overview — They Will Not Be Forgotten

## Overview

This project is a bilingual (Arabic / Hebrew) digital memorial for victims of violence in Arab society in Israel. It is structured as an npm workspace monorepo with a React frontend and a Node.js backend.

---

## Tech Stack

### Frontend (`/frontend`)
- **Framework:** React 18 with TypeScript
- **Build tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (RTL-aware)
- **Internationalisation:** i18next (Arabic primary, Hebrew secondary)
- **Map:** Leaflet / React-Leaflet
- **Testing:** Vitest + React Testing Library

### Backend (`/backend`)
- **Runtime:** Node.js 20 (LTS)
- **Framework:** Express with TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (production), SQLite (local dev)
- **Auth:** JWT-based admin authentication
- **Testing:** Jest + Supertest

### CI/CD
- **Pipeline:** GitHub Actions (`.github/workflows/ci.yml`)
- **Triggers:** push and pull_request to `main` and `develop`
- **Jobs:** lint, test, build-check

---

## Folder Structure

```
digital-memorial/
├── frontend/
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Shared UI components
│       ├── pages/          # Route-level page components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility helpers
│       ├── i18n/           # Translation files (ar, he)
│       └── types/          # Shared TypeScript types
├── backend/
│   ├── prisma/
│   │   └── migrations/     # Database migration files
│   └── src/
│       ├── routes/         # Express route handlers
│       ├── models/         # Prisma model wrappers
│       ├── middleware/     # Auth, error handling, validation
│       ├── services/       # Business logic layer
│       └── lib/            # Shared utilities (db client, etc.)
├── docs/                   # Project documentation
├── scripts/                # Seed scripts and utilities
└── .github/
    ├── workflows/          # CI/CD pipelines
    └── ISSUE_TEMPLATE/     # Structured issue forms
```

---

## Data Flow

1. A visitor loads the React SPA served from the `frontend` build.
2. The frontend calls the Express REST API at `/api/*`.
3. Express middleware validates requests; route handlers delegate to service functions.
4. Services query the database via the Prisma client.
5. Admin-only routes are protected by JWT middleware.

---

## Key Design Decisions

- **RTL-first:** all layout and i18n decisions default to Arabic (RTL); Hebrew is a secondary language layer.
- **No hardcoded UI text:** every string visible to users lives in `src/i18n/` translation files.
- **TypeScript everywhere:** no plain `.js` source files in either workspace.
- **Privacy by default:** contact details submitted through the victim-profile issue template are kept private and never stored in the public database.
