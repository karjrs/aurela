# Aurela

Next.js frontend + Express backend, both in TypeScript.

## Structure

- `frontend/` — Next.js (App Router, ESLint, Vitest, Playwright)
- `backend/` — Express + TypeScript (ESLint, Vitest, `tsx` for dev, `tsc` for build)

Each package has its own `pnpm-lock.yaml` and `node_modules` — this isn't a real pnpm workspace, just two independent packages orchestrated from the root via `pnpm --dir`.

## Modules

### `backend/`

- `src/app.ts` — Express app setup: security headers (`helmet`), the GraphQL endpoint (parses its own request body and handles its own CORS — see `src/graphql/yoga.ts`), and the `GET /api/health` endpoint. `crossOriginResourcePolicy` is explicitly relaxed to `cross-origin` in `helmet()`'s config: its default (`same-origin`) is enforced by the browser independently of CORS, and would otherwise block the frontend (a different origin) from reading responses even though CORS headers allow it.
- `src/index.ts` — entry point; starts the HTTP server on `PORT` (default `4000`).
- `src/app.test.ts` — `supertest`-based test hitting the Express app directly, without a running server.
- `src/graphql/schema.ts` — imports each resource module's default export (`{ query, mutation, types }`) and combines them into one executable schema, along with a bare `` `type Query type Mutation` `` anchor string: `typeDefs: [` `type Query type Mutation` `, ...users.types]`, `resolvers: { Query: { ...users.query }, Mutation: { ...users.mutation } }`. Resource folders never declare `type Query`/`type Mutation` themselves, only `extend` them — without that anchor, an `extend type Query { ... }` with no base declaration anywhere is invalid SDL. Adding a resource means adding it to the import list and to both spreads — spreading at the field level (not spreading a module's whole `{ Query, Mutation }` object) matters, since the latter would let one module silently overwrite another's fields instead of merging with them.
- `src/graphql/` is organized one subdirectory per GraphQL resource, split further into `query/`/`mutation/` subfolders by operation type. This is the reference layout for adding a new resource (e.g. `posts/`) — copy this shape:
  - `users/consts.ts` — the hardcoded mock data itself (no database yet).
  - `users/query/types.ts` — `extend type Query { user(id: ID!): User, users: [User!]! }`. Only field declarations for this resource's queries — never a bare `type Query`, and never anything unrelated to querying (that's what `users/types.ts` is for).
  - `users/query/index.ts` — the `Query` resolvers (`user`, `users`).
  - `users/query/index.test.ts` — `supertest`-based tests for the queries.
  - `users/mutation/types.ts` — `extend type Mutation { ... }`, mirroring `query/types.ts` but for writes.
  - `users/mutation/index.ts` — the `Mutation` resolvers (`createUser`, `updateUser`, `deleteUser`) that mutate the in-memory mock array.
  - `users/mutation/index.test.ts` — `supertest`-based tests for the mutations.
  - `users/types.ts` — the resource's *barrel*: declares the shared entity SDL (`type User`, `CreateUserInput`, `UpdateUserInput` — no `extend`, since the entity shape isn't specific to reading or writing), imports `types` from both `query/types.ts` and `mutation/types.ts`, and default-exports all three as one array: `export default [types, queryTypes, mutationTypes]`. This is the **only** place that assembles this resource's full SDL — `query/`/`mutation/` `index.ts` files only ever export resolvers, never re-export their own `types`.
  - `users/index.ts` — thin: imports `query` and `mutation` (resolvers) plus the default-exported `types` array from `users/types.ts`, and default-exports `{ query, mutation, types }` for `schema.ts` to register.
- `src/graphql/yoga.ts` — GraphQL Yoga instance, mounted at `/api/graphql`; handles its own body parsing and CORS.

### `frontend/`

- `src/app/layout.tsx` — root Next.js layout: Fraunces/Manrope fonts, metadata, and the `next-intl` message provider.
- `src/app/page.tsx` — landing page, composed from the section components in `src/components/landing/`.
- `src/app/page.test.tsx` — Testing Library unit test for the home page.
- `src/components/landing/` — landing page sections (`Hero`, `DayMoments`, `ClosingStatement`), each a client component reading its copy from `next-intl`.
- `src/i18n/request.ts` — `next-intl` request config; resolves the active locale's message catalog.
- `messages/en.json` — English message catalog for the landing page copy.

The backend is still an intentionally minimal skeleton (shared tooling, a health endpoint, and a GraphQL endpoint with mock data), while the frontend now has its first real page.

## Tech stack

### Backend

| Library | Purpose |
| --- | --- |
| `express` | HTTP server / routing |
| `helmet` | Security-related HTTP headers |
| `graphql` | GraphQL query language runtime (parser, executor) |
| `graphql-yoga` | GraphQL HTTP server, mounted in Express at `/api/graphql`; also handles body parsing and CORS for that endpoint |
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
