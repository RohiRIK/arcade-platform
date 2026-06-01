# Design: Pac-Man Phantom Maze — Card Identity

**Date:** 2026-06-02
**Research:** departments/uxui/research/pacman-phantom-maze-card-identity.md
**Pivot:** arcade-evolution Phase 3

---

## Current State

Pac-Man game card uses the default banner with 👻 emoji and generic tinted background. No per-game CSS identity. Last of 7 games without card identity.

```
┌────────────────┐
│   👻            │  ← generic tinted banner
│  Pac-Man       │
│  Classic maze  │
│  v1.0.0        │
└────────────────┘
```

## Proposed State

Add per-game CSS targeting `data-game="pac-man"` to give Pac-Man a near-black dungeon gradient with gold + red phantom glow on the emoji.

```
┌────────────────┐
│   👻            │  ← near-black dungeon gradient, gold+red phantom glow
│  Pac-Man       │
│  Classic maze  │
│  v1.0.0        │
└────────────────┘
```

## CSS Changes

Add to `frontend/public/css/styles.css`, in the "Per-Game Card Identity" section:

```css
.game-card[data-game="pac-man"] .banner {
  background: linear-gradient(135deg, #080810 0%, #1a1a2e 100%) !important;
  text-shadow: 0 0 20px #ffd600, 0 0 40px rgba(255, 23, 68, 0.25);
}
```

## Interaction Notes

- No additional hover states needed — standard card hover (lift + pink glow) applies
- Gradient uses 135deg angle consistent with all other card identities
- Dual glow: primary gold (soul-light player) with subtle red accent (Blinky phantom)
- `!important` on background overrides inline style from JS card generation
- `#080810` is the darkest card gradient start, fitting the fog-of-war dungeon theme
