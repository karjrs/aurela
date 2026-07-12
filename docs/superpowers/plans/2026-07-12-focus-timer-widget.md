# FocusTimerWidget (Pomodoro) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone Pomodoro focus timer (25 min work / 5 min break,
fixed) as a square ring widget replacing `PlaceholderProgressWidget` in the
right-column ring row, tapping the ring to start/pause and a small corner
button to reset.

**Architecture:** A new `useFocusTimer` hook owns all countdown state and
`setInterval` ticking, phase switching, and a synthesized end-of-phase chime
(Web Audio API — no audio asset files). A new `FocusTimerWidget` component
consumes the hook and renders its own small SVG ring (same geometry pattern
as `ProgressRingCard`, but a separate implementation since the value
semantics differ — ticking countdown with phase-based color vs a static
count). `PlaceholderProgressWidget` is deleted and replaced by
`FocusTimerWidget` at both of its call sites in `today/index.tsx`.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS,
next-intl, Vitest + Testing Library (`vi.useFakeTimers()`), Biome,
`lucide-react` (`RotateCcw` icon), Web Audio API.

## Global Constraints

- Widget card chrome matches the existing ring convention: `relative
  aspect-square flex-1 rounded-3xl border border-border bg-card p-4
  shadow-sm` (see `progressRingCard/index.tsx`).
- No persistence — timer state is `useState`-only and resets on reload,
  consistent with `useDashboardTasks`.
- Work phase duration: `25 * 60` seconds. Break phase duration: `5 * 60`
  seconds. Not configurable in the UI.
- `dashboard.today` i18n namespace, `"use client"` on all new components.
- Run `cd frontend && npx vitest run` and `npx biome check <changed files>`
  before every commit that touches source files.

---

### Task 1: `useFocusTimer` hook — state, ticking, phase switching

**Files:**
- Create: `frontend/src/hooks/dashboard/useFocusTimer/types.ts`
- Create: `frontend/src/hooks/dashboard/useFocusTimer/playChime.ts`
- Create: `frontend/src/hooks/dashboard/useFocusTimer/index.ts`
- Test: `frontend/src/hooks/dashboard/useFocusTimer/index.test.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `useFocusTimer()` hook returning `FocusTimerState`, and
  `WORK_DURATION_SECONDS` / `BREAK_DURATION_SECONDS` constants. Consumed by
  Task 2 (`FocusTimerWidget`) via
  `import { useFocusTimer } from "@hooks/dashboard/useFocusTimer";`.
  ```ts
  export type FocusPhase = "work" | "break";

  export type FocusTimerState = {
    phase: FocusPhase;
    secondsRemaining: number;
    isRunning: boolean;
    toggle: () => void;
    reset: () => void;
  };
  ```
  `playChime` is consumed only internally by this hook (not re-exported).

- [ ] **Step 1: Write the types**

Create `frontend/src/hooks/dashboard/useFocusTimer/types.ts`:

```ts
export type FocusPhase = "work" | "break";

export type FocusTimerState = {
  phase: FocusPhase;
  secondsRemaining: number;
  isRunning: boolean;
  toggle: () => void;
  reset: () => void;
};
```

- [ ] **Step 2: Write a no-op-safe chime helper**

Create `frontend/src/hooks/dashboard/useFocusTimer/playChime.ts`:

```ts
export const playChime = () => {
  if (typeof window === "undefined" || !window.AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.2, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
};
```

This file has no test — it's a thin, side-effecting wrapper around a
browser API with no meaningful assertions to make in jsdom (no real audio
output to inspect). It's exercised indirectly by Task 1 Step 6's phase-switch
test via a spy (see that step).

- [ ] **Step 3: Write the failing test for countdown ticking**

Create `frontend/src/hooks/dashboard/useFocusTimer/index.test.tsx`:

```tsx
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFocusTimer } from ".";

