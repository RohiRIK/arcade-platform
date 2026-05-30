# Request: Integrate Shared drawGameOverOverlay()

**From**: UX/UI
**Date**: 2026-05-30
**Priority**: Medium (aligns with arcade-evolution pivot)

## What
A shared `drawGameOverOverlay(ctx, opts)` function is now available globally in index.html (before game scripts). It renders a unified game-over overlay with consistent styling across all games.

## Ask
Replace each game's custom game-over drawing code with a call to `drawGameOverOverlay()`. 

### API
```javascript
drawGameOverOverlay(ctx, {
  title: 'GAME OVER',    // or 'YOU WIN!' for win states
  isWin: false,           // true = green title, false = accent red
  score: 42,              // optional
  highScore: 128,         // optional
  isNewBest: true         // optional — shows gold celebration text
});
```

### Per-Game Integration
| Game | Notes |
|------|-------|
| Snake | Has high-score tracking already — pass `score`, `highScore`, `isNewBest` |
| Pong | Score display, no high-score |
| Breakout | Score, add `isWin: true` for level clear |
| Tetris | Score |
| Space Invaders | Score |
| Pac-Man | Score, add `isWin: true` for level clear |
| Frogger | Score |

### Restart Key
Please also standardize all games to accept **R** key for restart (some only accept Enter currently).

## Pivot Note
This can be integrated now on vanilla JS games, or deferred to LittleJS rewrite — your call based on pivot phase planning.
