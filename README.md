# Aurela

Next.js frontend + Express backend, both in TypeScript.

## Structure

- [`frontend/`](frontend/README.md) — Next.js (App Router, Vitest, Playwright)
- [`backend/`](backend/README.md) — Express + TypeScript (Vitest, `tsx` for dev, `tsc` for build)

Each package has its own `pnpm-lock.yaml` and `node_modules` — this isn't a real pnpm workspace, just two independent packages orchestrated from the root via `pnpm --dir`. Since frontend can't import backend's TypeScript source across that boundary, the one deliberate bridge between them is `backend/schema.graphql` — a committed (not gitignored) SDL export of the backend schema that the frontend's own `graphql-codegen` reads as a plain file, with no live server or cross-package dependency involved. It has to be regenerated (`pnpm codegen` in `backend/`) and committed by hand whenever the backend schema changes. Validation is a second, smaller instance of the same boundary: `backend/src/graphql/users/mutation/schemas.ts` and `frontend/src/forms/users/schema.ts` each define their own `zod` schema for the same shape, kept in sync by hand — there's no mechanism enforcing they match, so a schema change on one side needs a matching edit on the other.

The backend persists its one resource (`users`) in Postgres via Drizzle ORM (`backend/src/db/`) — see "Docker" below for how the database is provisioned. The frontend's home page fetches and renders that data live via TanStack Query + `graphql-request`. See [`frontend/README.md`](frontend/README.md) and [`backend/README.md`](backend/README.md) for per-package modules and tech stack.

## Tech stack

### Root

| Library | Purpose |
| --- | --- |
| `concurrently` | Run frontend and backend dev servers side by side (`pnpm dev`) |
| `husky` | Manages the git hooks in `.husky/` |
| `lint-staged` | Runs Biome only on staged files for the pre-commit hook |
| `@biomejs/biome` | Linting and formatting for both packages — installed once at the root (see "Scripts (root)" below for why) |

## Getting started

```bash
pnpm install
pnpm --dir frontend install
pnpm --dir backend install
```

See [`frontend/README.md`](frontend/README.md) and [`backend/README.md`](backend/README.md) for per-package setup (e.g. the frontend's optional `.env.local`).

## Running

```bash
# frontend and backend together
pnpm dev

# frontend only (http://localhost:3000)
pnpm dev:frontend

# backend only (http://localhost:4000)
pnpm dev:backend
```

## Docker

```bash
# local dev, with hot-reload (bind-mounts your working tree into both containers)
pnpm docker:dev

# production images, built and run in the background
pnpm docker:prod
```

`docker-compose.yml` (dev) and `docker-compose.prod.yml` are separate, self-contained files rather than a base-plus-override pair — merging overrides would need to explicitly strip out the dev bind-mounts for prod, and an accidental bind-mount of your working tree onto a production server is exactly the kind of mistake worth avoiding structurally. Both `frontend/Dockerfile` and `backend/Dockerfile` are multi-stage (`dev`/`build`/`prod`); the frontend one is built with the **repo root** as context (not `frontend/`), because `frontend/codegen.ts` reads `backend/schema.graphql` as a plain SDL file across the package boundary.

`NEXT_PUBLIC_GRAPHQL_ENDPOINT` is baked into the frontend's browser bundle at `next build` time, not read at container runtime — for `docker:prod` it must be a publicly reachable backend URL (the address is queried by the user's browser, not the Next.js server) and is passed in as a build arg from the root `.env` (copy `.env.example` to `.env` and fill it in before running `docker:prod`). Changing it means rebuilding the frontend image, not just restarting the container.

Both compose files also run a `postgres` service on the shared `aurela-net` network, with the backend waiting on its healthcheck before starting (so the migrations the backend applies to itself at startup don't hit a database that isn't accepting connections yet). In `docker-compose.prod.yml`, its credentials come from the same root `.env` as `NEXT_PUBLIC_GRAPHQL_ENDPOINT` (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).

## Scripts (root)

