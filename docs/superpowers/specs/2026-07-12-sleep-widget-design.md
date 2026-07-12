# SleepWidget — długość snu (zamockowane dane)

## Cel

Nowy widget informujący o długości snu użytkownika, na razie z zamockowanymi
danymi (6h 45min / maksimum 8h). Pełna szerokość kolumny (jak
`WeatherWidget`), umieszczony zaraz po nim, przed wierszem
`TaskProgressWidget`/`FocusTimerWidget`.

## Wydzielenie `useDurationLabel`

W `taskForm/index.tsx` istnieje lokalny, nieeksportowany hook
`useDurationLabel` (`splitDuration` + i18n `dashboard.today.duration.*`,
np. "6 h 45 min"). Przenoszę go do
`frontend/src/hooks/dashboard/useDurationLabel/index.ts` (bez zmiany
logiki), `taskForm/index.tsx` importuje go stamtąd zamiast definiować
lokalnie. Brak istniejących testów dla `taskForm`, więc ta zmiana nie
wymaga aktualizacji żadnych testów poza dodaniem nowych dla wydzielonego
hooka.

## Hook `useSleep`

Nowy folder: `frontend/src/hooks/dashboard/useSleep/` (`index.ts`,
`types.ts`, `index.test.tsx`).

```ts
export type SleepData = {
  sleptHours: number;
  maxHours: number;
};
```

Na razie zwraca stałe zamockowane wartości (`sleptHours: 6.75` = 6h 45min,
`maxHours: 8`), przygotowany pod przyszłą integrację z prawdziwymi danymi i
ustawieniem maksimum przez użytkownika — ten sam wzorzec co `useWeather`/
`useFocusTimer` (komponent konsumuje hook, nie zna szczegółów źródła
danych).

## Komponent `SleepWidget`

Nowy folder: `frontend/src/components/dashboard/today/sleepWidget/`
(`index.tsx`, `index.test.tsx`).

- Kontener: `flex flex-col gap-3 rounded-3xl border border-border p-4
  shadow-sm` — identyczny z `WeatherWidget`, pełna szerokość kolumny.
- Nagłówek: `text-xs font-semibold text-muted-foreground`,
  `t("sleep.heading")`.
- Duża liczba: `font-display text-2xl font-medium text-foreground`,
  tekst z `useDurationLabel()(sleptHours)`.
- Poziomy pasek postępu: zewnętrzny `h-2 w-full overflow-hidden rounded-full
  bg-muted`, wewnętrzny wypełniony `h-full rounded-full
  bg-[color:var(--accent-brand)]`, szerokość przez inline `style={{ width:
  \`${progress * 100}%\` }}`, gdzie `progress = clamp01(sleptHours /
  maxHours)` (reużycie istniejącego `clamp01` z `@utils/dateTime`).

## Integracja w `today/index.tsx`

`<SleepWidget />` zaraz po `<WeatherWidget />`, przed wierszem
`TaskProgressWidget`/`FocusTimerWidget` — w obu blokach (desktop i mobile).

## i18n

Nowy klucz w `pl`/`en` `dashboard.json`:

```json
"sleep": {
  "heading": "Sen"   // en: "Sleep"
}
```

## Testy

- `useDurationLabel/index.test.tsx`: warianty godziny+minuty, same godziny,
  same minuty (przeniesione z logiki `taskForm`, pierwszy test dla tego
  hooka).
- `useSleep/index.test.tsx`: zwraca oczekiwany kształt/wartości mocka.
- `sleepWidget/index.test.tsx`: zamockowany `useSleep`, sprawdzenie
  wyrenderowanego tekstu czasu i szerokości paska (`style.width`) dla
  częściowego i pełnego wypełnienia.

## Poza zakresem

- Prawdziwe źródło danych o śnie (integracja z urządzeniem/API).
- Ustawienia użytkownika do edycji maksymalnej wartości (`maxHours` na
  sztywno w mocku, jak wcześniej ustalone).
