# Aurela

Next.js frontend + Express backend, both in TypeScript.

## Structure

- `frontend/` — Next.js (App Router, ESLint, Vitest, Playwright)
- `backend/` — Express + TypeScript (ESLint, Vitest, `tsx` for dev, `tsc` for build)

Each package has its own `pnpm-lock.yaml` and `node_modules` — this isn't a real pnpm workspace, just two independent packages orchestrated from the root via `pnpm --dir`.

## Modules

### `backend/`

- `src/app.ts` — Express app setup: security headers (`helmet`), CORS (`cors`), JSON body parsing, structured request logging (`pino-http`), and the `GET /api/health` endpoint.
- `src/index.ts` — entry point; starts the HTTP server on `PORT` (default `4000`).
- `src/app.test.ts` — `supertest`-based test hitting the Express app directly, without a running server.

### `frontend/`

- `src/app/layout.tsx` — root Next.js layout: Fraunces/Manrope fonts, metadata, and the `next-intl` message provider.
- `src/app/page.tsx` — landing page, composed from the section components in `src/components/landing/`.
- `src/app/page.test.tsx` — Testing Library unit test for the home page.
- `src/components/landing/` — landing page sections (`Hero`, `DayMoments`, `ClosingStatement`), each a client component reading its copy from `next-intl`.
- `src/i18n/request.ts` — `next-intl` request config; resolves the active locale's message catalog.
- `messages/en.json` — English message catalog for the landing page copy.

The backend is still an intentionally minimal skeleton (just the shared tooling and a health endpoint), while the frontend now has its first real page.

## Tech stack

### Backend

| Library | Purpose |
| --- | --- |
| `express` | HTTP server / routing |
| `helmet` | Security-related HTTP headers |
| `cors` | CORS handling |
| `pino` / `pino-http` | Structured JSON logging |
| `zod` | Runtime schema validation |
| `tsx` | Run TypeScript directly in dev (`pnpm dev`) |
| `typescript` / `typescript-eslint` | Type-checking and TS-aware linting |
| `eslint` / `@eslint/js` | Linting |
| `vitest` / `supertest` | Unit and HTTP-level testing |

### Frontend

| Library | Purpose |
| --- | --- |
| `next` | React framework (App Router) |
| `react` / `react-dom` | UI rendering |
| `react-hook-form` | Form state and validation |
| `zod` | Runtime schema validation (shared pattern with the backend) |
| `next-intl` | Internationalization (message catalogs, translations) |
| `tailwindcss` / `@tailwindcss/postcss` | Utility-first styling |
| `typescript` | Type-checking |
| `eslint` / `eslint-config-next` | Linting |
| `vitest` / `@testing-library/*` / `jsdom` | Unit and component testing |
| `@playwright/test` | End-to-end testing |

### Root

| Library | Purpose |
| --- | --- |
| `concurrently` | Run frontend and backend dev servers side by side (`pnpm dev`) |
| `husky` | Manages the git hooks in `.husky/` |
| `lint-staged` | Runs ESLint only on staged files for the pre-commit hook |

## Getting started

```bash
pnpm install
pnpm --dir frontend install
pnpm --dir backend install
```

## Running

```bash
# frontend and backend together
pnpm dev

# frontend only (http://localhost:3000)
pnpm dev:frontend

# backend only (http://localhost:4000)
pnpm dev:backend
```

## Scripts (root)

| Script | Description |
| --- | --- |
| `pnpm dev` | Run frontend and backend dev servers concurrently |
| `pnpm dev:frontend` / `pnpm dev:backend` | Run a single dev server |
| `pnpm build:frontend` / `pnpm build:backend` | Production build for a single package |
| `pnpm lint:frontend` / `pnpm lint:backend` | ESLint for a single package |
| `pnpm typecheck:frontend` / `pnpm typecheck:backend` / `pnpm typecheck` | Type-check with `tsc --noEmit`, per package or both |
| `pnpm test` / `pnpm test:frontend` / `pnpm test:backend` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright e2e tests (frontend) |
| `pnpm check` | Full local check: lint + typecheck + unit tests for both packages — the same thing the pre-push hook runs |

Each package also exposes its own `dev` / `build` / `lint` / `typecheck` / `test` scripts, runnable directly from its directory.

## Git hooks workflow

This repo has Husky git hooks configured:

- **pre-commit** — runs `lint-staged`, i.e. ESLint (with `--fix`) only on the files you're actually committing. Fast, doesn't slow down day-to-day commits.
- **pre-push** — runs `pnpm check` (lint + typecheck + unit tests for both packages). Playwright e2e tests are intentionally excluded — they're too slow for a local hook and are still run by CI after every push.

`pnpm check` can also be run manually at any time to check the repo state without waiting for a push. Hooks can be bypassed in exceptional cases (`git commit --no-verify`, `git push --no-verify`) — treat that as a last resort, not standard practice.

## CI

`.github/workflows/ci.yml` runs on every push and pull request: lint + build + unit tests for the backend, lint + build + unit tests for the frontend, and Playwright e2e tests for the frontend (after the unit job passes).