| Script | Description |
| --- | --- |
| `pnpm dev` | Run frontend and backend dev servers concurrently |
| `pnpm dev:frontend` / `pnpm dev:backend` | Run a single dev server |
| `pnpm build:frontend` / `pnpm build:backend` | Production build for a single package |
| `pnpm lint:frontend` / `pnpm lint:backend` | Biome lint for a single package |
| `pnpm typecheck:frontend` / `pnpm typecheck:backend` / `pnpm typecheck` | Type-check with `tsc --noEmit`, per package or both |
| `pnpm test` / `pnpm test:frontend` / `pnpm test:backend` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright e2e tests (frontend) |
| `pnpm format` | Format the whole repo with Biome |
| `pnpm format:check` | Check formatting without writing changes (what CI would run) |
| `pnpm check` | Full local check: lint + typecheck + unit tests for both packages — the same thing the pre-push hook runs |
| `pnpm docker:dev` | Run both packages in Docker with hot-reload (see "Docker" below) |
| `pnpm docker:prod` | Build and run production images in the background |
| `pnpm release` / `pnpm release --dry-run` | Bump the version and update the changelog (see "Changelog" below) |

Each package also exposes its own `dev` / `build` / `typecheck` / `test` scripts (see [`frontend/README.md`](frontend/README.md) and [`backend/README.md`](backend/README.md)), runnable directly from its directory.

`format`, `format:check`, `lint:frontend`, and `lint:backend` are all root-only: `@biomejs/biome` is installed exactly once, at the root, never inside `frontend/` or `backend/`. It's a single self-contained binary whose framework-aware rules (React, Next.js) auto-detect from each directory's `package.json`, so one root install covers both packages. `biome.jsonc` at the repo root holds the shared formatter config and `recommended` lint rules; `frontend/biome.jsonc` / `backend/biome.jsonc` each just `"extends": "//"` to inherit it. `lint:frontend`/`lint:backend` run `biome lint ./frontend` / `./backend` straight from the root install.

Biome's Next.js-aware rules don't cover the full breadth of Next.js-specific lint checks (a handful of SEO/font-loading rules have no equivalent) — see `biome.jsonc`'s `a11y.noSvgWithoutTitle: "off"` for the one rule intentionally disabled (it only fires on `public/`'s framework-scaffolded SVGs, not hand-authored ones).

## Git hooks workflow

This repo has Husky git hooks configured:

- **pre-commit** — runs `lint-staged`, i.e. `biome check --write` (format + lint + import sorting in one pass) only on the files you're actually committing. Fast, doesn't slow down day-to-day commits.
- **pre-push** — runs `pnpm check` (lint + typecheck + unit tests for both packages). Playwright e2e tests are intentionally excluded — they're too slow for a local hook and are still run by CI after every push.

`pnpm check` can also be run manually at any time to check the repo state without waiting for a push. Hooks can be bypassed in exceptional cases (`git commit --no-verify`, `git push --no-verify`) — treat that as a last resort, not standard practice.

## CI

`.github/workflows/ci.yml` runs on every push and pull request: a `quality` job (repo-wide `pnpm format:check`, `pnpm lint:frontend`, `pnpm lint:backend` — the only job that needs the root install, since Biome lives there), build + unit tests for the backend, build + unit tests for the frontend, and Playwright e2e tests for the frontend (after the unit job passes). Lint stays in `quality` rather than the per-package `backend`/`frontend-unit` jobs, since running it there would mean installing the root `node_modules` a second time.

## Changelog

`pnpm release` bumps the version in the root `package.json` and writes a new entry below, based on [Conventional Commits](https://www.conventionalcommits.org/) since the last `vX.Y.Z` git tag (`feat` → minor, `fix`/`perf` → patch, `BREAKING CHANGE` → major; other commit types don't trigger a release). It refuses to run on a dirty working tree, and exits without changes if there's nothing releasable. `pnpm release --dry-run` previews the version bump and changelog entry without writing or committing anything. Versioning starts from tag `v0.1.0` (end of the initial config/setup phase) — see `scripts/release.mjs`.

<!-- changelog:start -->
_No releases yet — versioning starts from the first real feature/fix commit after this point._
<!-- changelog:end -->
