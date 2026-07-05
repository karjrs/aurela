# Aurela — backend

Express + TypeScript GraphQL API. See the [root README](../README.md) for how this fits together with `frontend/`.

## Getting started

```bash
pnpm install
```

(or `pnpm --dir backend install` from the repo root.)

## Running

```bash
pnpm dev
```

(or `pnpm dev:backend` from the repo root.) Serves on `http://localhost:4000`.

Needs a reachable Postgres and `DATABASE_URL` set (running via `pnpm docker:dev` from the repo root handles both). Running the backend directly, outside Docker: `docker compose up postgres -d` from the repo root, then `DATABASE_URL=postgresql://aurela:aurela@localhost:5432/aurela pnpm dev`.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Run the dev server (`tsx watch src/index.ts`) |
| `pnpm build` | Compile with `tsc` to `dist/` |
| `pnpm start` | Run the compiled build (`node dist/index.js`) |
| `pnpm typecheck` | Type-check with `tsc --noEmit` |
| `pnpm test` / `pnpm test:watch` | Run Vitest unit/HTTP-level tests (against an in-memory `pglite` database, not the real one) |
| `pnpm codegen` / `pnpm codegen:watch` | Regenerate `src/graphql/types.ts` and `schema.graphql` from `src/graphql/schema.ts` |
| `pnpm db:generate` | Generate a migration from `src/db/schema.ts` (diffs against `drizzle/`, no live database needed) |
| `pnpm db:migrate` | Apply pending migrations to the database at `DATABASE_URL` (manual/CI use — the app also applies them itself on boot, see below) |
| `pnpm db:seed` | Insert the starter users (Ada Lovelace, Alan Turing); safe to re-run, duplicates are skipped |

`codegen` also runs automatically before `dev`/`build`/`typecheck`/`test` via `pre*` script hooks — you only need it directly if you want fresh output without running one of those. Migrations are **not** part of these hooks: `pnpm build`/`docker build` only compile, with no database reachable. Instead, `src/index.ts` applies pending migrations itself at process startup, right before it starts listening — the same code path runs in `pnpm dev`, `pnpm start`, and both Docker targets.

## Modules

Paths below are relative to `src/`, except where noted.

### `app.ts` / `index.ts` / `app.test.ts` (top-level)

Express app setup, entry point, and a `supertest`-based smoke test.

### `graphql/`

`schema.ts` (assembles the executable schema from all resources), `yoga.ts` (the GraphQL Yoga HTTP handler, mounted at `/api/graphql`), and `types.ts` (generated resolver types, gitignored) live at the top level; one subdirectory per resource.

### `graphql/users/`

Reference layout for a resource — copy this shape for a new one (e.g. `posts/`).

| Path | Description |
| --- | --- |
| `types.ts` | Shared entity SDL — the only place that assembles the resource's full schema |
| `index.ts` | Registers resolvers + types with `schema.ts` |
| `query/` | Read-side SDL, resolvers, and tests |
| `mutation/` | Write-side SDL, resolvers, `zod` validation schemas, and tests |

### `db/`

Drizzle ORM layer, the resolvers' only path to Postgres.

| Path | Description |
| --- | --- |
| `schema.ts` | Table definitions (`usersTable`) — the source `drizzle-kit generate` diffs against |
| `index.ts` | The shared `db` client, connected via `DATABASE_URL` |
| `seed.ts` | One-off script inserting the starter users (`pnpm db:seed`) |

`drizzle.config.ts` and the generated, **committed** `drizzle/` migrations folder live at the repo root of `backend/` (alongside `codegen.ts`), not under `src/`.

### `codegen.ts` (repo root)

`graphql-codegen` config generating `src/graphql/types.ts` and `schema.graphql` from `src/graphql/schema.ts`. `schema.graphql` is the **committed** SDL bridge to `frontend/` — see the [root README](../README.md) for why.

## Error handling

GraphQL errors carry `extensions.code` for the general category (e.g. `BAD_USER_INPUT`, `EMAIL_ALREADY_IN_USE`) and `extensions.fieldErrors: Record<string, string[]>` for field-level detail. The strings inside `fieldErrors` (and the zod messages in `users/mutation/schemas.ts` that produce them) are **stable keys**, never English prose — e.g. `"nameRequired"`, not `"Name is required"`. The frontend looks these keys up in its own `errors` translation namespace to render a localized message, so a key can never change without a matching update on both sides — kept in sync by hand, same as the duplicated `zod` schemas the root README already documents.

## Tech stack

| Library | Purpose |
| --- | --- |
| `express` | HTTP server / routing |
| `helmet` | Security-related HTTP headers |
| `graphql` | GraphQL query language runtime (parser, executor) |
| `graphql-yoga` | GraphQL HTTP server, mounted in Express at `/api/graphql`; also handles body parsing and CORS for that endpoint |
| `@graphql-codegen/cli` / `@graphql-codegen/typescript` / `@graphql-codegen/typescript-resolvers` | Generates resolver argument/return types straight from the schema (`pnpm codegen`), so resolvers don't hand-write types that can drift from the SDL |
| `zod` | Runtime schema validation, used in the mutation resolvers (`users/mutation/schemas.ts`) |
| `drizzle-orm` / `pg` | Type-safe query builder and migrations for Postgres (`src/db/`), over the `node-postgres` driver |
| `drizzle-kit` | CLI for generating and applying migrations (`pnpm db:generate` / `pnpm db:migrate`) |
| `@electric-sql/pglite` | In-memory, WASM-compiled Postgres used only by tests (`vitest.setup.ts`) — real SQL semantics without a live database |
| `tsx` | Run TypeScript directly in dev (`pnpm dev`) |
| `typescript` | Type-checking |
| `vitest` / `supertest` | Unit and HTTP-level testing |
