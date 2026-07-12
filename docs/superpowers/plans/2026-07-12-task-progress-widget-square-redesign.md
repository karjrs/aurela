# TaskProgressWidget Square Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `TaskProgressWidget` into a square card with a larger progress
ring holding the task count + a pluralized label inside it, extract the ring
visual into a reusable `ProgressRingCard`, and add a `PlaceholderProgressWidget`
square next to it with hardcoded sample data.

**Architecture:** A new presentational component (`ProgressRingCard`) owns the
square card chrome, SVG ring math, and centered text overlay. It takes
`total`/`completed`/`label` as plain props — no i18n, no task knowledge. Two
thin consumer widgets (`TaskProgressWidget`, `PlaceholderProgressWidget`)
compute their own numbers and translated label, then render
`ProgressRingCard`. `today/index.tsx` renders both widgets side by side in a
flex row.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS,
next-intl (ICU MessageFormat), Vitest + Testing Library, Biome.

## Global Constraints

- Widget card chrome matches existing convention: `rounded-3xl border
  border-border bg-card p-4 shadow-sm` (see `weatherWidget/index.tsx`,
  `nextTaskCard/index.tsx`).
- All widgets are `"use client"` and use `useTranslations("dashboard.today")`
  for any translated copy.
- No numeric fraction text (e.g. "3/4") anywhere in the widget — only a plain
  count and a plural word label.
- `ProgressRingCard` itself must not import `next-intl` or `Task` — it is
  purely presentational, taking already-computed `total`, `completed`,
  `label` props.
- i18n keys live in both `frontend/src/i18n/pl/dashboard.json` and
  `frontend/src/i18n/en/dashboard.json` under `today.progress`.
- Run `npx vitest run` and `npx biome check <changed files>` before every
  commit that touches source files.

---

### Task 1: `ProgressRingCard` presentational component

**Files:**
- Create: `frontend/src/components/dashboard/today/progressRingCard/types.ts`
- Create: `frontend/src/components/dashboard/today/progressRingCard/index.tsx`
- Test: `frontend/src/components/dashboard/today/progressRingCard/index.test.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `ProgressRingCard` component and `ProgressRingCardProps` type,
  both imported by Task 3 and Task 4 via
  `../progressRingCard` → `import { ProgressRingCard } from "../progressRingCard";`.
  ```ts
  export type ProgressRingCardProps = {
    total: number;
    completed: number;
    label: string;
  };
  ```

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/dashboard/today/progressRingCard/index.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressRingCard } from ".";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

describe("ProgressRingCard", () => {
  it("renders the total and label inside the ring", () => {
    const { container } = render(
      <ProgressRingCard total={4} completed={2} label="plany" />,
    );

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("plany")).toBeInTheDocument();
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("leaves the ring unfilled when total is 0", () => {
    const { container } = render(
      <ProgressRingCard total={0} completed={0} label="planów" />,
    );

    const progressCircle = container.querySelectorAll("circle")[1];
    expect(progressCircle).toHaveAttribute(
      "stroke-dashoffset",
      String(CIRCUMFERENCE),
    );
  });

  it("fully fills the ring when completed equals total", () => {
    const { container } = render(
      <ProgressRingCard total={3} completed={3} label="plany" />,
    );

    const progressCircle = container.querySelectorAll("circle")[1];
    expect(progressCircle).toHaveAttribute("stroke-dashoffset", "0");
  });

  it("exposes an accessible label combining the total and label", () => {
    render(<ProgressRingCard total={5} completed={2} label="planów" />);

    expect(screen.getByRole("img", { name: "5 planów" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/components/dashboard/today/progressRingCard/index.test.tsx`
Expected: FAIL — `Failed to resolve import "."` (component does not exist yet).

- [ ] **Step 3: Write the types**

Create `frontend/src/components/dashboard/today/progressRingCard/types.ts`:

```ts
export type ProgressRingCardProps = {
  total: number;
  completed: number;
  label: string;
};
```

- [ ] **Step 4: Write the minimal implementation**

Create `frontend/src/components/dashboard/today/progressRingCard/index.tsx`:

```tsx
import type { ProgressRingCardProps } from "./types";

const RADIUS = 42;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ProgressRingCard = ({
  total,
  completed,
  label,
}: ProgressRingCardProps) => {
  const progress = total === 0 ? 0 : completed / total;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="relative aspect-square flex-1 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${total} ${label}`}
      >
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
          className="stroke-[color:var(--accent-brand)] transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-medium text-foreground">
          {total}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/components/dashboard/today/progressRingCard/index.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Lint and commit**

Run: `cd frontend && npx biome check src/components/dashboard/today/progressRingCard`
Expected: no issues.

```bash
git add frontend/src/components/dashboard/today/progressRingCard
git commit -m "feat: add ProgressRingCard presentational component"
```

---

### Task 2: i18n — pluralized `progress.label`, remove obsolete keys

