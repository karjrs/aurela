# TaskProgressWidget — liczba zadań na dziś + pierścień postępu

## Cel

Zastąpić istniejący tekstowy podsumowanie postępu ("X z Y zadań ukończone",
`today/index.tsx:137-139`, klucz i18n `completedCount`) osobnym widgetem
pokazującym:

1. liczbę zadań zaplanowanych na dziś (duży numer),
2. wizualny pierścień postępu (donut/progress ring) pokazujący proporcję
   ukończonych zadań — bez żadnych liczb (np. procentów) wewnątrz pierścienia.

## Komponent

Nowy folder: `frontend/src/components/dashboard/today/taskProgressWidget/`
z plikami `index.tsx`, `types.ts`, `index.test.tsx`.

`TaskProgressWidget` jest komponentem klienckim (`"use client"`), przyjmuje
`tasks: Task[]` jako props (ten sam wzorzec co `SunArc`/`NextTaskCard`) i sam
liczy pochodne wartości:

```ts
const total = tasks.length;
const completed = tasks.filter((task) => task.done).length;
```

### Wygląd

Kontener zgodny z konwencją innych widgetów:
`rounded-3xl border border-border bg-card p-4 shadow-sm`.

Układ poziomy (`flex items-center justify-between gap-3`), analogicznie do
`CurrentWeather` w `weatherWidget/index.tsx`:

- lewa strona: nagłówek (`text-xs font-semibold text-muted-foreground`,
  klucz `progress.heading`) nad dużym numerem
  (`font-display text-2xl font-medium text-foreground`) = `total`, z podpisem
  `progress.label` pod spodem (`text-xs text-muted-foreground`),
- prawa strona: pierścień postępu — ręcznie zrobiony SVG (dwa `<circle>` ze
  `stroke-dasharray`/`stroke-dashoffset`: tło w `text-muted-foreground`
  opacity, łuk proporcjonalny do `completed / total` w kolorze
  `[color:var(--accent-brand)]`, `stroke-linecap="round"`), rozmiar `size-12`,
  bez żadnego tekstu w środku.

### Stan pusty (`total === 0`)

Widget renderuje się zawsze. Gdy `total === 0`: numer pokazuje `0`, a w
miejscu pierścienia pojawia się tekst `progress.empty`
("Brak zaplanowanych zadań na dziś") zamiast SVG.

## Integracja w `today/index.tsx`

- Usunięcie paragrafu `completedCount` (linie 137-139) oraz nieużywanej już
  zmiennej `doneCount` (linia 58).
- Desktop: `<TaskProgressWidget tasks={sortedTasks} />` w prawej kolumnie,
  nad `<WeatherWidget />` (linia ~121-122).
- Mobile: analogiczny fallback obok istniejącego
  `{!isDesktop && <WeatherWidget />}` (linia 135), w tej samej kolejności
  (widget nad pogodą):
  ```tsx
  {!isDesktop && (
    <>
      <TaskProgressWidget tasks={sortedTasks} />
      <WeatherWidget />
    </>
  )}
  ```

## i18n

Nowy blok `dashboard.today.progress` w `en/dashboard.json` i
`pl/dashboard.json`:

```json
"progress": {
  "heading": "Dzisiejsze zadania",
  "label": "zaplanowane dziś",
  "empty": "Brak zaplanowanych zadań na dziś"
}
```

Usunięcie nieużywanego już klucza `completedCount` z obu plików.

## Testy

`taskProgressWidget/index.test.tsx` (wzorowane na `greeting`/`weatherWidget`
testach, `NextIntlClientProvider` + realne komunikaty z `@i18n/pl/dashboard.json`):

1. Zadania z częściowym postępem (np. 2 z 4 `done: true`) → numer "4"
   widoczny w dokumencie, obecny `<svg>` pierścienia.
2. Brak zadań (`tasks: []`) → numer "0", tekst `progress.empty` widoczny,
   brak `<svg>`.
3. Wszystkie zadania ukończone → pierścień w pełni wypełniony (sprawdzenie
   wartości `stroke-dashoffset`/atrybutu łuku na pełne wypełnienie).

## Poza zakresem

- Interaktywność pierścienia (klik, tooltip, nawigacja do zadań).
- Animacje wypełniania pierścienia przy zmianie danych.
- Progres tygodniowy/historyczny — widget dotyczy wyłącznie dzisiejszych zadań.
