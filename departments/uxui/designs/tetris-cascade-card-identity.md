# Design: Tetris Cascade Card Identity

## Current State
Tetris game card uses default `.banner` styling — flat `#1a1a2e` background, no unique glow. Identical to all non-migrated games.

## Proposed State
```
┌─────────────────────────┐
│  ░░ dark steel gradient ░░│  ← #0a0e14 → #1a1a2e (135deg)
│                           │
│        🧱                 │  ← emoji with cyan + gold glow
│                           │
├─────────────────────────┤
│  Tetris Cascade           │
│  Industrial block-drop...  │
│  v2.0                     │
└─────────────────────────┘
```

## CSS Changes
Add after the Breakout card identity block (line ~155):

```css
.game-card[data-game="tetris"] .banner {
  background: linear-gradient(135deg, #0a0e14 0%, #1a1a2e 100%) !important;
  text-shadow: 0 0 20px #00bcd4, 0 0 40px rgba(255, 193, 7, 0.25);
}
```

- **Gradient**: Steel blue-black `#0a0e14` (from Tetris creative palette) fading to standard card bg
- **Primary glow**: Cyan `#00bcd4` (I-piece, the most iconic Tetris color)
- **Secondary glow**: Gold `#ffc107` at 25% opacity (alloy/liquid-metal warmth)

## Interaction Notes
- Hover state: inherits existing `.game-card:hover` lift + pink box-shadow (platform-level, not per-game)
- No additional transitions needed
- Reduced-motion: covered by existing `@media (prefers-reduced-motion)` block
