# app

Szkielet aplikacji (nazwa robocza): frontend w Next.js + backend w Express, oba w TypeScript.

## Struktura

- `frontend/` — Next.js (App Router, ESLint)
- `backend/` — Express + TypeScript (ESLint, `tsx` do dev, `tsc` do builda)

## Uruchamianie

```bash
# frontend (http://localhost:3000)
pnpm dev:frontend

# backend (http://localhost:4000)
pnpm dev:backend
```

Każdy pakiet ma też własne `pnpm install` / `pnpm dev` / `pnpm build` / `pnpm lint` uruchamiane z jego katalogu.
