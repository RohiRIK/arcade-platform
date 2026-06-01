# Design: Frogger Neon Crossing — Card Identity

**Date:** 2026-06-02
**Research:** departments/uxui/research/frogger-neon-crossing-card-identity.md
**Pivot:** arcade-evolution Phase 3

---

## Current State

Frogger game card uses the default banner with 🐸 emoji and generic tinted background. No per-game CSS identity.

```
┌────────────────┐
│   🐸            │  ← generic green-tinted banner
│  Frogger       │
│  Classic road  │
│  v1.0.0        │
└────────────────┘
```

## Proposed State

Add per-game CSS targeting `data-game="frogger"` to give Frogger a dark wet asphalt gradient with lime green + cyan neon glow on the emoji.

```
┌────────────────┐
│   🐸            │  ← dark asphalt gradient, lime+cyan neon glow on icon
│  Frogger       │
│  Classic road  │
│  v1.0.0        │
└────────────────┘
```

## CSS Changes

Add to `frontend/public/css/styles.css`, in the "Per-Game Card Identity" section:

```css
.game-card[data-game="frogger"] .banner {
  background: linear-gradient(135deg, #0c0c1a 0%, #1a1a2e 100%) !important;
}
.game-card[data-game="frogger"] .banner .game-icon {
  text-shadow: 0 0 20px #76ff03, 0 0 40px #76ff03, 0 0 10px #00e5ff;
}
```

## Interaction Notes

- No additional hover states needed — standard card hover (lift + pink glow) applies
- Gradient uses 135deg angle consistent with all other card identities
- Dual glow: primary lime green (drone color) with subtle cyan accent (sky-train)
- `!important` on background overrides inline style from JS card generation
