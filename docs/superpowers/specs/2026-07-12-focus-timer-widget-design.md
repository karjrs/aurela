# FocusTimerWidget — licznik czasu skupienia (Pomodoro)

## Cel

Dodać samodzielny widget Pomodoro (25 min pracy / 5 min przerwy, na sztywno)
w miejscu dotychczasowej zaślepki `PlaceholderProgressWidget`, w tym samym
kwadratowym formacie co `TaskProgressWidget`. Widget nie jest powiązany z
listą zadań — to niezależny licznik.

## Hook `useFocusTimer`

Nowy folder: `frontend/src/hooks/dashboard/useFocusTimer/` (`index.ts`,
`index.test.tsx`, `types.ts`).

```ts
export const WORK_DURATION_SECONDS = 25 * 60;
export const BREAK_DURATION_SECONDS = 5 * 60;

export type FocusPhase = "work" | "break";

export type FocusTimerState = {
  phase: FocusPhase;
  secondsRemaining: number;
  isRunning: boolean;
  toggle: () => void;
  reset: () => void;
};
```

Zachowanie:

- Stan trzymany w `useState` (bez persystencji — spójne z resztą aplikacji,
  która nigdzie dziś nie zapisuje stanu między sesjami; `useDashboardTasks`
  też resetuje się przy odświeżeniu).
- `isRunning: true` uruchamia `setInterval` co 1000 ms, dekrementujący
  `secondsRemaining`.
- Gdy `secondsRemaining` osiąga 0: odtwarza krótki dźwięk (patrz niżej),
  przełącza `phase` (`work` ↔ `break`), ustawia `secondsRemaining` na czas
  trwania nowej fazy i **automatycznie kontynuuje odliczanie** (nowa faza
  startuje od razu, bez klikania).
- `toggle()` przełącza `isRunning` (start/pauza), nie zmienia `phase` ani
  `secondsRemaining`.
- `reset()` zatrzymuje odliczanie (`isRunning: false`) i ustawia
  `secondsRemaining` z powrotem na pełny czas bieżącej fazy.
- Interval czyszczony w `useEffect` cleanup przy unmount/zmianie `isRunning`.

### Dźwięk końca fazy

W projekcie nie ma dziś żadnych plików audio. Zamiast dokładać binarny
asset, dźwięk generowany jest w locie przez Web Audio API — krótki sygnał
(`AudioContext` + `OscillatorNode`, ok. 200 ms, pojedynczy ton). Funkcja
pomocnicza `playChime()` w `useFocusTimer/playChime.ts`, wywoływana przy
przejściu fazy.

## Komponent `FocusTimerWidget`

Nowy folder: `frontend/src/components/dashboard/today/focusTimerWidget/`
(`index.tsx`, `index.test.tsx`). Zastępuje `PlaceholderProgressWidget`
we wszystkich miejscach użycia w `today/index.tsx` (desktop i mobile) —
`placeholderProgressWidget/` jest usuwany całkowicie.

### Wygląd

Ten sam format co `ProgressRingCard` (kwadrat, `rounded-3xl border
border-border bg-card p-4 shadow-sm`, `flex-1`), ale z **własną,
równoległą implementacją pierścienia SVG** (nie reużywa
`ProgressRingCard`) — kontrakt tamtego komponentu (`total: number, label:
string`, statyczna wartość) nie pasuje do tykającego co sekundę,
kolorowanego wg fazy odliczania. Współdzielona jest tylko geometria/wzorzec
wizualny (te same stałe `RADIUS`/`STROKE_WIDTH`, ten sam SVG viewBox), nie
kod.

- Wypełnienie pierścienia: `secondsRemaining / duration bieżącej fazy` —
  pełny na starcie fazy, pustoszeje w miarę upływu czasu.
- Kolor łuku: `[color:var(--accent-brand)]` w fazie `work`,
  `[color:var(--accent)]` w fazie `break`.
- Środek pierścienia (nakładka `absolute inset-0`): duży `MM:SS`
  (`font-display text-2xl font-medium text-foreground`) nad etykietą fazy
  (`text-xs text-muted-foreground`, `t("focusTimer.work")` /
  `t("focusTimer.break")`).
- Cały pierścień to `<button>` (`aria-label` = "Start"/"Pauza" zależnie od
  `isRunning`) przełączający `toggle()` po kliknięciu.
- Mała ikonka resetu (`RotateCcw` z lucide-react) w prawym górnym rogu
  karty, osobny `<button aria-label="Resetuj">` wywołujący `reset()`.

## Integracja w `today/index.tsx`

- Usunięcie importu i użyć `PlaceholderProgressWidget` (desktop + mobile).
- Usunięcie folderu `today/placeholderProgressWidget/`.
- Dodanie importu i użyć `FocusTimerWidget` w dokładnie tych samych
  miejscach (ten sam wiersz `flex gap-4` obok `TaskProgressWidget`).

## i18n

Nowy blok `dashboard.today.focusTimer` w `pl`/`en` `dashboard.json`:

```json
"focusTimer": {
  "work": "Praca",
  "break": "Przerwa",
  "start": "Start",
  "pause": "Pauza",
  "reset": "Resetuj"
}
```

## Testy

- `useFocusTimer/index.test.tsx` z `vi.useFakeTimers()`: odliczanie w dół co
  sekundę; przejście `work → break` po osiągnięciu 0 (z resetem
  `secondsRemaining` do czasu przerwy i kontynuacją działania);
  `toggle()` start/pauza; `reset()` przywraca pełny czas bieżącej fazy i
  zatrzymuje.
- `focusTimerWidget/index.test.tsx` z zamockowanym `useFocusTimer`:
  renderowanie `MM:SS` i etykiety fazy; kliknięcie pierścienia wywołuje
  `toggle()`; kliknięcie ikonki resetu wywołuje `reset()`; poprawny
  `aria-label` zależnie od `isRunning`.

## Poza zakresem

- Edytowalne czasy trwania faz (25/5 na sztywno).
- Persystencja stanu między odświeżeniami/przełączaniem mobile↔desktop
  layoutu.
- Powiązanie z konkretnym zadaniem z listy.
- Statystyki/historia ukończonych sesji Pomodoro.
