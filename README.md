# Aurela

Next.js frontend + Express backend, both in TypeScript.

## Structure

- `frontend/` — Next.js (App Router, ESLint, Vitest, Playwright)
- `backend/` — Express + TypeScript (ESLint, Vitest, `tsx` for dev, `tsc` for build)

Each package has its own `pnpm-lock.yaml` and `node_modules` — this isn't a real pnpm workspace, just two independent packages orchestrated from the root via `pnpm --dir`. Since frontend can't import backend's TypeScript source across that boundary, the one deliberate bridge between them is `backend/schema.graphql` — a committed (not gitignored) SDL export of the backend schema that the frontend's own `graphql-codegen` reads as a plain file, with no live server or cross-package dependency involved. It has to be regenerated (`pnpm codegen` in `backend/`) and committed by hand whenever the backend schema changes.

## Modules

### `backend/`

- `src/app.ts` — Express app setup: security headers (`helmet`), the GraphQL endpoint (parses its own request body and handles its own CORS — see `src/graphql/yoga.ts`), and the `GET /api/health` endpoint. `crossOriginResourcePolicy` is explicitly relaxed to `cross-origin` in `helmet()`'s config: its default (`same-origin`) is enforced by the browser independently of CORS, and would otherwise block the frontend (a different origin) from reading responses even though CORS headers allow it.
- `src/index.ts` — entry point; starts the HTTP server on `PORT` (default `4000`).
- `src/app.test.ts` — `supertest`-based test hitting the Express app directly, without a running server.
- `src/graphql/schema.ts` — imports each resource module's default export (`{ query, mutation, types }`) and combines them into one executable schema, along with a bare `` `type Query type Mutation` `` anchor string: `typeDefs: [` `type Query type Mutation` `, ...users.types]`, `resolvers: { Query: { ...users.query }, Mutation: { ...users.mutation } }`. Resource folders never declare `type Query`/`type Mutation` themselves, only `extend` them — without that anchor, an `extend type Query { ... }` with no base declaration anywhere is invalid SDL. Adding a resource means adding it to the import list and to both spreads — spreading at the field level (not spreading a module's whole `{ Query, Mutation }` object) matters, since the latter would let one module silently overwrite another's fields instead of merging with them.
- `src/graphql/` is organized one subdirectory per GraphQL resource, split further into `query/`/`mutation/` subfolders by operation type. This is the reference layout for adding a new resource (e.g. `posts/`) — copy this shape:
  - `users/consts.ts` — the hardcoded mock data itself (no database yet).
  - `users/query/types.ts` — `extend type Query { user(id: ID!): User, users: [User!]! }`. Only field declarations for this resource's queries — never a bare `type Query`, and never anything unrelated to querying (that's what `users/types.ts` is for).
  - `users/query/index.ts` — the `Query` resolvers (`user`, `users`), typed against the generated `QueryResolvers` (see `src/graphql/types.ts` below) instead of hand-written `args` types.
  - `users/query/index.test.ts` — `supertest`-based tests for the queries.
  - `users/mutation/types.ts` — `extend type Mutation { ... }`, mirroring `query/types.ts` but for writes.
  - `users/mutation/index.ts` — the `Mutation` resolvers (`createUser`, `updateUser`, `deleteUser`) that mutate the in-memory mock array, typed against the generated `MutationResolvers`.
  - `users/mutation/index.test.ts` — `supertest`-based tests for the mutations.
  - `users/types.ts` — the resource's *barrel*: declares the shared entity SDL (`type User`, `CreateUserInput`, `UpdateUserInput` — no `extend`, since the entity shape isn't specific to reading or writing), imports `types` from both `query/types.ts` and `mutation/types.ts`, and default-exports all three as one array: `export default [types, queryTypes, mutationTypes]`. This is the **only** place that assembles this resource's full SDL — `query/`/`mutation/` `index.ts` files only ever export resolvers, never re-export their own `types`.
  - `users/index.ts` — thin: imports `query` and `mutation` (resolvers) plus the default-exported `types` array from `users/types.ts`, and default-exports `{ query, mutation, types }` for `schema.ts` to register.
