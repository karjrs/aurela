# Plan: NoteWidget

Realizuje `docs/superpowers/specs/2026-07-12-note-widget-design.md`.

1. `frontend/src/hooks/dashboard/useNote/types.ts` — typ `NoteState`.
2. `frontend/src/hooks/dashboard/useNote/index.ts` — hook `useNote`
   (`useState("")`, bez persystencji).
3. `frontend/src/hooks/dashboard/useNote/index.test.tsx` — stan początkowy,
   aktualizacja przez `setNote`.
4. `frontend/src/components/dashboard/today/noteWidget/index.tsx` —
   komponent `NoteWidget` (kontener karty + kontrolowany `<textarea>`).
5. `frontend/src/components/dashboard/today/noteWidget/index.test.tsx` —
   nagłówek/placeholder, renderowanie wartości, wywołanie `setNote`.
6. `frontend/src/components/dashboard/today/index.tsx` — import i
   `<NoteWidget />` zaraz po `<WeatherWidget />` (desktop + mobile).
7. `frontend/src/i18n/en/dashboard.json` i `frontend/src/i18n/pl/dashboard.json`
   — klucze `today.note.heading` / `today.note.placeholder`.

## Weryfikacja

- `pnpm --dir frontend test`
- `pnpm typecheck:frontend`
- `pnpm lint:frontend`
- `pnpm dev:frontend` — ręczna weryfikacja w przeglądarce (desktop/mobile,
  pl/en).
