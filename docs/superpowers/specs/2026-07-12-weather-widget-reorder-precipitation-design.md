# Przeniesienie WeatherWidget nad pierścienie + dane o opadach

## Cel

1. W `today/index.tsx` przenieść `WeatherWidget` nad wiersz
   `TaskProgressWidget`/`PlaceholderProgressWidget` (obecnie jest pod nim), na
   desktopie i na mobile.
2. Rozszerzyć dane pogodowe o szansę opadów (%) i ilość deszczu (mm) dla
   prognozy godzinowej, i pokazać je w `WeatherWidget`.

## Layout — `today/index.tsx`

Desktop (`md:col-span-1`): kolejność zmienia się z
`TaskProgressWidget+PlaceholderProgressWidget → WeatherWidget → ListView` na
`WeatherWidget → TaskProgressWidget+PlaceholderProgressWidget → ListView`.

Mobile: analogicznie, `WeatherWidget` przed wierszem dwóch pierścieni.

## Dane — `useWeather`

Open-Meteo udostępnia `precipitation_probability` (%) i `precipitation` (mm)
tylko jako zmienne godzinowe (`hourly`) — nie ma ich w bloku `current`
(pogoda "teraz" to odczyt, nie prognoza z szansą). Zamiast dokładać te pola
do wspólnego `WeatherCondition` z pustym znaczeniem w `current`, wydzielam
osobny typ dla godzin prognozy:

```ts
// frontend/src/hooks/dashboard/useWeather/types.ts
export type WeatherCondition = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type HourlyWeatherCondition = WeatherCondition & {
  precipitationProbability: number; // 0-100
  precipitation: number; // mm
};

export type WeatherData = {
  current: WeatherCondition;
  hourly: HourlyWeatherCondition[];
};
```

- `useWeather/index.ts`: parametr `hourly` w URL Open-Meteo rozszerzony do
  `temperature_2m,weather_code,precipitation_probability,precipitation`.
  Parametr `current` bez zmian (tylko `temperature_2m,weather_code`).
- `parseWeatherResponse.ts`: `OpenMeteoResponse.hourly` dostaje pola
  `precipitation_probability: number[]` i `precipitation: number[]`; mapping
  do `HourlyWeatherCondition` dokłada `precipitationProbability` i
  `precipitation` dla każdej godziny w tym samym oknie (`from, from + 8`),
  które już wybiera pozostałe pola.

## UI — `weatherWidget/index.tsx`

`HourlyForecast` przyjmuje `hours: HourlyWeatherCondition[]` (zamiast
`WeatherCondition[]`). W każdej karcie godzinowej, pod temperaturą, dodana
jedna wyciszona linijka (`text-[10px] text-muted-foreground`):

```
{Math.round(hour.precipitationProbability)}% • {hour.precipitation.toFixed(1)}mm
```

Renderowana **tylko** gdy `hour.precipitationProbability > 0` — karty bez
szansy opadów pozostają tak krótkie jak obecnie (bez dodatkowego wiersza).
`CurrentWeather` (sekcja "teraz") bez zmian — nie pokazuje opadów.

## Testy

- `parseWeatherResponse.test.ts`: fixture `rawResponse.hourly` dostaje
  `precipitation_probability` i `precipitation` (przykładowe wartości, w tym
  co najmniej jedna godzina z `0`); istniejące asercje `toEqual` na
  `result.hourly[...]` rozszerzone o nowe pola.
- `weatherWidget/index.test.tsx`: nowy przypadek — godzina z
  `precipitationProbability > 0` pokazuje linijkę `"40% • 1.2mm"`; godzina z
  `precipitationProbability: 0` nie pokazuje żadnej linijki opadów.

## Poza zakresem

- Szansa opadów/mm w sekcji aktualnej pogody (`CurrentWeather`).
- Zmiana ikony pogodowej w zależności od intensywności opadów.
- Jednostki inne niż mm (np. cale) — brak przełącznika jednostek w projekcie.
