# Przebudowa TaskProgressWidget na kwadrat + placeholder drugiego widgetu

## Kontekst

Istniejący `TaskProgressWidget` ([2026-07-12-task-progress-widget-design.md](2026-07-12-task-progress-widget-design.md))
pokazuje liczbę zaplanowanych zadań obok małego pierścienia postępu w
prostokątnej karcie. Ta przebudowa zmienia układ na kwadratowy, większy
pierścień z liczbą w środku, i dodaje drugi, przykładowy kwadrat obok jako
zasłępkę pod przyszłą metrykę.

## Wydzielony komponent prezentacyjny: `ProgressRingCard`

Nowy folder: `frontend/src/components/dashboard/today/progressRingCard/`
(`index.tsx`, `types.ts`, `index.test.tsx`).

Czysto prezentacyjny, bez zależności od i18n ani od `Task`. Propsy:

```ts
export type ProgressRingCardProps = {
  total: number;
  completed: number;
  label: string;
};
```

- Kontener: kwadratowa karta `aspect-square rounded-3xl border border-border
  bg-card p-4 shadow-sm`, `relative` (do nałożenia tekstu na pierścień).
- Pierścień: SVG wypełniający niemal całą kartę (np. `viewBox="0 0 100 100"`,
  `r=42`, `strokeWidth=10`, większy promień/grubość niż w poprzedniej
  wersji), dwa `<circle>` (tło + łuk proporcjonalny do `completed / total`),
  `stroke-linecap="round"`, kolor łuku `[color:var(--accent-brand)]`.
- Gdy `total === 0`: `progress = 0` (łuk niewypełniony, widoczne tylko tło
  pierścienia) — **bez** osobnego komunikatu tekstowego; liczba "0" i
  `label` w środku wystarczają jako informacja o braku zadań.
- Nakładka tekstowa: `absolute inset-0 flex flex-col items-center
  justify-center`, duża liczba `total` (`font-display text-2xl font-medium
  text-foreground`) nad mniejszym `label` (`text-xs text-muted-foreground`).
- `role="img"` z `aria-label` łączącym liczbę i podpis (np.
  `` `${total} ${label}` ``) na zewnętrznym `<svg>`, żeby czytniki ekranu nie
  czytały samego SVG-a bez kontekstu.

## `TaskProgressWidget` (przebudowa istniejącego)

Zostaje cienką sklejką: liczy `total`/`completed` z `tasks` (bez zmian w
logice), tłumaczy podpis przez ICU plural i renderuje `ProgressRingCard`:

```tsx
const total = tasks.length;
const completed = tasks.filter((task) => task.done).length;
const label = t("progress.label", { count: total });

return <ProgressRingCard total={total} completed={completed} label={label} />;
```

Usunięte: nagłówek `progress.heading`, osobny blok liczby poza pierścieniem,
komunikat `progress.empty`.

## `PlaceholderProgressWidget` (nowy)

Nowy folder: `today/placeholderProgressWidget/` (`index.tsx`,
`index.test.tsx`, bez `types.ts` — brak propsów).

Identyczny wzorzec co `TaskProgressWidget`, ale ze stałymi, przykładowymi
wartościami (`total: 6, completed: 4`) zamiast danych z `useDashboardTasks`.
Używa tego samego klucza i18n `progress.label` z `count: 6`. Czysta
zasłępka wizualna — brak logiki, brak połączenia z prawdziwymi danymi.

## Integracja w `today/index.tsx`

Oba kwadraty w jednym wierszu, nad `WeatherWidget`, i na desktopie, i na
mobile:

```tsx
<div className="flex gap-4">
  <TaskProgressWidget tasks={sortedTasks} />
  <PlaceholderProgressWidget />
</div>
<WeatherWidget />
```

Każdy kwadrat `flex-1` (równy podział szerokości wiersza).

## i18n

`progress.label` zmienia się z prostego stringa na ICU plural zwracający
**sam wyraz** (bez liczby — liczba jest renderowana osobno jako duży numer):

```json
"progress": {
  "label": "{count, plural, one {plan} few {plany} many {planów} other {planu}}"
}
```

en:

```json
"progress": {
  "label": "{count, plural, one {plan} other {plans}}"
}
```

Usunięte klucze: `progress.heading`, `progress.ariaLabel`, `progress.empty`
(zastąpione przez `aria-label` budowany dynamicznie w `ProgressRingCard`
z `total` + `label`).

## Testy

- `progressRingCard/index.test.tsx`: matematyka pierścienia bez i18n
  (statyczne stringi jako `label`) — 0% wypełnienia przy `total: 0`, częściowe
  wypełnienie, pełne wypełnienie (`stroke-dashoffset: 0`), poprawny tekst
  liczby i podpisu w DOM.
- `taskProgressWidget/index.test.tsx`: integracja z prawdziwymi tłumaczeniami
  (`@i18n/pl/dashboard.json`) — poprawna liczba i poprawna odmiana słowa
  "plan"/"plany"/"planów" dla różnych `tasks`.
- `placeholderProgressWidget/index.test.tsx`: renderuje się ze stałymi
  wartościami, poprawny tekst.

## Poza zakresem

- Realne dane/logika dla drugiego widgetu — to czysty placeholder do czasu
  ustalenia, jaką metrykę ma pokazywać.
- Animacja wypełniania pierścienia przy montowaniu.
- Interaktywność pierścieni (klik, tooltip).