vi.mock("./playChime", () => ({ playChime: vi.fn() }));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useFocusTimer", () => {
  it("starts paused in the work phase with the full work duration", () => {
    const { result } = renderHook(() => useFocusTimer());

    expect(result.current.phase).toBe("work");
    expect(result.current.secondsRemaining).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
  });

  it("counts down one second per tick once toggled on", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(3000));

    expect(result.current.secondsRemaining).toBe(25 * 60 - 3);
    expect(result.current.isRunning).toBe(true);
  });

  it("does not count down while paused", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => vi.advanceTimersByTime(5000));

    expect(result.current.secondsRemaining).toBe(25 * 60);
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/hooks/dashboard/useFocusTimer/index.test.tsx`
Expected: FAIL — `Failed to resolve import "."` (hook does not exist yet).

- [ ] **Step 5: Implement the hook (ticking + toggle, no phase switch yet)**

Create `frontend/src/hooks/dashboard/useFocusTimer/index.ts`:

```ts
"use client";

import { useEffect, useState } from "react";
import { playChime } from "./playChime";
import type { FocusPhase, FocusTimerState } from "./types";

export const WORK_DURATION_SECONDS = 25 * 60;
export const BREAK_DURATION_SECONDS = 5 * 60;

const durationFor = (phase: FocusPhase) =>
  phase === "work" ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;

export const useFocusTimer = (): FocusTimerState => {
  const [phase, setPhase] = useState<FocusPhase>("work");
  const [secondsRemaining, setSecondsRemaining] = useState(
    WORK_DURATION_SECONDS,
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsRemaining((current) => {
        if (current > 1) return current - 1;

        playChime();
        setPhase((currentPhase) =>
          currentPhase === "work" ? "break" : "work",
        );
        return 0;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    setSecondsRemaining(durationFor(phase));
  }, [phase]);

  const toggle = () => setIsRunning((current) => !current);

  const reset = () => {
    setIsRunning(false);
    setSecondsRemaining(durationFor(phase));
  };

  return { phase, secondsRemaining, isRunning, toggle, reset };
};
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/hooks/dashboard/useFocusTimer/index.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Add a failing test for phase switching at zero**

Add to `frontend/src/hooks/dashboard/useFocusTimer/index.test.tsx`, inside
the existing `describe` block:

```tsx
  it("switches to the break phase and keeps running when work reaches zero", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(25 * 60 * 1000));

    expect(result.current.phase).toBe("break");
    expect(result.current.secondsRemaining).toBe(5 * 60);
    expect(result.current.isRunning).toBe(true);
  });

  it("plays a chime when a phase ends", async () => {
    const { playChime } = await import("./playChime");
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(25 * 60 * 1000));

    expect(playChime).toHaveBeenCalledTimes(1);
  });

  it("resets to the full duration of the current phase and pauses", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.reset());

    expect(result.current.secondsRemaining).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
  });
```

- [ ] **Step 8: Run the test to verify it fails or passes**

Run: `cd frontend && npx vitest run src/hooks/dashboard/useFocusTimer/index.test.tsx`
Expected: the phase-switch, chime, and reset tests should already PASS
against the Step 5 implementation (it was written to satisfy this behavior
too) — this step is the verification checkpoint confirming that. If any of
the three new tests fail, fix `index.ts` until all 6 tests pass before
continuing; do not proceed to Step 9 with red tests.

- [ ] **Step 9: Lint and commit**

Run: `cd frontend && npx biome check src/hooks/dashboard/useFocusTimer`
Expected: no issues.

```bash
git add frontend/src/hooks/dashboard/useFocusTimer
git commit -m "feat: add useFocusTimer Pomodoro countdown hook"
```

---

### Task 2: i18n — `focusTimer` messages

**Files:**
- Modify: `frontend/src/i18n/pl/dashboard.json`
- Modify: `frontend/src/i18n/en/dashboard.json`

**Interfaces:**
- Consumes: nothing.
- Produces: translation keys `dashboard.today.focusTimer.{work,break,start,pause,reset}`,
  consumed by Task 3 (`FocusTimerWidget`).

- [ ] **Step 1: Add the block to the Polish messages**

In `frontend/src/i18n/pl/dashboard.json`, insert after the `"progress"` block
(after the line `},` that closes it, before `"viewToggle"`):

```json
    "focusTimer": {
      "work": "Praca",
      "break": "Przerwa",
      "start": "Start",
      "pause": "Pauza",
      "reset": "Resetuj"
    },
```

- [ ] **Step 2: Add the block to the English messages**

In `frontend/src/i18n/en/dashboard.json`, in the same position:

```json
    "focusTimer": {
      "work": "Work",
      "break": "Break",
      "start": "Start",
      "pause": "Pause",
      "reset": "Reset"
    },
```

- [ ] **Step 3: Validate JSON syntax**

Run: `cd frontend && node -e "JSON.parse(require('fs').readFileSync('src/i18n/pl/dashboard.json'))" && node -e "JSON.parse(require('fs').readFileSync('src/i18n/en/dashboard.json'))"`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/i18n/pl/dashboard.json frontend/src/i18n/en/dashboard.json
git commit -m "feat: add focusTimer i18n messages"
```

---

### Task 3: `FocusTimerWidget` component

**Files:**
- Create: `frontend/src/components/dashboard/today/focusTimerWidget/index.tsx`
- Test: `frontend/src/components/dashboard/today/focusTimerWidget/index.test.tsx`

**Interfaces:**
- Consumes: `useFocusTimer` from Task 1
  (`import { useFocusTimer } from "@hooks/dashboard/useFocusTimer";`),
  i18n keys from Task 2 (`t("focusTimer.work")` etc., namespace
  `"dashboard.today"`).
- Produces: `FocusTimerWidget` component (no props), imported by Task 4 as
  `import { FocusTimerWidget } from "./focusTimerWidget";`.

- [ ] **Step 1: Write the failing test**

Create
`frontend/src/components/dashboard/today/focusTimerWidget/index.test.tsx`:

```tsx
import dashboard from "@i18n/pl/dashboard.json";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { FocusTimerWidget } from ".";

const { useFocusTimerMock } = vi.hoisted(() => ({
  useFocusTimerMock: vi.fn(),
}));

vi.mock("@hooks/dashboard/useFocusTimer", () => ({
  useFocusTimer: useFocusTimerMock,
}));

const messages = { dashboard };

const renderWidget = () =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <FocusTimerWidget />
    </NextIntlClientProvider>,
  );

