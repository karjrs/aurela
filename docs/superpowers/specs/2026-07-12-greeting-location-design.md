# Lokalizacja użytkownika obok Greeting

## Cel

Na dashboardzie, obok istniejącego bloku `Greeting` (powitanie + data), wyświetlić
informację o lokalizacji, w której aktualnie znajduje się użytkownik.

## Źródło danych

1. **Pozycja geograficzna** — Browser Geolocation API (`navigator.geolocation.getCurrentPosition`).
   Wymaga zgody użytkownika (natywny prompt przeglądarki).
2. **Reverse geocoding** — OpenStreetMap Nominatim
   (`https://nominatim.openstreetmap.org/reverse`), bez klucza API. Z odpowiedzi
   wyciągamy miasto (`address.city || address.town || address.village`) oraz kraj
   (`address.country`).

## Architektura

### Hook `useUserLocation`

Nowy plik: `src/hooks/dashboard/useUserLocation.ts`.

- Wywoływany raz przy mount komponentu, który go używa.
- Wewnętrznie:
  1. Sprawdza dostępność `navigator.geolocation`. Jeśli brak — natychmiast `status: "error"`.
  2. Wywołuje `getCurrentPosition`. Błąd (w tym odmowa uprawnień) → `status: "error"`.
  3. Po sukcesie robi `fetch` do Nominatim z uzyskanymi `lat`/`lon`. Błąd sieci lub
     brak danych adresowych → `status: "error"`.
  4. Po sukcesie geokodowania → `status: "success"`, `label: "<Miasto>, <Kraj>"`.
- Zwracany kształt:
  ```ts
  type UserLocationState =
    | { status: "loading" }
    | { status: "success"; label: string }
    | { status: "error" };
  ```
- Brak retry, brak cache między montowaniami — zakres tego zadania to jednorazowe
  sprawdzenie lokalizacji przy wejściu na dashboard.

### Komponent `Greeting`

Plik: `src/components/dashboard/today/greeting/index.tsx`.

- Layout zmienia się z pojedynczej kolumny na `flex items-start justify-between gap-4`:
  - lewa strona: istniejący blok (powitanie + `dateLabel`), bez zmian,
  - prawa strona: nowy element lokalizacji.
- Zachowanie prawej strony wg `status`:
  - `loading` → nic nie renderujemy (brak skeletonu/spinnera).
  - `success` → ikona `MapPin` (lucide-react) + `label`, styl `text-sm text-muted-foreground`
    spójny z istniejącym `dateLabel`.
  - `error` → sam tekst komunikatu błędu (bez ikony), ten sam styl przytłumiony.

## i18n

Nowy klucz w namespace `dashboard.today.location`:

- `error`: komunikat o niedostępności lokalizacji.

Dodać do `src/i18n/pl/dashboard.json` i `src/i18n/en/dashboard.json`.

## Testowanie

Testy jednostkowe dla `useUserLocation` (mockując `navigator.geolocation` i globalny `fetch`):

1. Sukces — geolokalizacja i geocoding zwracają dane → `status: "success"` z poprawnym `label`.
2. Odmowa uprawnień — `getCurrentPosition` wywołuje `error callback` → `status: "error"`.
3. Błąd sieci przy reverse geocodingu → `status: "error"`.

## Poza zakresem

- Cache'owanie lokalizacji między sesjami/montowaniami.
- Możliwość ręcznej edycji/nadpisania lokalizacji przez użytkownika.
- Obsługa wielu dostawców geocodingu / fallback między nimi.