**Files:**
- Modify: `frontend/src/i18n/pl/dashboard.json:50-54`
- Modify: `frontend/src/i18n/en/dashboard.json:50-54`

**Interfaces:**
- Consumes: nothing.
- Produces: translation key `dashboard.today.progress.label`, an ICU plural
  message taking a `count` argument and returning only the plural word (no
  number). Consumed in Task 3 and Task 4 via
  `t("progress.label", { count: total })`.

- [ ] **Step 1: Replace the `progress` block in the Polish messages**

In `frontend/src/i18n/pl/dashboard.json`, replace:

```json
    "progress": {
      "heading": "Dzisiejsze zadania",
      "label": "zaplanowane dziś",
      "ariaLabel": "Postęp ukończonych zadań",
      "empty": "Brak zaplanowanych zadań na dziś"
    },
```

with:

```json
    "progress": {
      "label": "{count, plural, one {plan} few {plany} many {planów} other {planu}}"
    },
```

- [ ] **Step 2: Replace the `progress` block in the English messages**

In `frontend/src/i18n/en/dashboard.json`, replace:

```json
    "progress": {
      "heading": "Today's tasks",
      "label": "planned today",
      "ariaLabel": "Completed tasks progress",
      "empty": "No tasks planned for today"
    },
```

with:

```json
    "progress": {
      "label": "{count, plural, one {plan} other {plans}}"
    },
```

- [ ] **Step 3: Validate JSON syntax**

Run: `cd frontend && node -e "JSON.parse(require('fs').readFileSync('src/i18n/pl/dashboard.json'))" && node -e "JSON.parse(require('fs').readFileSync('src/i18n/en/dashboard.json'))"`
Expected: no output, exit code 0 (both files parse).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/i18n/pl/dashboard.json frontend/src/i18n/en/dashboard.json
git commit -m "feat: pluralize progress label, drop obsolete progress i18n keys"
```

---

### Task 3: Rewrite `TaskProgressWidget` to use `ProgressRingCard`

**Files:**
- Modify: `frontend/src/components/dashboard/today/taskProgressWidget/index.tsx`
- Test: `frontend/src/components/dashboard/today/taskProgressWidget/index.test.tsx` (rewrite)
- Keep as-is: `frontend/src/components/dashboard/today/taskProgressWidget/types.ts`
  (already `{ tasks: Task[] }`, no change needed)

**Interfaces:**
- Consumes: `ProgressRingCard` from Task 1
  (`import { ProgressRingCard } from "../progressRingCard";`), i18n key
  `progress.label` from Task 2, existing `TaskProgressWidgetProps` (`{ tasks:
  Task[] }`) from `./types`.
- Produces: `TaskProgressWidget` component, unchanged export name/path —
  `today/index.tsx` (Task 5) continues importing it from
  `./taskProgressWidget`.

- [ ] **Step 1: Replace the test file**

Replace the full contents of
`frontend/src/components/dashboard/today/taskProgressWidget/index.test.tsx`
with:

```tsx
import dashboard from "@i18n/pl/dashboard.json";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import type { Task } from "../types";
import { TaskProgressWidget } from ".";

const messages = { dashboard };

const makeTask = (overrides: Partial<Task>): Task => ({
  id: "task-1",
  title: "Task",
  hour: 8,
  duration: 0.5,
  done: false,
  emoji: "📋",
  ...overrides,
});

const renderWidget = (tasks: Task[]) =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <TaskProgressWidget tasks={tasks} />
    </NextIntlClientProvider>,
  );

