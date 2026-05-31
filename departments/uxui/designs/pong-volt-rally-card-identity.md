# Design: Pong Volt Rally — Card Identity

## Current State
Pong game card uses the default banner styling: a tinted background from the game's color property with the emoji centered. No `data-game` attribute. Same generic treatment as all non-Snake cards.

## Proposed State
Pong card gets a dark electric-blue gradient banner with dual cyan+orange text glow, signaling the "electric duel" theme.

### ASCII Mockup
```
┌─────────────────────────┐
│  ⚡ (dark blue gradient) │  ← #050510 → #1a1a2e gradient
│     cyan+orange glow     │  ← text-shadow dual color
├─────────────────────────┤
│  Pong                    │
│  Classic paddle game     │
│  [v2.0.0]               │
└─────────────────────────┘
```

## HTML Changes
Add `data-game="pong"` attribute to the Pong game card element in `index.html`, following the same pattern used for Snake and other cards.

## CSS Changes
Add to `frontend/public/css/styles.css` after the Snake card identity block:

```css
.game-card[data-game="pong"] .banner {
  background: linear-gradient(135deg, #050510 0%, #1a1a2e 100%) !important;
}
.game-card[data-game="pong"] .banner {
  text-shadow: 0 0 20px #00e5ff, 0 0 40px rgba(255, 109, 0, 0.25);
}
```

## Interaction Notes
- No new hover states — inherits existing card hover (translateY + accent glow)
- No new transitions or animations
- Reduced-motion: no impact (no animations added)
- Mobile: no impact (banner is responsive via existing grid)

## Risk
- Low. Additive CSS only. Same proven pattern as Snake card identity.
