# Aurela

Next.js frontend + Express backend, both in TypeScript.

## Structure

- `frontend/` — Next.js (App Router, ESLint, Vitest, Playwright)
- `backend/` — Express + TypeScript (ESLint, Vitest, `tsx` for dev, `tsc` for build)

Each package has its own `pnpm-lock.yaml` and `node_modules` — this isn't a real pnpm workspace, just two independent packages orchestrated from the root via `pnpm --dir`. Since frontend can't import backend's TypeScript source across that boundary, the one deliberate bridge between them is `backend/schema.graphql` — a committed (not gitignored) SDL export of the backend schema that the frontend's own `graphql-codegen` reads as a plain file, with no live server or cross-package dependency involved. It has to be regenerated (`pnpm codegen` in `backend/`) and committed by hand whenever the backend schema changes. Validation is a second, smaller instance of the same boundary: `backend/src/graphql/users/mutation/schemas.ts` and `frontend/src/forms/users/schema.ts` each define their own `zod` schema for the same shape, kept in sync by hand — there's no mechanism enforcing they match, so a schema change on one side needs a matching edit on the other.

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
  - `users/mutation/schemas.ts` — `zod` schemas (`createUserSchema`, `updateUserSchema`) validating mutation input before it touches the mock array. `updateUserSchema` mirrors `UpdateUserInput`'s partial shape (`.optional()` per field, `.refine()` rejecting a fully-empty input) rather than allowing fields to be cleared — `User.name`/`email` are non-null in the SDL, so "unset a field" isn't a valid partial update even though the generated input type technically allows an explicit `null`.
  - `users/mutation/index.ts` — the `Mutation` resolvers (`createUser`, `updateUser`, `deleteUser`) that mutate the in-memory mock array, typed against the generated `MutationResolvers`. `createUser`/`updateUser` run their input through the matching schema in `schemas.ts` first, throwing on failure via `graphql-yoga`'s `createGraphQLError` (not `new GraphQLError` from `"graphql"` — see the note below) with `extensions.code: "BAD_USER_INPUT"`, so invalid input never reaches the array. This is the reference pattern for validating any future resource's mutations.
  - `users/mutation/index.test.ts` — `supertest`-based tests for the mutations, including the validation failure cases.
  - `users/types.ts` — the resource's *barrel*: declares the shared entity SDL (`type User`, `CreateUserInput`, `UpdateUserInput` — no `extend`, since the entity shape isn't specific to reading or writing), imports `types` from both `query/types.ts` and `mutation/types.ts`, and default-exports all three as one array: `export default [types, queryTypes, mutationTypes]`. This is the **only** place that assembles this resource's full SDL — `query/`/`mutation/` `index.ts` files only ever export resolvers, never re-export their own `types`.
  - `users/index.ts` — thin: imports `query` and `mutation` (resolvers) plus the default-exported `types` array from `users/types.ts`, and default-exports `{ query, mutation, types }` for `schema.ts` to register.
- **Gotcha when throwing errors from a resolver**: always use `createGraphQLError` from `"graphql-yoga"`, never `new GraphQLError` from `"graphql"` directly. Yoga's default error masking decides whether an error is "intentional" (and thus safe to pass through unmasked) by checking `instanceof GraphQLError` against its own internal (CJS-loaded) copy of graphql-js. Resolver code here is ESM, so a `GraphQLError` constructed via the plain `"graphql"` import is a different class instance from Yoga's perspective — the check silently fails and the error gets masked into a generic `"Unexpected error."` with none of your `extensions`. `createGraphQLError` sidesteps this because it constructs the error using graphql-tools' own (matching) `GraphQLError` reference.
- `src/graphql/types.ts` — **generated, not hand-written.** `QueryResolvers`/`MutationResolvers` types (and per-field arg types) produced by `graphql-codegen` from `codegen.ts` (see below), so resolver code doesn't hand-write `args: { ... }` types that could silently drift from the SDL. Gitignored — not a source of truth, just derived output — and regenerated automatically before `dev`/`build`/`typecheck`/`test` via `pre*` pnpm script hooks. Run `pnpm codegen` manually (or `pnpm codegen:watch`) after editing any resource's `types.ts` if you want fresh types without running one of those.
- `src/graphql/yoga.ts` — GraphQL Yoga instance, mounted at `/api/graphql`; handles its own body parsing and CORS.
- `codegen.ts` — `graphql-codegen` config, pointed directly at `src/graphql/schema.ts`'s `schema` export, generating two outputs from that one loaded schema: `src/graphql/types.ts` (resolver types, gitignored, see above) and `schema.graphql` (plain SDL via the `schema-ast` plugin, **committed** — see "Structure" above for why).

