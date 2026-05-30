# Design: Game-Over Screen Polish

## Current State
All 7 games draw game-over overlays independently on canvas with inconsistent styling:

```
┌─────────────────────────────────┐
│      (semi-transparent bg)      │
│                                 │
│    GAME OVER  ← varying color   │
│    Score: 42  ← varying font    │
│                                 │
│   Press R to restart ← or Enter │
│                                 │
└─────────────────────────────────┘
```

- 6 different color treatments (green, yellow, red variants, accent)
- Mix of sans-serif and monospace, sizes 22px–40px
- Overlay alpha varies 0.6–0.75
- Only Snake shows high-score celebration
- No win-state variant
- No visual flair (plain text on dark overlay)

## Proposed State

Unified `drawGameOverOverlay(ctx, options)` function used by all games:

```
┌─────────────────────────────────┐
│    rgba(15,15,35, 0.85) bg      │
│                                 │
│      ══ GAME OVER ══            │  #e94560, bold 36px monospace
│                                 │
│        Score: 42                │  #fff, 18px monospace
│      Best: 128                  │  #888, 14px monospace
│                                 │
│    ★ NEW HIGH SCORE! ★          │  #facc15 (gold), 16px mono (conditional)
│                                 │
│     Press R to restart          │  #888, 14px monospace
│                                 │
└─────────────────────────────────┘
```

Win variant (Breakout clear, Pac-Man clear):
```
┌─────────────────────────────────┐
│                                 │
│       ══ YOU WIN! ══            │  #4ade80 (success), bold 36px mono
│         Score: 42               │
│                                 │
│     Press R to restart          │
│                                 │
└─────────────────────────────────┘
```

## Implementation Plan

### Shared Function (add to index.html before game scripts)

```javascript
function drawGameOverOverlay(ctx, opts = {}) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const title = opts.title || 'GAME OVER';
  const isWin = opts.isWin || false;
  const score = opts.score;
  const highScore = opts.highScore;
  const isNewBest = opts.isNewBest || false;

  // Overlay background — matches --bg-primary with alpha
  ctx.fillStyle = 'rgba(15, 15, 35, 0.85)';
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = 'center';
  let y = h * 0.35;

  // Title
  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = isWin ? '#4ade80' : '#e94560';
  ctx.fillText(title, w / 2, y);
  y += 48;

  // Score
  if (score !== undefined) {
    ctx.font = '18px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, w / 2, y);
    y += 28;
  }

  // High score
  if (highScore !== undefined) {
    ctx.font = '14px monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('Best: ' + highScore, w / 2, y);
    y += 24;
  }

  // New best celebration
  if (isNewBest) {
    ctx.font = '16px monospace';
    ctx.fillStyle = '#facc15';
    ctx.fillText('\u2605 NEW HIGH SCORE! \u2605', w / 2, y);
    y += 28;
  }

  // Restart hint (standardized to R)
  ctx.font = '14px monospace';
  ctx.fillStyle = '#888';
  ctx.fillText('Press R to restart', w / 2, y + 16);
}
```

### Per-Game Changes (R&D coordination required)

Each game's game-over draw block gets replaced with a single call:

| Game | Current Code Location | Call |
|------|----------------------|------|
| Snake | drawGameOver() block | `drawGameOverOverlay(ctx, {score, highScore, isNewBest})` |
| Breakout | game-over section | `drawGameOverOverlay(ctx, {score})` |
| Tetris | game-over section | `drawGameOverOverlay(ctx, {score})` |
| Space Invaders | game-over section | `drawGameOverOverlay(ctx, {score})` |
| Pac-Man | game-over section | `drawGameOverOverlay(ctx, {score})` |
| Frogger | game-over section | `drawGameOverOverlay(ctx, {score})` |

### Restart Key Standardization
All games should accept **R** key for restart (some currently only accept Enter). This is an R&D change — send inbox request.

## CSS/HTML Changes
**None.** This is entirely canvas-rendered. The shared function lives in a `<script>` block, not CSS.

## Interaction Notes
- No CSS transitions involved — canvas API only.
- Reduced-motion: No animation in this initial version (instant display), so no reduced-motion consideration needed. Future fade-in would need `matchMedia('(prefers-reduced-motion: reduce)')` check.
- The shared function is purely visual — it does NOT control game state, restart logic, or score tracking. Those remain in each game's own code.

## Domain Boundary Note
The per-game integration (replacing each game's draw code with the shared function call) crosses into R&D territory. UX/UI will:
1. Add the shared `drawGameOverOverlay` function to index.html (before game scripts).
2. Send R&D an inbox request to integrate it into each game.

## Risk
Low. The shared function is additive — existing game-over code continues working until R&D swaps it in per-game.

## Pivot Consideration
This design aligns with the arcade-evolution pivot. When games move to LittleJS, the overlay function can be adapted to use LittleJS rendering instead of raw canvas. The visual spec (colors, fonts, layout) remains the same.
