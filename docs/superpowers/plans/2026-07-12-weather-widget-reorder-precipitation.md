# Weather Widget Reorder + Precipitation Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `WeatherWidget` above the progress-ring row in `today/index.tsx`,
and extend the hourly weather forecast with precipitation chance (%) and
rain amount (mm), shown as a small line under each hourly forecast card.

**Architecture:** `parseWeatherResponse` maps two new Open-Meteo hourly
fields into a new `HourlyWeatherCondition` type (extends the existing
`WeatherCondition` with `precipitationProbability` and `precipitation`).
`useWeather`'s fetch URL requests the two new hourly variables. `WeatherWidget`'s
`HourlyForecast` sub-component renders the extra line conditionally. The
layout change in `today/index.tsx` is a pure JSX reorder — no new state or
props.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS,
Vitest + Testing Library, Biome, Open-Meteo REST API.

## Global Constraints

- Widget card chrome and existing formatting conventions (no i18n needed for
  numeric/symbol formatting, matching how temperature is rendered as
  `{Math.round(condition.temperature)}°` today) stay unchanged.
- `CurrentWeather` (the "now" section) is out of scope — no precipitation
  data added there.
- The precipitation line only renders when `precipitationProbability > 0`.
- Run `cd frontend && npx vitest run` and `npx biome check <changed files>`
  before every commit that touches source files.

---

### Task 1: Extend weather types and `parseWeatherResponse`

**Files:**
- Modify: `frontend/src/hooks/dashboard/useWeather/types.ts`
- Modify: `frontend/src/hooks/dashboard/useWeather/parseWeatherResponse.ts`
- Test: `frontend/src/hooks/dashboard/useWeather/parseWeatherResponse.test.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `HourlyWeatherCondition` type (`WeatherCondition &
  { precipitationProbability: number; precipitation: number }`), and
  `WeatherData.hourly: HourlyWeatherCondition[]`. Consumed by Task 2
  (`useWeather`'s `OpenMeteoResponse.hourly` shape already lives in
  `parseWeatherResponse.ts`, no separate change needed there) and Task 3
  (`WeatherWidget`'s `HourlyForecast` prop type).

- [ ] **Step 1: Update the test fixture and assertions (failing test)**

Replace the full contents of
`frontend/src/hooks/dashboard/useWeather/parseWeatherResponse.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import { parseWeatherResponse } from "./parseWeatherResponse";

const hours = Array.from({ length: 24 }, (_, i) => i);

const rawResponse = {
  current: { time: "2026-07-12T09:00", temperature_2m: 21.4, weather_code: 1 },
  hourly: {
    time: hours.map((h) => `2026-07-12T${String(h).padStart(2, "0")}:00`),
    temperature_2m: hours.map((h) => 15 + h),
    weather_code: hours.map((h) => h % 4),
    precipitation_probability: hours.map((h) => (h === 10 ? 40 : 0)),
    precipitation: hours.map((h) => (h === 10 ? 1.2 : 0)),
  },
};

