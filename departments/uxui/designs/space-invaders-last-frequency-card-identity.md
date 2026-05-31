# Design: Space Invaders "Last Frequency" Card Identity

## Current State
Space Invaders card uses default `.game-card .banner` styling — flat `#1a1a2e` background with no glow. No visual identity distinguishing it from generic cards.

## Proposed State
CRT-black gradient with phosphor green glow, matching the "Last Frequency" creative direction.

```
┌─────────────────────────┐
│  ░░░ CRT black ░░░░░░░ │  ← gradient: #020408 → #1a1a2e
│       👾                │  ← emoji with green + red glow
│  ░░░░░░░░░░░░░░░░░░░░░ │
├─────────────────────────┤
│  Space Invaders         │
│  Classic alien shooter  │
└─────────────────────────┘
```

## CSS Changes

Add after `.game-card[data-game="tetris"] .banner` block:

```css
.game-card[data-game="space-invaders"] .banner {
  background: linear-gradient(135deg, #020408 0%, #1a1a2e 100%) !important;
  text-shadow: 0 0 20px #00ff88, 0 0 40px rgba(255, 23, 68, 0.25);
}
```

- `#020408` — CRT black from creative spec
- `#00ff88` — phosphor green (player cannon color, dominant visual element)
- `rgba(255, 23, 68, 0.25)` — subtle red invader glow as secondary accent

## Interaction Notes
- Hover lift + pink shadow from platform design system unchanged
- No new animations — consistent with other card identities
