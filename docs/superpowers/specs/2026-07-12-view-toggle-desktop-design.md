# Przełącznik widoku (Kalendarz/Lista) dostępny też na desktopie

## Cel

Dziś `ViewToggle` i tryb listy działają tylko na mobile — desktop zawsze
wymusza kalendarz w głównej treści i dodatkowo pokazuje osobną, kompaktową
`ListView` w prawej kolumnie. Ujednolicić zachowanie: główna treść na
desktopie ma być przełączalna między kalendarzem a listą dokładnie tak jak
na mobile.

## Zmiany w `today/index.tsx`

1. `showCalendar = isDesktop || viewMode === "calendar"` →
   `showCalendar = viewMode === "calendar"`.
2. `showList = !isDesktop && viewMode === "list"` →
   `showList = viewMode === "list"`.
3. `{!isDesktop && <ViewToggle value={viewMode} onChange={setViewMode} />}` →
   `<ViewToggle value={viewMode} onChange={setViewMode} />` (bez warunku).
4. Usunięcie kompaktowej `<ListView>` z prawej kolumny desktopu (blok
   `isDesktop && (...)`, obok `WeatherWidget` i wiersza pierścieni) — jedyna
   lista zadań w aplikacji to teraz ta przełączana w głównej treści.
5. `useDesktop` pozostaje w pliku — nadal używany do rozróżnienia układu
   prawej kolumny (`WeatherWidget` + `TaskProgressWidget`/`FocusTimerWidget`
   obok głównej treści na desktopie vs. pod nią na mobile).

## Testy

W repo nie ma dziś testu dla `today/index.tsx` (duży komponent kompozycyjny
z wieloma zależnościami; poszczególne widgety testowane są osobno). Zmiana
to usunięcie dwóch warunków — weryfikacja przez pełny zestaw testów
(regresja pozostałych plików), `tsc --noEmit` i `biome check`. Brak
możliwości weryfikacji wizualnej w przeglądarce w tym środowisku (brak
Chrome, brak uprawnień do instalacji).

## Poza zakresem

- Zapamiętywanie wybranego trybu widoku między sesjami.
- Zmiana zachowania `CalendarView`/`ListView` samych w sobie.