describe("TaskProgressWidget", () => {
  it("shows the total count with the correct Polish plural label", () => {
    const tasks = [
      makeTask({ id: "1", done: true }),
      makeTask({ id: "2", done: true }),
      makeTask({ id: "3", done: false }),
      makeTask({ id: "4", done: false }),
    ];

    renderWidget(tasks);

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("plany")).toBeInTheDocument();
  });

  it("shows zero with the many-form label when there are no tasks", () => {
    renderWidget([]);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("planów")).toBeInTheDocument();
  });

  it("uses the singular label for exactly one task", () => {
    renderWidget([makeTask({ id: "1" })]);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("plan")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/components/dashboard/today/taskProgressWidget/index.test.tsx`
Expected: FAIL — old component still renders `progress.heading`/no plural
label, so `screen.getByText("plany")` etc. won't be found (or the old
`t("progress.heading")` call throws because that key no longer exists after
Task 2).

- [ ] **Step 3: Replace the component implementation**

Replace the full contents of
`frontend/src/components/dashboard/today/taskProgressWidget/index.tsx` with:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ProgressRingCard } from "../progressRingCard";
import type { TaskProgressWidgetProps } from "./types";

export const TaskProgressWidget = ({ tasks }: TaskProgressWidgetProps) => {
  const t = useTranslations("dashboard.today");
  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const label = t("progress.label", { count: total });

  return (
    <ProgressRingCard total={total} completed={completed} label={label} />
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/components/dashboard/today/taskProgressWidget/index.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Lint and commit**

Run: `cd frontend && npx biome check src/components/dashboard/today/taskProgressWidget`
Expected: no issues.

```bash
git add frontend/src/components/dashboard/today/taskProgressWidget
git commit -m "feat: rebuild TaskProgressWidget as a square ring card"
```

---

### Task 4: `PlaceholderProgressWidget`

**Files:**
- Create: `frontend/src/components/dashboard/today/placeholderProgressWidget/index.tsx`
- Test: `frontend/src/components/dashboard/today/placeholderProgressWidget/index.test.tsx`

**Interfaces:**
- Consumes: `ProgressRingCard` from Task 1, i18n key `progress.label` from
  Task 2.
- Produces: `PlaceholderProgressWidget` component (no props), imported by
  Task 5 as `import { PlaceholderProgressWidget } from
  "./placeholderProgressWidget";`.

- [ ] **Step 1: Write the failing test**

Create
`frontend/src/components/dashboard/today/placeholderProgressWidget/index.test.tsx`:

```tsx
import dashboard from "@i18n/pl/dashboard.json";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { PlaceholderProgressWidget } from ".";

const messages = { dashboard };

describe("PlaceholderProgressWidget", () => {
  it("renders fixed sample values with the correct Polish plural label", () => {
    render(
      <NextIntlClientProvider locale="pl" messages={messages}>
        <PlaceholderProgressWidget />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("planów")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd frontend && npx vitest run src/components/dashboard/today/placeholderProgressWidget/index.test.tsx`
Expected: FAIL — `Failed to resolve import "."` (component does not exist yet).

- [ ] **Step 3: Write the minimal implementation**

Create
`frontend/src/components/dashboard/today/placeholderProgressWidget/index.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ProgressRingCard } from "../progressRingCard";

const PLACEHOLDER_TOTAL = 6;
const PLACEHOLDER_COMPLETED = 4;

export const PlaceholderProgressWidget = () => {
  const t = useTranslations("dashboard.today");
  const label = t("progress.label", { count: PLACEHOLDER_TOTAL });

  return (
    <ProgressRingCard
      total={PLACEHOLDER_TOTAL}
      completed={PLACEHOLDER_COMPLETED}
      label={label}
    />
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd frontend && npx vitest run src/components/dashboard/today/placeholderProgressWidget/index.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Lint and commit**

Run: `cd frontend && npx biome check src/components/dashboard/today/placeholderProgressWidget`
Expected: no issues.

```bash
git add frontend/src/components/dashboard/today/placeholderProgressWidget
git commit -m "feat: add PlaceholderProgressWidget sample square"
```

---

### Task 5: Wire both widgets into `today/index.tsx`

**Files:**
- Modify: `frontend/src/components/dashboard/today/index.tsx:16` (import)
- Modify: `frontend/src/components/dashboard/today/index.tsx:120-133` (desktop column)
- Modify: `frontend/src/components/dashboard/today/index.tsx:136-141` (mobile block)

**Interfaces:**
- Consumes: `TaskProgressWidget` (Task 3, unchanged import path
  `./taskProgressWidget`), `PlaceholderProgressWidget` (Task 4, import path
  `./placeholderProgressWidget`).
- Produces: nothing consumed by later tasks — this is the final integration
  point.

- [ ] **Step 1: Add the import**

In `frontend/src/components/dashboard/today/index.tsx`, the imports are
alphabetized by path. Insert the new import between the `NextTaskCard` and
`SunArc` imports (line 13-14) so the block reads:

```tsx
import { NextTaskCard } from "./nextTaskCard";
import { PlaceholderProgressWidget } from "./placeholderProgressWidget";
import { SunArc } from "./sunArc";
import { TaskForm } from "./taskForm";
import { TaskProgressWidget } from "./taskProgressWidget";
```

(the `TaskForm` and `TaskProgressWidget` lines already exist — only the
`PlaceholderProgressWidget` line is new).

- [ ] **Step 2: Update the desktop column**

Replace:

```tsx
        {isDesktop && (
          <div className="md:col-span-1 flex flex-col gap-4">
            <TaskProgressWidget tasks={sortedTasks} />
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

- [ ] **Step 3: Update the mobile block**

Replace:

```tsx
      {!isDesktop && (
        <>
          <TaskProgressWidget tasks={sortedTasks} />
          <WeatherWidget />
        </>
      )}
```

with:

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

- [ ] **Step 4: Run the full test suite**

Run: `cd frontend && npx vitest run`
Expected: all test files pass, **except** the pre-existing unrelated failure
in `src/components/dashboard/today/greeting/index.test.tsx` ("renders the
greeting with the user's name"), which predates this plan and is out of
scope.

- [ ] **Step 5: Typecheck and lint**

Run: `cd frontend && npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `cd frontend && npx biome check src/components/dashboard/today/index.tsx`
Expected: no issues.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/dashboard/today/index.tsx
git commit -m "feat: show TaskProgressWidget and PlaceholderProgressWidget side by side"
```