- `src/graphql/types.ts` — **generated, not hand-written.** `QueryResolvers`/`MutationResolvers` types (and per-field arg types) produced by `graphql-codegen` from `codegen.ts` (see below), so resolver code doesn't hand-write `args: { ... }` types that could silently drift from the SDL. Gitignored — not a source of truth, just derived output — and regenerated automatically before `dev`/`build`/`typecheck`/`test` via `pre*` pnpm script hooks. Run `pnpm codegen` manually (or `pnpm codegen:watch`) after editing any resource's `types.ts` if you want fresh types without running one of those.
- `src/graphql/yoga.ts` — GraphQL Yoga instance, mounted at `/api/graphql`; handles its own body parsing and CORS.
- `codegen.ts` — `graphql-codegen` config, pointed directly at `src/graphql/schema.ts`'s `schema` export, generating two outputs from that one loaded schema: `src/graphql/types.ts` (resolver types, gitignored, see above) and `schema.graphql` (plain SDL via the `schema-ast` plugin, **committed** — see "Structure" above for why).

### `frontend/`

- `codegen.ts` — `graphql-codegen` config for the frontend. Schema pointer is `../backend/schema.graphql` (a plain SDL file, not backend's TypeScript), so unlike the backend's own codegen this doesn't need `NODE_OPTIONS='--import tsx/esm'` — `graphql-file-loader` just reads text, nothing to execute. Three plugins: `typescript` + `typescript-operations` (types) and `typed-document-node` (runtime `DocumentNode` constants, e.g. `GetUsersDocument`, that `graphql-request` sends over the wire — no hand-written query strings needed at the call site).
- `src/graphql/*.graphql` — hand-written query/mutation documents, e.g. `getUsers.graphql`. Each one's selected fields determine the shape of its generated type — this is a different kind of type than the backend's resolver types (see "Structure" above), not a duplicate of them.
- `src/graphql/types.ts` — **generated, not hand-written.** `GetUsersQuery`/`GetUsersQueryVariables` (+ the `GetUsersDocument` runtime constant), one set per document in `src/graphql/*.graphql`, produced by the same `graphql-codegen` machinery as the backend. Gitignored, regenerated automatically via `pre*` pnpm script hooks before `dev`/`build`/`typecheck`/`test`.
- `src/graphql/client.ts` — a single `graphql-request` `GraphQLClient` instance, pointed at `NEXT_PUBLIC_GRAPHQL_ENDPOINT` (falls back to `http://localhost:4000/api/graphql` if unset — see `.env.example` below).
- `.env.example` — documents `NEXT_PUBLIC_GRAPHQL_ENDPOINT`; copy to `.env.local` (gitignored) to override it. Not required to boot the app because of the code fallback in `client.ts` — this matters because `next build` server-renders client components' initial HTML too, so `client.ts` runs during CI builds where no `.env.local` exists.
- `src/hooks/useUsers.ts` — hand-written hook (`@tanstack/react-query`'s `useQuery` + `graphqlClient.request(GetUsersDocument)`), not generated by `@graphql-codegen/typescript-react-query` — kept explicit on purpose.
- `src/app/providers.tsx` — client component wrapping `children` in `QueryClientProvider` (`useState(() => new QueryClient())`, per TanStack Query's Next.js App Router guidance to avoid recreating the client every render). `layout.tsx` is a server component, so this client-side setup has to live in its own file.
- `src/app/layout.tsx` — root Next.js layout: Fraunces/Manrope fonts, metadata, `Providers` (TanStack Query) wrapping `next-intl`'s message provider.
- `src/app/page.tsx` — renders `UsersList`. The original landing page (`Hero`/`DayMoments`/`ClosingStatement` in `src/components/landing/`) is no longer rendered here but the component files and their behavior are untouched, in case they're needed again.
- `src/components/users/UsersList.tsx` — client component: `useUsers()` + `useTranslations("UsersList")`, renders a loading/error/success state for the fetched user list.
- `src/app/page.test.tsx` — Testing Library unit test for the home page; mocks `src/graphql/client.ts` directly (`vi.mock`) rather than pulling in MSW for one query, and disables TanStack Query's default retry so the error-case test doesn't wait out the retry backoff.
- `src/components/landing/` — landing page sections (`Hero`, `DayMoments`, `ClosingStatement`), each a client component reading its copy from `next-intl`. Currently unused by `page.tsx` (see above).
- `src/i18n/request.ts` — `next-intl` request config; resolves the active locale's message catalog.
- `messages/en.json` — message catalog, one namespace per component (`Hero`, `DayMoments`, `ClosingStatement`, `UsersList`).
- `e2e/home.spec.ts` — Playwright test; mocks the `/api/graphql` network call via `page.route()` so it doesn't need a live backend (the `frontend-e2e` CI job never starts one).

The backend is still an intentionally minimal skeleton (shared tooling, a health endpoint, and a GraphQL endpoint with mock data). The frontend's home page now fetches and renders that mock data live via TanStack Query + `graphql-request`.

## Tech stack

### Backend

| Library | Purpose |
| --- | --- |
| `express` | HTTP server / routing |
| `helmet` | Security-related HTTP headers |
| `graphql` | GraphQL query language runtime (parser, executor) |
| `graphql-yoga` | GraphQL HTTP server, mounted in Express at `/api/graphql`; also handles body parsing and CORS for that endpoint |
| `@graphql-codegen/cli` / `@graphql-codegen/typescript` / `@graphql-codegen/typescript-resolvers` | Generates resolver argument/return types straight from the schema (`pnpm codegen`), so resolvers don't hand-write types that can drift from the SDL |
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
| `@tanstack/react-query` | Server-state fetching/caching for React (`useQuery` in `src/hooks/`) |
| `graphql-request` | Minimal GraphQL client; sends the codegen'd `DocumentNode`s to the backend |
| `graphql` | GraphQL query language runtime (parser); used by `graphql-request` and the codegen toolchain |
| `@graphql-codegen/cli` / `@graphql-codegen/typescript` / `@graphql-codegen/typescript-operations` / `@graphql-codegen/typed-document-node` | Generates TS types *and* runtime `DocumentNode` constants for each `.graphql` document in `src/graphql/` from `backend/schema.graphql` |
| `@graphql-typed-document-node/core` | Type used by the generated `DocumentNode`s; must be a direct dependency under pnpm's strict `node_modules`, even though no code imports it by name |
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

Optional: `cp frontend/.env.example frontend/.env.local` if you need to point the frontend at a GraphQL endpoint other than `http://localhost:4000/api/graphql` (that's the built-in fallback, so this step isn't required to run the app locally).

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

Each package also exposes its own `dev` / `build` / `lint` / `typecheck` / `test` scripts, runnable directly from its directory. Both `backend` and `frontend` additionally have `codegen` / `codegen:watch` (see the `codegen.ts` entries above) — each runs automatically before that package's own `dev`/`build`/`typecheck`/`test`, so you only need it directly if you want fresh types without running one of those.

## Git hooks workflow

This repo has Husky git hooks configured:

- **pre-commit** — runs `lint-staged`, i.e. ESLint (with `--fix`) only on the files you're actually committing. Fast, doesn't slow down day-to-day commits.
- **pre-push** — runs `pnpm check` (lint + typecheck + unit tests for both packages). Playwright e2e tests are intentionally excluded — they're too slow for a local hook and are still run by CI after every push.

`pnpm check` can also be run manually at any time to check the repo state without waiting for a push. Hooks can be bypassed in exceptional cases (`git commit --no-verify`, `git push --no-verify`) — treat that as a last resort, not standard practice.

## CI

`.github/workflows/ci.yml` runs on every push and pull request: lint + build + unit tests for the backend, lint + build + unit tests for the frontend, and Playwright e2e tests for the frontend (after the unit job passes).
