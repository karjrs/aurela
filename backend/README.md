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

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Run the dev server (`tsx watch src/index.ts`) |
| `pnpm build` | Compile with `tsc` to `dist/` |
| `pnpm start` | Run the compiled build (`node dist/index.js`) |
| `pnpm typecheck` | Type-check with `tsc --noEmit` |
| `pnpm test` / `pnpm test:watch` | Run Vitest unit/HTTP-level tests |
| `pnpm codegen` / `pnpm codegen:watch` | Regenerate `src/graphql/types.ts` and `schema.graphql` from `src/graphql/schema.ts` |

`codegen` also runs automatically before `dev`/`build`/`typecheck`/`test` via `pre*` script hooks — you only need it directly if you want fresh types without running one of those.

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
| `consts.ts` | Mock data |
| `types.ts` | Shared entity SDL — the only place that assembles the resource's full schema |
| `index.ts` | Registers resolvers + types with `schema.ts` |
| `query/` | Read-side SDL, resolvers, and tests |
| `mutation/` | Write-side SDL, resolvers, `zod` validation schemas, and tests |

### `codegen.ts` (repo root)

`graphql-codegen` config generating `src/graphql/types.ts` and `schema.graphql` from `src/graphql/schema.ts`. `schema.graphql` is the **committed** SDL bridge to `frontend/` — see the [root README](../README.md) for why.

## Tech stack

| Library | Purpose |
| --- | --- |
| `express` | HTTP server / routing |
| `helmet` | Security-related HTTP headers |
| `graphql` | GraphQL query language runtime (parser, executor) |
| `graphql-yoga` | GraphQL HTTP server, mounted in Express at `/api/graphql`; also handles body parsing and CORS for that endpoint |
| `@graphql-codegen/cli` / `@graphql-codegen/typescript` / `@graphql-codegen/typescript-resolvers` | Generates resolver argument/return types straight from the schema (`pnpm codegen`), so resolvers don't hand-write types that can drift from the SDL |
| `zod` | Runtime schema validation, used in the mutation resolvers (`users/mutation/schemas.ts`) |
| `tsx` | Run TypeScript directly in dev (`pnpm dev`) |
| `typescript` | Type-checking |
| `vitest` / `supertest` | Unit and HTTP-level testing |
