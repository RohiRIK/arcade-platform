# Design: Breakout Prism Shatter — Card Identity

**Date:** 2026-05-31
**Research:** departments/uxui/research/breakout-prism-shatter-card-identity.md
**Pivot:** arcade-evolution Phase 3

---

## Current State

Breakout game card uses the default banner with 🧱 emoji and generic tinted background (`{color}20` inline style — orange `#f97316`). No per-game CSS identity.

```
┌────────────────┐
│   🧱            │  ← generic orange-tinted banner
│  Breakout       │
│  Classic brick  │
│  v1.0.0         │
└────────────────┘
```

## Proposed State

Add per-game CSS targeting `data-game="breakout"` (attribute already exists on cards) to give Breakout a deep purple-black gradient with magenta/purple prismatic glow on the emoji.

```
┌────────────────┐
│   🧱            │  ← deep purple-black gradient, magenta+purple glow on icon
│  Breakout       │
│  Classic brick  │
│  v1.0.0         │
└────────────────┘
```

## CSS Changes

Add to `frontend/public/css/styles.css`, in the "Per-Game Card Identity" section (after Pong):

```css
.game-card[data-game="breakout"] .banner {
  background: linear-gradient(135deg, #0d0015 0%, #1a1a2e 100%) !important;
  text-shadow: 0 0 20px #e040fb, 0 0 40px rgba(124, 77, 255, 0.25);
}
```

### Color Rationale
- `#0d0015` — Creative's background color for Prism Shatter (deep purple-black void)
- `#e040fb` — Creative's top-row brick color (magenta crystal), used as primary glow
- `rgba(124, 77, 255, 0.25)` — Creative's second-row color `#7c4dff` at 25% opacity, secondary glow
- Combined: prismatic magenta-purple halo that's distinct from Snake (green) and Pong (cyan/orange)

### Pattern
Same approach as Snake and Pong — single selector with `!important` on background to override inline banner style, combined gradient + text-shadow rule.

## Interaction Notes
- No animations added — static gradient and glow only
- `prefers-reduced-motion` not affected (no animations)
- No responsive changes needed (banner scales with card)
- Zero visual regression risk to other cards

## Next Step
BUILD: Add the CSS rule to `styles.css` in the Per-Game Card Identity section.
