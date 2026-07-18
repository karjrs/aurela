# NoteWidget — pojedyncza szybka notatka (zamockowany stan)

## Cel

Nowy widget na dashboardzie „today" — pole tekstowe na jedną, szybką
notatkę (styl „karteczki na biurku"), nie lista notatek i nie notatka
powiązana z konkretnym zadaniem. Pełna szerokość kolumny (jak
`WeatherWidget`), umieszczony zaraz po nim.

Rozważone alternatywy: lista notatek (więcej złożoności/miejsca, niepotrzebne
na start) i notatka powiązana z następnym zadaniem (rozszerzałoby model
`Task` — inny, większy zakres). Wybrano pojedynczą notatkę jako najprostszy,
niezależny widget.

## Hook `useNote`

Nowy folder: `frontend/src/hooks/dashboard/useNote/` (`index.ts`,
`types.ts`, `index.test.tsx`).

```ts
export type NoteState = {
  note: string;
  setNote: (note: string) => void;
};
```

Na razie zwykły `useState("")` — bez persystencji, ten sam wzorzec co
`useSleep`/`useFocusTimer` (komponent konsumuje `{ note, setNote }`, nie zna
szczegółów źródła danych, więc wnętrze można później podmienić na backend
bez zmiany kontraktu). Świadomie ustalone z użytkownikiem: docelowo dojdzie
persystencja (backend), ale to osobny, późniejszy krok.

## Komponent `NoteWidget`

Nowy folder: `frontend/src/components/dashboard/today/noteWidget/`
(`index.tsx`, `index.test.tsx`).

- Kontener: `flex flex-col gap-3 rounded-3xl border border-border bg-card p-4
  shadow-sm` — identyczny z `WeatherWidget`/`SleepWidget`, pełna szerokość
  kolumny.
- Nagłówek: `text-xs font-semibold text-muted-foreground`, `t("note.heading")`.
- `<textarea>` kontrolowany (`value`/`onChange`), `rows={4}`, bez przycisku
  zapisu — zmiana zapisuje się od razu, spójnie z resztą formularzy w apce.

## Integracja w `today/index.tsx`

`<NoteWidget />` zaraz po `<WeatherWidget />`, w obu blokach (desktop i
mobile).

## i18n

Nowy klucz w `pl`/`en` `dashboard.json`:

```json
"note": {
  "heading": "Notatka",                    // en: "Note"
  "placeholder": "Zapisz coś na później…"  // en: "Jot something down…"
}
```

## Testy

- `useNote/index.test.tsx`: stan początkowy (pusty string), `setNote`
  aktualizuje wartość.
- `noteWidget/index.test.tsx`: zamockowany `useNote`, sprawdzenie nagłówka i
  placeholdera przy pustej notatce, renderowania aktualnej wartości oraz
  wywołania `setNote` po zmianie tekstu.

## Poza zakresem

- Prawdziwa persystencja (`localStorage` lub zasób backendowy GraphQL) —
  świadomie odłożone, dojdzie w kolejnym kroku.
- Wiele notatek / lista notatek.
- Formatowanie tekstu (markdown / rich text).
- Powiązanie notatki z konkretnym zadaniem (`Task`).