describe("parseWeatherResponse", () => {
  it("returns the current condition unchanged", () => {
    const result = parseWeatherResponse(
      rawResponse,
      new Date("2026-07-12T09:30"),
    );

    expect(result.current).toEqual({
      time: "2026-07-12T09:00",
      temperature: 21.4,
      weatherCode: 1,
    });
  });

  it("returns the next 8 hours after now, excluding the current hour", () => {
    const result = parseWeatherResponse(
      rawResponse,
      new Date("2026-07-12T09:30"),
    );

    expect(result.hourly).toHaveLength(8);
    expect(result.hourly[0]).toEqual({
      time: "2026-07-12T10:00",
      temperature: 25,
      weatherCode: 2,
      precipitationProbability: 40,
      precipitation: 1.2,
    });
    expect(result.hourly.at(-1)).toEqual({
      time: "2026-07-12T17:00",
      temperature: 32,
      weatherCode: 1,
      precipitationProbability: 0,
      precipitation: 0,
    });
  });

  it("returns fewer than 8 hours when less data is available", () => {
    const result = parseWeatherResponse(
      rawResponse,
      new Date("2026-07-12T21:30"),
    );

    expect(result.hourly).toHaveLength(2);
    expect(result.hourly[0].time).toBe("2026-07-12T22:00");
    expect(result.hourly[1].time).toBe("2026-07-12T23:00");
  });

  it("returns an empty array when now is after the last available hour", () => {
    const result = parseWeatherResponse(
      rawResponse,
      new Date("2026-07-13T01:00"),
    );

    expect(result.hourly).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/hooks/dashboard/useWeather/parseWeatherResponse.test.ts`
Expected: FAIL on the "returns the next 8 hours" test — `result.hourly[0]`
is missing `precipitationProbability`/`precipitation` (current
implementation doesn't read those fields, and the raw fixture's TS shape
doesn't have them typed yet either — this will show as either an assertion
mismatch or a TS type error depending on how vitest reports it; both count
as the expected RED for this step).

- [ ] **Step 3: Update the types**

Replace the full contents of
`frontend/src/hooks/dashboard/useWeather/types.ts` with:

```ts
export type WeatherCondition = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type HourlyWeatherCondition = WeatherCondition & {
  precipitationProbability: number;
  precipitation: number;
};

export type WeatherData = {
  current: WeatherCondition;
  hourly: HourlyWeatherCondition[];
};
```

- [ ] **Step 4: Update `parseWeatherResponse`**

Replace the full contents of
`frontend/src/hooks/dashboard/useWeather/parseWeatherResponse.ts` with:

```ts
import type {
  HourlyWeatherCondition,
  WeatherCondition,
  WeatherData,
} from "./types";

export const HOURLY_FORECAST_COUNT = 8;

type OpenMeteoResponse = {
  current: { time: string; temperature_2m: number; weather_code: number };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    precipitation: number[];
  };
};

export const parseWeatherResponse = (
  raw: OpenMeteoResponse,
  now: Date = new Date(),
): WeatherData => {
  const current: WeatherCondition = {
    time: raw.current.time,
    temperature: raw.current.temperature_2m,
    weatherCode: raw.current.weather_code,
  };

  const startIndex = raw.hourly.time.findIndex(
    (time) => new Date(time).getTime() > now.getTime(),
  );
  const from = startIndex === -1 ? raw.hourly.time.length : startIndex;

  const hourly: HourlyWeatherCondition[] = raw.hourly.time
    .slice(from, from + HOURLY_FORECAST_COUNT)
    .map((time, i) => ({
      time,
      temperature: raw.hourly.temperature_2m[from + i],
      weatherCode: raw.hourly.weather_code[from + i],
      precipitationProbability: raw.hourly.precipitation_probability[from + i],
      precipitation: raw.hourly.precipitation[from + i],
    }));

  return { current, hourly };
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/hooks/dashboard/useWeather/parseWeatherResponse.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Lint and commit**

Run: `cd frontend && npx biome check src/hooks/dashboard/useWeather`
Expected: no issues.

```bash
git add frontend/src/hooks/dashboard/useWeather/types.ts frontend/src/hooks/dashboard/useWeather/parseWeatherResponse.ts frontend/src/hooks/dashboard/useWeather/parseWeatherResponse.test.ts
git commit -m "feat: parse hourly precipitation chance and amount from Open-Meteo"
```

---

### Task 2: Request precipitation fields from Open-Meteo

**Files:**
- Modify: `frontend/src/hooks/dashboard/useWeather/index.ts:20`
- Test: `frontend/src/hooks/dashboard/useWeather/index.test.tsx`

**Interfaces:**
- Consumes: `parseWeatherResponse` from Task 1 (already updated to read the
  new fields; this task only changes what the fetch URL requests, which
  must match the fields `parseWeatherResponse` now reads).
- Produces: nothing new consumed by later tasks — `useWeather`'s public
  return shape (`{ data, status, isFetching, refetch }`) is unchanged.

- [ ] **Step 1: Add a failing test asserting the new URL fields**

The existing tests in
`frontend/src/hooks/dashboard/useWeather/index.test.tsx` only assert on the
`latitude=` substring, not the `hourly=` query value. Add a new test inside
the `describe("useWeather", ...)` block (after the "fetches with the Warsaw
fallback coordinates" test), following the same pattern:

```tsx
  it("requests precipitation chance and amount in the hourly params", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => rawResponse });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        "hourly=temperature_2m,weather_code,precipitation_probability,precipitation",
      ),
    );
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/hooks/dashboard/useWeather/index.test.tsx`
Expected: FAIL on the new test — the fetched URL's `hourly=` value is still
`temperature_2m,weather_code`, not matching the expected substring.

- [ ] **Step 3: Update the fetch URL**

In `frontend/src/hooks/dashboard/useWeather/index.ts`, change line 20 from:

```ts
  const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=auto`;
```

to:

```ts
  const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&timezone=auto`;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/hooks/dashboard/useWeather/index.test.tsx`
Expected: PASS (all tests in this file, including the new one).

- [ ] **Step 5: Lint and commit**

Run: `cd frontend && npx biome check src/hooks/dashboard/useWeather/index.ts`
Expected: no issues.

```bash
git add frontend/src/hooks/dashboard/useWeather/index.ts frontend/src/hooks/dashboard/useWeather/index.test.tsx
git commit -m "feat: request precipitation chance and amount from Open-Meteo"
```

---

### Task 3: Show precipitation in `WeatherWidget`'s hourly forecast

**Files:**
- Modify: `frontend/src/components/dashboard/today/weatherWidget/index.tsx`
- Test: `frontend/src/components/dashboard/today/weatherWidget/index.test.tsx`

**Interfaces:**
- Consumes: `HourlyWeatherCondition` type from Task 1
  (`import type { HourlyWeatherCondition } from "@hooks/dashboard/useWeather/types";`).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add failing test cases**

In `frontend/src/components/dashboard/today/weatherWidget/index.test.tsx`,
the existing `hourly` fixture (near the top of the file) currently looks
like:

```ts
const hourly = Array.from({ length: 8 }, (_, i) => ({
  time: `2026-07-12T${10 + i}:00`,
  temperature: 30 + i,
  weatherCode: 1,
}));
```

Replace it with:

```ts
const hourly = Array.from({ length: 8 }, (_, i) => ({
  time: `2026-07-12T${10 + i}:00`,
  temperature: 30 + i,
  weatherCode: 1,
  precipitationProbability: i === 0 ? 40 : 0,
  precipitation: i === 0 ? 1.2 : 0,
}));
```

Then add two new test cases inside the existing `describe("WeatherWidget", () => { ... })`
block (alongside the current success-case tests), using the same
`useUserLocationMock`/`useWeatherMock` setup pattern already in the file:

```tsx
  it("shows the precipitation chance and amount for hours with rain", () => {
    useUserLocationMock.mockReturnValue({
      status: "success",
      label: "Warszawa, Polska",
    });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: {
        current: { time: "2026-07-12T09:00", temperature: 21.4, weatherCode: 1 },
        hourly,
      },
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("40% • 1.2mm")).toBeInTheDocument();
  });

  it("hides the precipitation line for hours with no rain chance", () => {
    useUserLocationMock.mockReturnValue({
      status: "success",
      label: "Warszawa, Polska",
    });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: {
        current: { time: "2026-07-12T09:00", temperature: 21.4, weatherCode: 1 },
        hourly,
      },
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.queryByText(/0% • 0.0mm/)).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/components/dashboard/today/weatherWidget/index.test.tsx`
Expected: FAIL on "shows the precipitation chance and amount for hours with
rain" — `screen.getByText("40% • 1.2mm")` not found (component doesn't
render it yet).

- [ ] **Step 3: Update `HourlyForecast` to render the precipitation line**

In `frontend/src/components/dashboard/today/weatherWidget/index.tsx`,
replace the imports and the `HourlyForecast` component:

```tsx
"use client";

import { useUserLocation } from "@hooks/dashboard/useUserLocation";
import { useWeather } from "@hooks/dashboard/useWeather";
import type {
  HourlyWeatherCondition,
  WeatherCondition,
} from "@hooks/dashboard/useWeather/types";
import { cn } from "@utils/helpers/cn";
import { getWeatherIcon } from "@utils/weather";
import { MapPin, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

const formatHour = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const CurrentWeather = ({ condition }: { condition: WeatherCondition }) => {
  const Icon = getWeatherIcon(condition.weatherCode);
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-8 text-[color:var(--accent-brand)]" aria-hidden />
      <span className="font-display text-2xl font-medium text-foreground">
        {Math.round(condition.temperature)}°
      </span>
    </div>
  );
};

const HourlyForecast = ({
  hours,
  label,
}: {
  hours: HourlyWeatherCondition[];
  label: string;
}) => (
  <ul className="flex gap-3 overflow-x-auto pb-1" aria-label={label}>
    {hours.map((hour) => {
      const Icon = getWeatherIcon(hour.weatherCode);
      return (
        <li
          key={hour.time}
          className="flex shrink-0 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-center"
        >
          <span className="text-xs text-muted-foreground">
            {formatHour(hour.time)}
          </span>
          <Icon className="size-5 text-muted-foreground" aria-hidden />
          <span className="text-xs font-medium text-foreground">
            {Math.round(hour.temperature)}°
          </span>
          {hour.precipitationProbability > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {Math.round(hour.precipitationProbability)}% •{" "}
              {hour.precipitation.toFixed(1)}mm
            </span>
          )}
        </li>
      );
    })}
  </ul>
);
```

(The rest of the file — the `WeatherWidget` export itself — is unchanged;
only the imports and `HourlyForecast` are replaced.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/components/dashboard/today/weatherWidget/index.test.tsx`
Expected: PASS (all tests in this file, including the two new ones).

- [ ] **Step 5: Lint and commit**

Run: `cd frontend && npx biome check src/components/dashboard/today/weatherWidget`
Expected: no issues.

```bash
git add frontend/src/components/dashboard/today/weatherWidget
git commit -m "feat: show hourly precipitation chance and amount in WeatherWidget"
```

---

### Task 4: Move `WeatherWidget` above the progress-ring row

**Files:**
- Modify: `frontend/src/components/dashboard/today/index.tsx:121-148`

**Interfaces:**
- Consumes: nothing new — pure JSX reorder of existing components.
- Produces: nothing consumed by later tasks (final task in this plan).

- [ ] **Step 1: Reorder the desktop column**

In `frontend/src/components/dashboard/today/index.tsx`, replace:

```tsx
        {isDesktop && (
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="flex gap-4">
              <TaskProgressWidget tasks={sortedTasks} />
              <PlaceholderProgressWidget />
            </div>
            <WeatherWidget />
            <ListView
              tasks={sortedTasks}
              highlightId={highlightId}
              blockRefs={blockRefs}
              onToggleDone={toggleTaskDone}
              onEdit={handleStartEdit}
              onRemove={removeTask}
            />
          </div>
        )}
```

with:

```tsx
        {isDesktop && (
          <div className="md:col-span-1 flex flex-col gap-4">
            <WeatherWidget />
            <div className="flex gap-4">
              <TaskProgressWidget tasks={sortedTasks} />
              <PlaceholderProgressWidget />
            </div>
            <ListView
              tasks={sortedTasks}
              highlightId={highlightId}
              blockRefs={blockRefs}
              onToggleDone={toggleTaskDone}
              onEdit={handleStartEdit}
              onRemove={removeTask}
            />
          </div>
        )}
```

- [ ] **Step 2: Reorder the mobile block**

Replace:

```tsx
      {!isDesktop && (
        <>
          <div className="flex gap-4">
            <TaskProgressWidget tasks={sortedTasks} />
            <PlaceholderProgressWidget />
          </div>
          <WeatherWidget />
        </>
      )}
```

with:

```tsx
      {!isDesktop && (
        <>
          <WeatherWidget />
          <div className="flex gap-4">
            <TaskProgressWidget tasks={sortedTasks} />
            <PlaceholderProgressWidget />
          </div>
        </>
      )}
```

- [ ] **Step 3: Run the full test suite**

Run: `cd frontend && npx vitest run`
Expected: all test files pass, **except** the pre-existing unrelated
failure in `src/components/dashboard/today/greeting/index.test.tsx`
("renders the greeting with the user's name"), which predates this plan and
is out of scope (already flagged to and accepted by the project owner).

- [ ] **Step 4: Typecheck and lint**

Run: `cd frontend && npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `cd frontend && npx biome check src/components/dashboard/today/index.tsx`
Expected: no issues.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/dashboard/today/index.tsx
git commit -m "feat: move WeatherWidget above the progress-ring row"
```