describe("FocusTimerWidget", () => {
  it("shows the formatted remaining time and the work phase label while paused", () => {
    useFocusTimerMock.mockReturnValue({
      phase: "work",
      secondsRemaining: 25 * 60,
      isRunning: false,
      toggle: vi.fn(),
      reset: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getByText("Praca")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("shows the break phase label and a pause action while running", () => {
    useFocusTimerMock.mockReturnValue({
      phase: "break",
      secondsRemaining: 65,
      isRunning: true,
      toggle: vi.fn(),
      reset: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("01:05")).toBeInTheDocument();
    expect(screen.getByText("Przerwa")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pauza" })).toBeInTheDocument();
  });

  it("calls toggle when the ring button is clicked", () => {
    const toggle = vi.fn();
    useFocusTimerMock.mockReturnValue({
      phase: "work",
      secondsRemaining: 25 * 60,
      isRunning: false,
      toggle,
      reset: vi.fn(),
    });

    renderWidget();

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it("calls reset when the reset button is clicked", () => {
    const reset = vi.fn();
    useFocusTimerMock.mockReturnValue({
      phase: "work",
      secondsRemaining: 25 * 60,
      isRunning: false,
      toggle: vi.fn(),
      reset,
    });

    renderWidget();

    fireEvent.click(screen.getByRole("button", { name: "Resetuj" }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/components/dashboard/today/focusTimerWidget/index.test.tsx`
Expected: FAIL — `Failed to resolve import "."` (component does not exist
yet).

- [ ] **Step 3: Implement the component**

Create `frontend/src/components/dashboard/today/focusTimerWidget/index.tsx`:

```tsx
"use client";

import {
  BREAK_DURATION_SECONDS,
  useFocusTimer,
  WORK_DURATION_SECONDS,
} from "@hooks/dashboard/useFocusTimer";
import type { FocusPhase } from "@hooks/dashboard/useFocusTimer/types";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

const RADIUS = 42;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const durationFor = (phase: FocusPhase) =>
  phase === "work" ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;

export const FocusTimerWidget = () => {
  const t = useTranslations("dashboard.today");
  const { phase, secondsRemaining, isRunning, toggle, reset } =
    useFocusTimer();

  const progress = secondsRemaining / durationFor(phase);
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const phaseColorClass =
    phase === "work"
      ? "stroke-[color:var(--accent-brand)]"
      : "stroke-[color:var(--accent)]";

  return (
    <div className="relative aspect-square flex-1 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <button
        type="button"
        onClick={toggle}
        aria-label={t(isRunning ? "focusTimer.pause" : "focusTimer.start")}
        className="absolute inset-4"
      >
        <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
            className="stroke-muted-foreground/20"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={`${phaseColorClass} transition-[stroke-dashoffset] duration-500`}
          />
        </svg>
      </button>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-medium text-foreground">
          {formatTime(secondsRemaining)}
        </span>
        <span className="text-xs text-muted-foreground">
          {t(phase === "work" ? "focusTimer.work" : "focusTimer.break")}
        </span>
      </div>

      <button
        type="button"
        onClick={reset}
        aria-label={t("focusTimer.reset")}
        className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
      >
        <RotateCcw className="size-3.5" aria-hidden />
      </button>
    </div>
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/components/dashboard/today/focusTimerWidget/index.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Lint and commit**

Run: `cd frontend && npx biome check src/components/dashboard/today/focusTimerWidget`
Expected: no issues.

```bash
git add frontend/src/components/dashboard/today/focusTimerWidget
git commit -m "feat: add FocusTimerWidget Pomodoro ring UI"
```

---

### Task 4: Replace `PlaceholderProgressWidget` with `FocusTimerWidget`

**Files:**
- Modify: `frontend/src/components/dashboard/today/index.tsx`
- Delete: `frontend/src/components/dashboard/today/placeholderProgressWidget/`
  (`index.tsx`, `index.test.tsx`)

**Interfaces:**
- Consumes: `FocusTimerWidget` from Task 3.
- Produces: nothing consumed by later tasks (final task in this plan).

- [ ] **Step 1: Delete the placeholder widget folder**

```bash
rm -rf frontend/src/components/dashboard/today/placeholderProgressWidget
```

- [ ] **Step 2: Swap the import**

In `frontend/src/components/dashboard/today/index.tsx`, change:

```tsx
import { PlaceholderProgressWidget } from "./placeholderProgressWidget";
```

to:

```tsx
import { FocusTimerWidget } from "./focusTimerWidget";
```

and move this import to its alphabetically correct position among the local
`./`-prefixed imports — `focusTimerWidget` sorts between `consts` and
`greeting`. The full corrected local-import block:

```tsx
import { CalendarView } from "./calendarView";
import { INITIAL_TASKS } from "./consts";
import { FocusTimerWidget } from "./focusTimerWidget";
import { Greeting } from "./greeting";
import { ListView } from "./listView";
import { NextTaskCard } from "./nextTaskCard";
import { SunArc } from "./sunArc";
import { TaskForm } from "./taskForm";
import { TaskProgressWidget } from "./taskProgressWidget";
import type { Task, TaskInput, ViewMode } from "./types";
import { ViewToggle } from "./viewToggle";
import { WeatherWidget } from "./weatherWidget";
```

- [ ] **Step 3: Replace both usages**

Replace both occurrences of `<PlaceholderProgressWidget />` in this file
(desktop column and mobile block) with `<FocusTimerWidget />`. After the
change, both ring rows read:

```tsx
            <div className="flex gap-4">
              <TaskProgressWidget tasks={sortedTasks} />
              <FocusTimerWidget />
            </div>
```

- [ ] **Step 4: Run the full test suite**

Run: `cd frontend && npx vitest run`
Expected: all test files pass, **except** the pre-existing, already-flagged
failures unrelated to this plan: the `greeting/index.test.tsx` name-format
test, and the 3 `greeting` location tests currently red because of an
in-progress, uncommitted edit to `greeting/index.tsx` that the project owner
asked to leave alone. Do not attempt to fix those as part of this plan.

- [ ] **Step 5: Typecheck and lint**

Run: `cd frontend && npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `cd frontend && npx biome check src/components/dashboard/today/index.tsx`
Expected: no issues.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/dashboard/today/index.tsx frontend/src/components/dashboard/today/placeholderProgressWidget
git commit -m "feat: replace PlaceholderProgressWidget with FocusTimerWidget"
```
