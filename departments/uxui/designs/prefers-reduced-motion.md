# Design: prefers-reduced-motion Accessibility

## Current State
Three infinite CSS animations run unconditionally:
- `.header h1` — `shimmer 3s infinite` (background-position oscillation)
- `.status-checking` — `skeleton-pulse 1.5s infinite` (opacity 0.4↔0.9)
- `.loading-bar-fill` — `loading-slide 1s infinite` (translateX -100%→350%)

Two user-triggered transforms:
- `.game-card:hover` — `translateY(-4px)` + glow shadow
- `.game-card:focus-visible` — `translateY(-4px)` + glow shadow

No `@media (prefers-reduced-motion: reduce)` block exists anywhere.

## Proposed State
Add a single `@media (prefers-reduced-motion: reduce)` block at the end of the `<style>` section (before closing `</style>`) that neutralizes all motion while preserving visual feedback.

Users with reduced-motion preference will see:
- Static gradient title (no shimmer)
- Static yellow "Checking..." text (no pulse)
- Static loading bar at 40% width (no slide)
- Card hover: shadow/glow only, no translateY lift
- Card focus: outline only, no translateY lift

## CSS Changes

```css
/* --- prefers-reduced-motion Accessibility --- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .game-card:hover {
    transform: none;
  }
  .game-card:focus-visible {
    transform: none;
  }
}
```

### Design Decisions
1. **Global override pattern** (from MDN/GitHub) — `animation-duration: 0.01ms` + `iteration-count: 1` makes animations "complete" instantly so `animationend` events still fire. This is safer than `animation: none` which could break JS listeners.
2. **`transition-duration: 0.01ms`** — state changes still happen (colors, shadows) but appear instant.
3. **Explicit `transform: none`** on card hover/focus — the global transition override handles timing, but the transform itself needs explicit removal since it's set as a property, not via animation.
4. **Shadow preserved on hover** — `box-shadow` is still applied (just without the lift), maintaining the interactivity hint.

## Interaction Notes
- No JS changes required.
- No visual change for default-motion users.
- OS-level setting, not a toggle we need to build.
- Works on all modern browsers (Chrome 74+, Firefox 63+, Safari 10.1+).
