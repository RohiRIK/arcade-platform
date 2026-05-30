# Research: Game-Over Screen Polish

## Problem
All 7 games have independently coded game-over overlays drawn directly on canvas. Each uses different fonts, colors, sizes, spacing, and features. There is no shared design pattern — every game reinvented the wheel.

### Current State Audit

| Game | Title Color | Title Font | Score Font | Hi-Score? | New Best? | Restart Key | Overlay Alpha |
|------|------------|------------|------------|-----------|-----------|-------------|---------------|
| Snake | `FOOD_COLOR` (green) | 30px sans-serif | 20px sans-serif | Yes (shown) | Yes (★ New Best! ★) | R | 0.75 |
| Breakout | `#e94560` | 30px sans-serif | 18px monospace | Yes (combined) | No | R | 0.75 |
| Tetris | `#e94560` | 22px sans-serif | 14px monospace | No | No | None shown | 0.7 |
| Space Invaders | `#e94560` | 30px sans-serif | 16px monospace | No | No | Enter/R | 0.7 |
| Pac-Man | `#ff0` (yellow) | bold 32px monospace | 16px monospace | No | No | Enter | 0.6 |
| Frogger | `#e74c3c` (red) | bold 40px monospace | 20px monospace | No | No | Enter | 0.7 |

### Problems Identified
1. **Color inconsistency**: Snake uses food color, Pac-Man uses yellow, Frogger uses a non-palette red (`#e74c3c`), others use accent `#e94560`.
2. **Font inconsistency**: Mix of sans-serif and monospace for titles, varying sizes (22px–40px).
3. **Feature inconsistency**: Only Snake shows high score celebration. Tetris shows no restart hint. Restart key varies (R vs Enter vs both).
4. **No win state**: Games that can be "won" (Breakout clearing all bricks, Pac-Man clearing dots) have no distinct win screen — they just level up or loop.
5. **No visual flair**: Plain text on semi-transparent black. No scanline effect, no glow, no retro arcade "INSERT COIN" feel.
6. **Overlay alpha varies**: 0.6 to 0.75 — subtle but inconsistent.

## Inspiration

### Reference 1: Classic Arcade Cabinets (1980s)
- Centered "GAME OVER" in large blocky text, often with a countdown before returning to attract mode.
- High score table shown immediately after game over.
- Distinct visual hierarchy: big title → score → prompt.

### Reference 2: Celeste / Hollow Knight Death Screens
- Brief pause before showing overlay (adds weight to the moment).
- Fade-in animation rather than instant appearance.
- Minimal text, clear call-to-action.

### Reference 3: RetroArch / Emulation Overlays
- CRT scanline overlay on game-over adds retro authenticity.
- Consistent styling regardless of which game is running.

## Gap Analysis
- **Consistency gap**: 6 different visual treatments for the same UX moment.
- **Polish gap**: No animation, no visual hierarchy beyond font size.
- **Feature gap**: No universal high-score tracking display, no "new best" celebration in 5/6 games.
- **Accessibility gap**: No consideration for reduced-motion users in any future animations.
- **Design system gap**: Game-over screens don't reference CSS custom properties or design tokens — they're hardcoded hex values in JS.

## Proposed Approach

### Shared Game-Over Rendering Function
Create a single `drawGameOverOverlay(ctx, options)` utility function that all games call. Options:
- `title`: "GAME OVER" or "YOU WIN!"
- `score`: current score
- `highScore`: best score (if tracked)
- `isNewBest`: boolean for celebration
- `restartHint`: "Press R to restart" (standardize to R across all games)

### Visual Treatment
- **Overlay**: `rgba(15, 15, 35, 0.85)` — matches `--bg-primary` with alpha
- **Title**: `#e94560` (accent), bold 36px monospace, consistent across all games
- **Score line**: `#fff`, 18px monospace
- **High score**: `#888` (secondary), 14px monospace
- **New best**: `#facc15` (gold), with ★ markers (from Snake's existing pattern)
- **Restart hint**: `#888`, 14px monospace, standardize "Press R to restart"
- **Win variant**: Title in `#4ade80` (success green) instead of accent red

### Animation (respecting reduced-motion)
- Overlay fades in over 200ms (opacity 0→1)
- Title scales from 1.2→1.0 over 200ms
- Skipped entirely under `prefers-reduced-motion: reduce` — instant display

### Implementation Scope
- One shared JS function, ~40 lines
- Update all 6 game-over blocks (7 games, Pong has no game-over currently)
- Add high-score tracking to games that lack it (Tetris, Space Invaders, Pac-Man, Frogger)
- Add win screen for Breakout (all bricks cleared)
- Zero CSS changes needed (all canvas-rendered)

## Complexity
Medium — touches all games but changes are mechanical (replace inline draw code with shared function call).

## Risk
Low — game logic untouched, only the rendering of the overlay changes. Each game's `gameOver` boolean and restart logic stays the same.