### `frontend/`

- `codegen.ts` — `graphql-codegen` config for the frontend. Schema pointer is `../backend/schema.graphql` (a plain SDL file, not backend's TypeScript), so unlike the backend's own codegen this doesn't need `NODE_OPTIONS='--import tsx/esm'` — `graphql-file-loader` just reads text, nothing to execute. **Two separate output files, not one** — `src/graphql/schema-types.ts` (`typescript` plugin alone) and `src/graphql/types.ts` (`typescript-operations` + `typed-document-node`, with `config.importSchemaTypesFrom` pointing back at `schema-types.ts`). This split exists because of a `typescript-operations` v6 bug: when combined with `typescript` in the *same* output file, it re-declares every input/enum type referenced by an operation's variables (e.g. `CreateUserInput`), colliding with the `typescript` plugin's own declaration of the same name — `TS2300: Duplicate identifier`. This only surfaces once an operation actually uses an input type as a variable, which is why `getUsers.graphql` (no arguments) never hit it. `importSchemaTypesFrom` is resolved relative to `cwd` (i.e. `frontend/`), not relative to the output file — `"./src/graphql/schema-types"`, not `"./schema-types"`.
- `src/services/<resource>/` — one hook per file, e.g. `services/users/useUsers.ts` (`@tanstack/react-query`'s `useQuery` + `graphqlClient.request(GetUsersDocument)`, hand-written, not generated by `@graphql-codegen/typescript-react-query` — kept explicit on purpose) and `useCreateUser.ts` / `useUpdateUser.ts` / `useDeleteUser.ts` (one `useMutation` hook per mutation, same shape: `mutationFn` calls `graphqlClient.request` with the matching `*Document`, `onSuccess` calls `queryClient.invalidateQueries({ queryKey: ["users"] })` to refetch the list). This is the reference layout for any future resource's data-fetching hooks — no normalized cache, so invalidation is the only sync mechanism. Formerly a flat `src/hooks/`; moved so hook modules sit alongside the resource they belong to, mirroring `src/forms/<resource>/` below.
- `src/forms/<resource>/` — the resource's form logic, split out of the component that renders it: e.g. `forms/users/schema.ts` (a `zod` schema — intentionally mirrors, not shares, `backend/src/graphql/users/mutation/schemas.ts`, see the note below), `consts.ts` (the blank `defaultValues` used for "create" mode), `types.ts` (`UserFormValues = z.infer<typeof schema>`), and `index.ts` exporting `useUserForm(formDefaultValues = defaultValues)` — a thin wrapper around `react-hook-form`'s `useForm` + `zodResolver(schema)`. The optional parameter matters: `components/users/form/index.tsx` passes its own `defaultValues` prop through so edit mode pre-fills the row's current name/email instead of starting blank.
- `src/app/providers.tsx` — client component wrapping `children` in `QueryClientProvider` (`useState(() => new QueryClient())`, per TanStack Query's Next.js App Router guidance to avoid recreating the client every render). `layout.tsx` is a server component, so this client-side setup has to live in its own file.
- `src/app/layout.tsx` — root Next.js layout: Fraunces/Manrope fonts, metadata, `Providers` (TanStack Query) wrapping `next-intl`'s message provider.
- `src/app/page.tsx` — a one-line re-export, `export { default } from "@/views/home/page"`. The actual home page lives in `src/views/home/`, not directly under `app/`, so that route-level component gets its own test file alongside it without either colliding with Next's App Router file conventions or, if it were named `src/pages/`, with Next's *legacy* Pages Router auto-detection (which scans any directory literally named `pages` — including under `src/` — and requires every file inside, even a `.test.tsx`, to satisfy `PagesPageConfig`). `views` was picked specifically to avoid that collision.
- `src/views/home/page.tsx` — renders `UsersList`; that's the entire home page. An earlier landing page (`Hero`/`DayMoments`/`ClosingStatement`) was kept around unused for a while and has since been removed — see git history if it's ever needed again.
- `src/views/home/page.test.tsx` — Testing Library smoke test for the home page (success/error rendering only); CRUD behavior (create/edit/delete, validation, not-found responses) is covered separately in `src/components/users/index.test.tsx`, which renders `UsersList` directly and mocks `graphqlClient.request` per operation via `document === XDocument` checks, since one flow can trigger several different requests (e.g. `CreateUser` then a refetching `GetUsers`).
- `src/utils/helpers/cn/index.ts` — `cn()`, shadcn/ui's helper combining `clsx` (conditional class names) and `tailwind-merge` (resolves conflicting Tailwind utility classes so later ones win). Used by every component in `src/components/common/`. Formerly `src/lib/utils.ts`; `components.json`'s `aliases.utils` points here so future `shadcn add` runs still target the right file.
- `src/app/globals.css` — below the pre-existing `@theme` block (the named `dawn`/`lavender`/`coral`/`gold`/`mist`/`ink` palette, unchanged), a `:root` block maps shadcn/ui's semantic tokens (`--primary`, `--destructive`, `--border`, `--ring`, etc.) onto that same palette, and an `@theme inline` block exposes them as Tailwind utilities (`bg-primary`, `text-destructive`, ...). These are aliases onto the existing colors, not a parallel color system — most shadcn-generated component code needed no color changes at all. There's no `.dark` block: the project has no theme toggle, so a dark palette would be speculative.
- `src/components/common/{ui,forms,inputs}/<name>/` — generic, resource-agnostic UI primitives generated by the `shadcn` CLI (as opposed to `src/components/users/`, which is specific to the users resource), one folder per primitive instead of shadcn's default flat file: `index.tsx` (the component), plus `types.ts` and/or `consts.ts` (e.g. `class-variance-authority`'s variant maps) when the primitive needs them. Currently: `ui/button/`, `ui/card/`, `ui/separator/`, `forms/field/`, `forms/label/`, `inputs/input/`. Each has a few overrides layered on top of the generated source to keep the pre-migration look: `button`'s `default`/`secondary`/`destructive` variants and padding, `input`'s height/padding, `field`'s `FieldError` text color, `card`'s border/radius (see each file for specifics). `components.json`'s `aliases.ui` is pointed at `@/components/common` (not the CLI default `@/components/ui`) so `shadcn add` writes here directly — after adding a new primitive this way, split its single generated file into this folder shape by hand. Note for future `shadcn add` runs: the installed CLI version no longer ships the classic `form.tsx` (`Form`/`FormField`/`FormMessage`) — `shadcn add form` resolves to zero files. Its replacement is `forms/field/`'s `Field`/`FieldLabel`/`FieldError`, which isn't tied to `react-hook-form` the way `form.tsx` was; wire it with plain `register()`/`formState.errors`, as `components/users/form/` does.
- `src/components/users/index.tsx` — barrel re-exporting `UserForm`, `UserListItem`, `UsersList` from the three folders below; nothing outside `components/users/` imports those folders directly.
- `src/components/users/list/index.tsx` (`UsersList`) — client component: `useUsers()` + `useTranslations("usersList")`, renders a loading/error/success state for the fetched user list, an inline expandable "add user" section (`UserForm` + `useCreateUser`, no route/modal), and one `UserListItem` per user. Owns `editingId`/`confirmingDeleteId` state (which row, if any, is being edited or confirming delete) so only one row can be in either mode at a time — not local state per item.
- `src/components/users/listItem/index.tsx` (`UserListItem`) — a single row, rendered as shadcn's `Card` inside the `<li>` (the `<li>` itself stays a bare structural wrapper — list semantics for tests/selectors, no styling of its own): view mode (`CardHeader`/`CardTitle`/`CardDescription` for name/email, `CardFooter` for Edit/Delete buttons) or edit mode (`CardContent` wrapping `UserForm` with `defaultValues`). Delete uses an inline "Delete this user? / Confirm / Cancel" toggle, never `window.confirm()`. Handles `updateUser`/`deleteUser` returning `null`/`false` (unknown id) as a valid domain outcome, not a mutation error — shown as a "no longer exists" message rather than routed through `isError`.
- `src/components/users/form/index.tsx` (`UserForm`) — shared between create and edit; presence of the `defaultValues` prop switches the mode (and the submit button's copy) rather than a separate `mode` prop, and is forwarded into `useUserForm(defaultValues)` from `src/forms/users/` so edit mode's fields actually start pre-filled. Fields are laid out with shadcn's `Field`/`FieldLabel`/`FieldError` (from `components/common/forms/field/`), wired to `register()`/`formState.errors` — `FieldError` renders whatever children it's given, so the existing `errors.name && t("nameError")` pattern (translated text, independent of zod's own error message) carries over unchanged.
- `src/i18n/request.ts` — `next-intl` request config; resolves the active locale's message catalog via a dynamic `import(\`./messages/${locale}.json\`)`, so the catalog must stay a sibling of this file.
- `src/i18n/messages/en.json` — message catalog, one camelCase namespace per component: `usersList` (list/row copy, including delete confirmation and not-found messages) and `userForm` (the create/edit form's field labels and validation messages). Formerly top-level `messages/en.json`; moved next to `request.ts` since that's its only real consumer, and `e2e/*.spec.ts` import it too (via a relative path — Playwright's test runner doesn't resolve this project's `@/*` tsconfig path alias).
- `src/graphql/users/*.graphql` — hand-written query/mutation documents, e.g. `getUsers.graphql`, `createUser.graphql`, grouped in a `users/` subfolder (mirroring `services/users/`, `forms/users/`) so a future second resource doesn't mix its documents in with these. Each one's selected fields determine the shape of its generated type — this is a different kind of type than the backend's resolver types (see "Structure" above), not a duplicate of them.
- `src/graphql/schema-types.ts` — **generated, not hand-written.** Schema-level types (`User`, `CreateUserInput`, `UpdateUserInput`, `Query`, `Mutation`, ...) via the `typescript` plugin — import these when you need a schema type on its own (e.g. a mutation hook's input parameter), not tied to a specific operation.
- `src/graphql/types.ts` — **generated, not hand-written.** Per-operation types (`GetUsersQuery`/`GetUsersQueryVariables`, `CreateUserMutation`, ...) plus the runtime `*Document` constants (e.g. `GetUsersDocument`, `CreateUserDocument`) that `graphql-request` sends over the wire — one set per document in `src/graphql/users/*.graphql`. Both generated files are gitignored, regenerated automatically via `pre*` pnpm script hooks before `dev`/`build`/`typecheck`/`test`.
- `src/graphql/client.ts` — a single `graphql-request` `GraphQLClient` instance, pointed at `NEXT_PUBLIC_GRAPHQL_ENDPOINT` (falls back to `http://localhost:4000/api/graphql` if unset — see `.env.example` below).
- `.env.example` — documents `NEXT_PUBLIC_GRAPHQL_ENDPOINT`; copy to `.env.local` (gitignored) to override it. Not required to boot the app because of the code fallback in `client.ts` — this matters because `next build` server-renders client components' initial HTML too, so `client.ts` runs during CI builds where no `.env.local` exists.
- `e2e/home.spec.ts` — Playwright test; mocks the `/api/graphql` network call via `page.route()` so it doesn't need a live backend (the `frontend-e2e` CI job never starts one).
- `e2e/users-crud.spec.ts` — Playwright coverage for create/edit/delete. Unlike `home.spec.ts`'s single fixed mock response, its `page.route` handler branches on the mutation name inside `postDataJSON().query` (`"CreateUser"`/`"UpdateUser"`/`"DeleteUser"`) and keeps an in-memory `users` array across requests, since each flow issues multiple sequential GraphQL calls.

Import order within any `frontend/src/**/*.ts(x)` file follows a fixed 3-category convention — components; forms/services/hooks; types/helpers/consts, in that order — and *within each category*, external (npm-package) imports come before internal (project) ones, separated by a blank line. See existing files for the pattern (e.g. `components/users/listItem/index.tsx`) rather than restating the full rule here.

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
| `zod` | Runtime schema validation, used in the mutation resolvers (`users/mutation/schemas.ts`) |
| `tsx` | Run TypeScript directly in dev (`pnpm dev`) |
| `typescript` / `typescript-eslint` | Type-checking and TS-aware linting |
| `eslint` / `@eslint/js` | Linting |
| `vitest` / `supertest` | Unit and HTTP-level testing |

### Frontend

| Library | Purpose |
| --- | --- |
| `next` | React framework (App Router) |
| `react` / `react-dom` | UI rendering |
| `react-hook-form` | Form state and validation, used in `UserForm` |
| `@hookform/resolvers` | Bridges `react-hook-form` to a `zod` schema via `zodResolver` (`@hookform/resolvers/zod`) |
| `zod` | Runtime schema validation — same pattern as the backend, but a separately maintained schema (see `UserForm.tsx` above), not a shared import |
| `next-intl` | Internationalization (message catalogs, translations) |
| `@tanstack/react-query` | Server-state fetching/caching for React (`useQuery` in `src/hooks/`) |
| `graphql-request` | Minimal GraphQL client; sends the codegen'd `DocumentNode`s to the backend |
| `graphql` | GraphQL query language runtime (parser); used by `graphql-request` and the codegen toolchain |
| `@graphql-codegen/cli` / `@graphql-codegen/typescript` / `@graphql-codegen/typescript-operations` / `@graphql-codegen/typed-document-node` | Generates TS types *and* runtime `DocumentNode` constants for each `.graphql` document in `src/graphql/` from `backend/schema.graphql` |
| `@graphql-typed-document-node/core` | Type used by the generated `DocumentNode`s; must be a direct dependency under pnpm's strict `node_modules`, even though no code imports it by name |
| `tailwindcss` / `@tailwindcss/postcss` | Utility-first styling |
| `class-variance-authority` | Declares the variant/size class maps for `common/button.tsx` and `common/field.tsx` |
| `clsx` / `tailwind-merge` | Combined by `src/lib/utils.ts`'s `cn()`, used by every `src/components/common/` primitive to merge caller-supplied and default class names without conflicts |
| `radix-ui` | Unstyled, accessible primitives underlying `common/button.tsx` (`Slot`) and `common/label.tsx` (`Label`) |
| `typescript` | Type-checking |
| `eslint` / `eslint-config-next` | Linting |
| `vitest` / `@testing-library/*` / `jsdom` | Unit and component testing |
| `@playwright/test` | End-to-end testing |

### Root

| Library | Purpose |
| --- | --- |
| `concurrently` | Run frontend and backend dev servers side by side (`pnpm dev`) |
| `husky` | Manages the git hooks in `.husky/` |
| `lint-staged` | Runs Prettier and ESLint only on staged files for the pre-commit hook |
| `prettier` | Code formatting, shared by both packages via a single root config (`.prettierrc.json`) — there's no `frontend`/`backend` split like ESLint's, since formatting rules don't need to differ per package |

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
| `pnpm format` | Format the whole repo with Prettier |
| `pnpm format:check` | Check formatting without writing changes (what CI would run) |
| `pnpm check` | Full local check: lint + typecheck + unit tests for both packages — the same thing the pre-push hook runs |

Each package also exposes its own `dev` / `build` / `lint` / `typecheck` / `test` scripts, runnable directly from its directory. Both `backend` and `frontend` additionally have `codegen` / `codegen:watch` (see the `codegen.ts` entries above) — each runs automatically before that package's own `dev`/`build`/`typecheck`/`test`, so you only need it directly if you want fresh types without running one of those.

`format` / `format:check` are root-only, unlike the other scripts — `frontend/` and `backend/` are separate pnpm installs with no workspace linking between them (see "Structure" above), so `prettier` is installed once at the root and always invoked from there (`prettier --write .` / `prettier --check .`), rather than per-package. Prettier's own config resolution (walking up from each file to the nearest config) means the single root `.prettierrc.json` still applies to every file in both packages.

## Git hooks workflow

This repo has Husky git hooks configured:

- **pre-commit** — runs `lint-staged`, i.e. Prettier (`--write`) then ESLint (with `--fix`) only on the files you're actually committing. Fast, doesn't slow down day-to-day commits.
- **pre-push** — runs `pnpm check` (lint + typecheck + unit tests for both packages). Playwright e2e tests are intentionally excluded — they're too slow for a local hook and are still run by CI after every push.

`pnpm check` can also be run manually at any time to check the repo state without waiting for a push. Hooks can be bypassed in exceptional cases (`git commit --no-verify`, `git push --no-verify`) — treat that as a last resort, not standard practice.

## CI

`.github/workflows/ci.yml` runs on every push and pull request: a repo-wide `pnpm format:check`, lint + build + unit tests for the backend, lint + build + unit tests for the frontend, and Playwright e2e tests for the frontend (after the unit job passes).
