# Design: Keyboard & Focus Accessibility

## Current State
```
┌──────────────────────────────────┐
│         🕹️ ARCADE               │
│   [Games] [Changelog] [Config]  │  ← buttons, no visible focus ring
├──────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │  🐍  │ │  🏓  │ │  🧱  │    │  ← div onclick, not keyboard-
│  │Snake │ │ Pong │ │Break │    │     reachable (no tabindex/role)
│  └──────┘ └──────┘ └──────┘    │
│                                  │
│  Focus outlines: browser default │
│  (invisible on dark bg)          │
└──────────────────────────────────┘
```

- Game cards are `<div onclick>` — no `tabindex`, no `role`, no keyboard activation
- All buttons/inputs use browser-default focus outlines (thin blue ring lost on `#0f0f23`)
- No `:focus-visible` styles anywhere

## Proposed State
```
┌──────────────────────────────────┐
│         🕹️ ARCADE               │
│   [Games] [Changelog] [Config]  │  ← Tab focuses with accent ring
├──────────────────────────────────┤
│  ┌━━━━━━┐ ┌──────┐ ┌──────┐    │
│  ┃  🐍  ┃ │  🏓  │ │  🧱  │    │  ← focused card: accent outline
│  ┃Snake ┃ │ Pong │ │Break │    │     + glow, Enter/Space launches
│  └━━━━━━┘ └──────┘ └──────┘    │
│                                  │
│  All interactive elements show   │
│  accent focus ring on Tab only   │
└──────────────────────────────────┘
```

## CSS Changes

### 1. Global focus-visible reset (add after existing button/card styles)
```css
/* --- Keyboard Focus Accessibility --- */

/* Remove default outlines — we replace with custom */
*:focus {
  outline: none;
}

/* Accent focus ring for all interactive elements (keyboard only) */
.nav button:focus-visible,
.back-btn:focus-visible,
.restart-btn:focus-visible,
.save-btn:focus-visible,
.touch-btn:focus-visible {
  outline: 2px solid #e94560;
  outline-offset: 2px;
}

/* Game card focus — accent ring + glow (matches hover shadow) */
.game-card:focus-visible {
  outline: 2px solid #e94560;
  outline-offset: 2px;
  box-shadow: 0 8px 24px rgba(233,69,96,0.2);
  transform: translateY(-4px);
}

/* Form inputs focus — accent border */
select:focus-visible,
input:focus-visible {
  border-color: #e94560;
  outline: none;
}
```

### 2. Selector: `.game-card` existing hover rule
No change needed — the `:focus-visible` rule above reuses the same visual treatment.

## HTML Changes

### 1. Game card template (in `renderGameGrid()` JS function, line ~160)

**Before:**
```html
<div class="game-card" onclick="launchGame('${g.id}','${g.name}')">
```

**After:**
```html
<div class="game-card" tabindex="0" role="button" aria-label="${g.name}" onclick="launchGame('${g.id}','${g.name}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();launchGame('${g.id}','${g.name}')}">
```

Changes:
- `tabindex="0"` — makes card focusable via Tab
- `role="button"` — announces as button to screen readers
- `aria-label="${g.name}"` — clear accessible name
- `onkeydown` — Enter/Space activates the card (standard button behavior)

## Interaction Notes

- **`:focus-visible` only** — Focus ring appears on keyboard Tab navigation, NOT on mouse click. Modern browser support is universal (Chrome 86+, Firefox 85+, Safari 15.4+).
- **No `:focus` override risk** — We use `*:focus { outline: none }` globally, then restore via `:focus-visible`. Mouse users see no outlines. Keyboard users get accent rings.
- **Game card hover+focus parity** — Focused cards get the same lift + glow as hovered cards, maintaining visual consistency.
- **Tab order** — Natural DOM order: nav buttons → game cards (left to right) → back/restart in game view. No custom `tabindex` values needed beyond `0`.
- **No JS for focus styles** — Pure CSS, zero runtime cost.
- **Performance** — No new animations or transitions; reuses existing card hover transform.
