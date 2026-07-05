# Aurora theme background

## Context

The app currently has a single, static hero background (`bg-day-arc`, defined as `--background-image-day-arc` in `frontend/src/app/globals.css`) used on `frontend/src/app/page.tsx`. It never changes with the user's OS color-scheme preference.

Some primitives (`Input`, `Button`) already use Tailwind `dark:` variant classes, which in Tailwind v4 default to the `prefers-color-scheme: dark` media feature. But no color token in `globals.css` currently has a dark override — `:root` defines light values only, so those `dark:` classes have nothing coordinated to react against for backgrounds.

The user supplied four new CSS values — a base linear gradient and a radial "accent" glow, one pair per color scheme — and asked for them to be wired in as the app's background, switching with the theme.

## Decisions

- **Theme mechanism**: OS preference only (`prefers-color-scheme`), no in-app toggle, no `next-themes`/provider. Out of scope: persisted user choice, manual light/dark switch UI.
- **Placement**: replaces `bg-day-arc` on `frontend/src/app/page.tsx`. `--background-image-day-arc` is removed from `globals.css` since `page.tsx` is its only consumer.
- **Layering**: the radial accent renders as the first (topmost) `background-image` layer, stacked over the linear gradient as the second layer — one combined utility class, matching how `bg-day-arc` is used today (a single class on the container, no extra DOM elements).
- **Naming**: the new token/utility is called `aurora` (`--background-image-aurora` / `bg-aurora`) — thematically fits "Aurela" and describes a glow-over-gradient effect, unlike `day-arc` which described a light-only concept.

## Design

Follow the existing pattern already used for `--background`/`--foreground` in `globals.css`: theme-resolving values live as plain custom properties in `:root` (light defaults), overridden inside a `@media (prefers-color-scheme: dark)` block, then exposed as a Tailwind utility via `@theme inline`. This will be the first dark-mode override block in the file.

```css
:root {
  /* ...existing vars... */
  --bg-gradient: linear-gradient(180deg, #FDF9EF 0%, #F0E3C2 100%);
  --bg-accent: radial-gradient(circle at 85% 90%, rgba(242, 184, 198, 0.55) 0%, rgba(242, 184, 198, 0) 55%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-gradient: linear-gradient(180deg, #241F3D 0%, #3E3A66 100%);
    --bg-accent: radial-gradient(circle at 85% 90%, rgba(168, 86, 122, 0.35) 0%, rgba(168, 86, 122, 0) 55%);
  }
}
```

```css
@theme inline {
  /* ...existing entries... */
  --background-image-aurora: var(--bg-accent), var(--bg-gradient);
}
```

`page.tsx`'s container class changes from `bg-day-arc` to `bg-aurora`; no other JSX/logic changes.

## Files touched

- `frontend/src/app/globals.css` — add `--bg-gradient`/`--bg-accent` to `:root`, add the dark override media block, add `--background-image-aurora` to `@theme inline`, remove the now-unused `--background-image-day-arc` entry. (The `--color-*` palette stops it referenced, e.g. `--color-dawn-50`, `--color-ink-900`, stay — they're the shared palette used throughout the app, not day-arc-specific.)
- `frontend/src/app/page.tsx` — swap `bg-day-arc` → `bg-aurora`.

## Testing

- Visual check in a running dev server: toggle `prefers-color-scheme` in browser DevTools and confirm the gradient + glow swap correctly on `/`.
- `pnpm typecheck` and `pnpm biome check` — pure CSS/class-name change, expected to pass unaffected.
- No new automated test needed: this is a visual-only change with no behavior to assert in Vitest/Playwright.
