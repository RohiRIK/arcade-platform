# Spec: Pac-Man — Phantom Maze (Phase 3)

**Date:** 2026-06-02
**Research:** departments/rnd/research/pac-man.md
**Pitch:** departments/rnd/pitches/pac-man.md
**Base Spec:** departments/rnd/specs/pac-man.md
**Creative Direction:** departments/creative/artifacts/pacman-creative-direction.md
**Stage Script:** departments/creative/scripts/pacman-phantom-maze-stages.md
**Phase:** arcade-evolution Phase 3 (final game, 7/7)

---

## Overview

Rewrite Pac-Man as "Phantom Maze" — a fog-of-war haunted labyrinth where the player is a gold soul-light consuming spirit orbs in darkness. 28×31 tile maze, 4 ghost personalities with distinct AI, 7+ difficulty levels with escalating speed/fog/fright, 8 zzfx sounds, fog-of-war lighting, particle effects, and the Ghost Train wow moment.

Function: `startPacManPhantomMaze(canvas, ctx)` in `frontend/public/js/games/pac-man-phantom-maze.js`
Returns: `{ controls: string, cleanup: Function }`

Canvas: 600×400, `#080810` background.

---

## Acceptance Criteria
- [ ] Game loads in browser without JS errors
- [ ] Canvas renders at 600×400
- [ ] Arrow key controls respond with cornering (direction buffered near tile center)
- [ ] Maze renders with walls, dots, power pellets visible within fog radius
- [ ] Fog of war: radial gradient centered on player, fades to near-black at radius edge
- [ ] All 4 ghosts move with distinct AI behaviors (Blinky direct, Pinky ahead, Inky mirror, Clyde retreat)
- [ ] Scatter/chase mode cycling works per MODE_SEQUENCE
- [ ] Power pellets turn ghosts blue/frightened with blaze activation particles
- [ ] Eating frightened ghosts scores 200/400/800/1600 with spirit capture particles
- [ ] Ghost Train triggers when all 4 eaten in one pellet (combo text + bonus)
- [ ] Eaten ghosts return as eyes to ghost house
- [ ] Score displays and increments correctly
- [ ] Lives decrement on ghost collision with soul shatter animation, game over at 0
- [ ] Eating all 240 dots advances to next level with maze flash transition
- [ ] Fruit appears at 70/170 dots eaten, correct type per level
- [ ] 7 difficulty levels with ghost speed / fright time / fog radius progression
- [ ] 8 zzfx sounds play on correct events (munch, power_surge, spirit_capture, soul_shatter, fruit_chime, siren_low, siren_high, maze_clear)
- [ ] Ghost wisp trail particles render behind each ghost
- [ ] High score persists via localStorage
- [ ] Restart works with Enter key without page reload
- [ ] No hardcoded localhost in any URL
- [ ] Works from LAN IP

---

## Constants

```js
// Canvas
const W = 600, H = 400;
const COLS = 28, ROWS = 31;
const TILE_W = 14;  // 28*14 = 392
const TILE_H = 12;  // 31*12 = 372
const FIELD_X = 104; // (600 - 392) / 2
const FIELD_Y = 14;  // top margin for HUD

// Colors — Phantom Maze palette
const BG = '#080810';
const WALL_COLOR = '#1a237e';
const WALL_GLOW = '#3949ab';
const DOT_COLOR = '#b0bec5';
const POWER_COLOR = '#ffffff';
const PAC_COLOR = '#ffd600';
const PAC_GLOW_PX = 6;
const GHOST_COLORS = {
  blinky: '#ff1744', pinky: '#f48fb1',
  inky: '#00e5ff', clyde: '#ff9100'
};
const FRIGHT_COLOR = '#1565c0';
const FRIGHT_FLASH = '#ffffff';
const EYES_COLOR = '#ffffff';
const FRUIT_COLOR = '#ff1744';
const SCORE_COLOR = '#b0bec5';
const COMBO_COLOR = '#ffd600';

// Speeds (pixels per frame at 60fps)
const BASE_PAC_SPEED = 2.0;
const GHOST_EATEN_SPEED = 3.0;

// Timers (ms)
const FRIGHT_FLASH_TIME = 2000; // last 2s of fright = flashing

// Scoring
const DOT_SCORE = 10;
const POWER_SCORE = 50;
const GHOST_EAT_SCORES = [200, 400, 800, 1600];
const EXTRA_LIFE_AT = 10000;
const STARTING_LIVES = 3;

// Maze tiles
const T_EMPTY = 0, T_WALL = 1, T_DOT = 2, T_POWER = 3;
const T_HOUSE = 4, T_DOOR = 5, T_TUNNEL = 6;

// Particles
const MAX_PARTICLES = 200;

// Dots
const TOTAL_DOTS = 240; // per level (dots + power pellets counted separately for display)
```

## Difficulty Progression (per Creative Direction)

```js
const LEVELS = [
  // lvl, ghostSpeedPct, frightMs, fogRadius, fruitType, fruitScore
  { level: 1, ghostPct: 0.75, frightMs: 8000, fogTiles: 5.0, fruit: 'cherry',      fruitPts: 100  },
  { level: 2, ghostPct: 0.80, frightMs: 7000, fogTiles: 5.0, fruit: 'strawberry',   fruitPts: 300  },
  { level: 3, ghostPct: 0.85, frightMs: 6000, fogTiles: 4.5, fruit: 'orange',       fruitPts: 500  },
  { level: 4, ghostPct: 0.90, frightMs: 5000, fogTiles: 4.0, fruit: 'apple',        fruitPts: 700  },
  { level: 5, ghostPct: 0.95, frightMs: 4000, fogTiles: 3.5, fruit: 'apple',        fruitPts: 700  },
  { level: 6, ghostPct: 1.00, frightMs: 3000, fogTiles: 3.0, fruit: 'melon',        fruitPts: 1000 },
  { level: 7, ghostPct: 1.05, frightMs: 2000, fogTiles: 2.5, fruit: 'melon',        fruitPts: 1000 },
];
// Level 7+ repeats level 7 settings
function getLevelConfig(lvl) {
  return LEVELS[Math.min(lvl - 1, LEVELS.length - 1)];
}
```

## Scatter/Chase Mode Sequence

```js
const MODE_SEQUENCE = [
  { mode: 'scatter', duration: 7000 },
  { mode: 'chase',   duration: 20000 },
  { mode: 'scatter', duration: 7000 },
  { mode: 'chase',   duration: 20000 },
  { mode: 'scatter', duration: 5000 },
  { mode: 'chase',   duration: 20000 },
  { mode: 'scatter', duration: 5000 },
  { mode: 'chase',   duration: Infinity }, // permanent chase
];
```

At higher levels, scatter durations compress per stage script (L3: 7s/20s, L6: 4s/26s, L7+: 3s/27s). Apply a multiplier: `scatterDuration * max(0.4, 1 - (level-1)*0.1)`.

## Maze Layout

Use the 28×31 `MAZE_TEMPLATE` from the base spec (`departments/rnd/specs/pac-man.md` lines 70-102). Parse at init into `maze[row][col]` integer array. Count dots to set `dotsRemaining`.

## Data Structures

```js
// Entity (shared shape for pac-man and ghosts)
entity = {
  x, y,           // pixel position (center)
  tileX, tileY,   // current tile coords (derived each frame)
  dir,             // 'up'|'down'|'left'|'right'|null
  nextDir,         // buffered direction (pac-man only)
  speed,           // px/frame
  frame,           // animation counter
};

// Ghost extends entity
ghost = {
  ...entity,
  name,            // 'blinky'|'pinky'|'inky'|'clyde'
  color,           // hex from GHOST_COLORS
  mode,            // 'scatter'|'chase'|'frightened'|'eaten'
  scatterTarget,   // {col, row} corner tile
  homeTarget,      // tile above ghost house door
  active,          // has exited house
  exitDelay,       // ms before exiting house
};

// Scatter targets
// blinky: {25, 0}, pinky: {2, 0}, inky: {27, 30}, clyde: {0, 30}

// Game state
state = {
  pacman, ghosts: [blinky, pinky, inky, clyde],
  maze,                    // 2D int array (mutated as dots eaten → 0)
  score, lives, level,
  dotsRemaining,
  ghostsEatenThisPellet,   // 0-4, resets per power pellet
  modeTimer, currentMode, modePhase,
  frightTimer,
  fruitActive, fruitTimer, fruitType, fruitScore,
  paused, gameOver, waitingToStart,
  highScore,
  extraLifeAwarded,
  particles: [],           // particle pool
  levelConfig,             // current LEVELS entry
};
```

## Tile/Pixel Conversion

```js
function tileToPixelX(col) { return FIELD_X + col * TILE_W + TILE_W / 2; }
function tileToPixelY(row) { return FIELD_Y + row * TILE_H + TILE_H / 2; }
function pixelToTileX(x)   { return Math.floor((x - FIELD_X) / TILE_W); }
function pixelToTileY(y)   { return Math.floor((y - FIELD_Y) / TILE_H); }
function atTileCenter(entity, threshold) {
  const cx = tileToPixelX(entity.tileX);
  const cy = tileToPixelY(entity.tileY);
  return Math.abs(entity.x - cx) < threshold && Math.abs(entity.y - cy) < threshold;
}
```

## Ghost AI Targeting

### Chase Mode (per ghost personality)
- **Blinky:** Target = Pac-Man's current tile. At L7+ with <10 dots: 110% speed (cruise mode).
- **Pinky:** Target = 4 tiles ahead of Pac-Man's facing direction (L4+: 6 tiles ahead).
- **Inky:** Target = midpoint between Blinky's position and 2 tiles ahead of Pac-Man. `target = (blinky.tile + pacAhead2) / 2`.
- **Clyde:** If distance to Pac-Man > 8 tiles: target = Pac-Man. If ≤ 8: target = scatter corner. (L4+: threshold 10 tiles.)

### Scatter Mode
Each ghost targets their assigned corner (see scatter targets above).

### Frightened Mode
Random valid direction at each intersection. No reversals except at mode switch.

### Eaten Mode (Eyes)
Target = tile above ghost house door `{13, 12}`. On arrival: enter house, wait 500ms, re-emerge as normal ghost in currentMode.

### Direction Selection (all ghosts)
At tile center: evaluate 4 directions (priority: up, left, down, right for ties). Remove reverse of current direction. Remove walls. Choose direction whose next tile minimizes Euclidean distance to target.

## Game Loop

```
function gameLoop(timestamp):
  dt = timestamp - lastTime (capped at 33ms to prevent spiral)
  lastTime = timestamp

  if waitingToStart: drawAll(); return requestAnimationFrame(gameLoop)
  if gameOver: drawAll(); drawGameOver(); return

  handleInput()
  movePacMan()
  updateTileCoords(pacman)
  checkDotCollection()
  checkFruitCollection()
  updateModeTimers(dt)
  moveGhosts()
  checkGhostCollisions()
  updateFruitTimer(dt)
  updateParticles(dt)
  drawAll()
  rafId = requestAnimationFrame(gameLoop)
```

## Movement

### Pac-Man
- Buffer `nextDir` from arrow keys
- At tile center (threshold 2px): if nextDir is valid (not wall, not ghost house), switch to it
- Move in current dir at `BASE_PAC_SPEED` px/frame
- Stop at walls (snap to tile center)
- Tunnel wrap: x < FIELD_X wraps to right, x > FIELD_X + COLS*TILE_W wraps to left

### Ghosts
- At tile center: run AI targeting, pick best direction (see above)
- Speed = `BASE_PAC_SPEED * levelConfig.ghostPct` (normal), `BASE_PAC_SPEED * 0.5` (frightened), `BASE_PAC_SPEED * 0.5` (tunnel), `GHOST_EATEN_SPEED` (eaten)
- Tunnel wrap same as Pac-Man
- Cannot reverse except when mode switches (scatter↔chase, entering fright)

## Sound Design (8 zzfx sounds)

```js
// All via zzfx() — exact params tuned at build time
const SOUNDS = {
  munch_a:      () => zzfx(...), // 260Hz square 40ms
  munch_b:      () => zzfx(...), // 300Hz square 40ms — alternate with munch_a
  power_surge:  () => zzfx(...), // bass swell 60→120Hz 150ms + shimmer 2kHz 150ms
  spirit_capture:() => zzfx(...),// descending glissando 1000→400Hz sawtooth 200ms
  soul_shatter: () => zzfx(...), // descending spiral 800→100Hz sine 500ms
  fruit_chime:  () => zzfx(...), // two-note 880→1100Hz triangle 120ms
  maze_clear:   () => zzfx(...), // ascending G4-B4-D5-G5 arpeggio 600ms
};

// Siren: Web Audio oscillator (not zzfx — needs looping)
// siren_low: sine oscillating 200↔300Hz at 1Hz, volume 12%
// siren_high: sine oscillating 400↔600Hz at 2Hz, volume 15%
// Switch siren_low → siren_high during frightened mode
let sirenOsc, sirenGain; // created once, frequency modulated
```

Munch alternates between munch_a and munch_b each dot for "waka-waka" effect.

## Particle System

Array of `{ x, y, vx, vy, life, maxLife, color, size }`. Cap at MAX_PARTICLES (oldest-first eviction).

| Event | Particles | Details |
|-------|-----------|---------|
| Dot eaten | 2 | 1px silver `#b0bec5`, drift toward player, 150ms |
| Power pellet eaten | 8 | White radial burst, 400ms, player glow expands 6→20px over 200ms |
| Ghost eaten | 10 | Ghost's color, spiral inward to player, 350ms. Float score text (200/400/800/1600) in `#00e5ff` 18px |
| Player death | 12 | Gold `#ffd600` outward burst, player spin+shrink 600ms |
| Fruit eaten | 6 | `#ff1744` starburst, 250ms |
| Ghost wisp trails | 3-7 per ghost | Ghost color at 30% opacity, 200ms lifetime, trail behind ghost. Count increases with level (3 at L1, +1 per level, max 7) |

## Fog of War

Full-screen overlay using a radial gradient centered on player position:
```
gradient = ctx.createRadialGradient(pacX, pacY, 0, pacX, pacY, fogRadius * TILE_W);
gradient.addColorStop(0, 'rgba(0,0,0,0)');       // transparent at center
gradient.addColorStop(0.7, 'rgba(0,0,0,0.3)');   // mild fade
gradient.addColorStop(1, 'rgba(0,0,0,0.95)');     // near-black at edge
```

Draw AFTER all game elements. During power pellet: fogRadius expands to `levelConfig.fogTiles + 3` tiles.

Wall glow: walls within 3 tiles of player render as `WALL_GLOW` (#3949ab), others as `WALL_COLOR` (#1a237e).

## Rendering (Draw Order)

1. Fill `BG` (#080810)
2. Maze walls — iterate grid, draw each wall tile as filled rect with 1px gap. Color based on distance to player (WALL_GLOW if ≤3 tiles, WALL_COLOR otherwise)
3. Dots — 3px circles in `DOT_COLOR`, pulse opacity 0.8–1.0 on 2s sine cycle
4. Power pellets — 8px circles in `POWER_COLOR`, pulse 0.5–1.0 on 800ms cycle, 4px glow
5. Fruit (if active) — at tile (14, 17), pulsing glow, color per fruit type
6. Ghosts — body (semicircle top + rect + 3-bump wavy bottom) + eyes (white circles with directional pupils). Frightened: blue body, zigzag mouth, hollow eyes. Eaten: eyes only
7. Ghost wisp trail particles
8. Pac-Man — 20px diameter circle, animated mouth (45° open/close, 200ms cycle), direction-facing, `PAC_COLOR` with `PAC_GLOW_PX` glow
9. Fog of war overlay (radial gradient)
10. Floating score text particles
11. HUD: Score top-left, High Score top-center, Lives (mini pac icons) bottom-left, Level bottom-right, Fruit display bottom-center. Font: 14px monospace, `SCORE_COLOR`

## Transitions

| Transition | Animation | Duration |
|-----------|-----------|----------|
| Game start | "READY!" text 1.5s, ghosts in house, pac-man at start | 1500ms |
| Level clear | Maze walls flash 3× (WALL_COLOR↔WALL_GLOW, 200ms each) → brief black → new level | 1200ms |
| Player death | Pac-Man spin+shrink (2 rotations, 600ms) + 12 gold particles → ghost freeze 300ms → respawn | 900ms |
| Game over | Fog radius shrinks to 0 over 800ms → "GAME OVER" overlay | 1000ms |

## Ghost Train (Wow Moment)

When all 4 ghosts eaten during a single power pellet (`ghostsEatenThisPellet == 4`):
1. All 4 eye-pairs stream back to center in a visible line
2. Score cascade stacks vertically at last-eaten position: 200, 400, 800, 1600 — each in the eaten ghost's color
3. "×4 COMBO" text in `#ffd600` at 24px, pulses once (scale 1→1.3→1, 400ms)
4. Deep bass chord zzfx (C2+G2, 400ms)
5. Total bonus: standard 200+400+800+1600 = 3000 (no extra points, spectacle is the reward)
6. At L7+: particles double, "LEGENDARY" text at 28px with 3 pulse cycles, +5000 bonus

## Init & Cleanup

```js
function startPacManPhantomMaze(canvas, ctx) {
  canvas.width = W; canvas.height = H;
  // Parse maze, count dots, init pacman at (14, 23) dir='left'
  // Init ghosts: blinky(14,11), pinky(12,14), inky(14,14), clyde(16,14)
  // Exit delays: 0ms, 5000ms, 15000ms, 30000ms (L1)
  // score=0, lives=3, level=1, gameOver=false
  // modePhase=0, currentMode='scatter', modeTimer=7000
  // frightTimer=0, ghostsEatenThisPellet=0
  // highScore from localStorage('phantomMazeHigh')
  // Start siren oscillator (paused until first input)
  // waitingToStart = true — show "READY!" and wait for first arrow key
  // keydown listener, requestAnimationFrame

  return {
    controls: '← → ↑ ↓ Move | Eat dots, avoid ghosts | Power pellets reverse the chase',
    cleanup() {
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      stopSiren();
      // null refs
    }
  };
}
```

## Architecture (Internal Functions)

The `startPacManPhantomMaze` closure contains these named functions:

1. `parseMaze()` — MAZE_TEMPLATE → maze[][]
2. `initEntities()` — position pac-man and ghosts
3. `handleInput(e)` — buffer nextDir from arrow keys
4. `movePacMan()` — cornering + wall check + tunnel wrap
5. `moveGhosts()` — per-ghost AI targeting + direction selection + speed
6. `getGhostTarget(ghost)` — returns {col, row} per ghost personality and mode
7. `checkDotCollection()` — dot/power pellet eating, fright activation
8. `checkGhostCollisions()` — eat ghost or die
9. `updateModeTimers(dt)` — scatter/chase cycling, fright countdown
10. `spawnParticles(type, x, y, color)` — create particles per event type
11. `updateParticles(dt)` — age and remove dead particles
12. `drawMaze()` — walls with proximity glow, dots with pulse, power pellets
13. `drawPacMan()` — animated mouth circle with glow
14. `drawGhost(ghost)` — body + eyes + wisp trails
15. `drawFog()` — radial gradient overlay
16. `drawHUD()` — score, lives, level, fruit
17. `drawGameOver()` — fog-close animation + overlay
18. `drawAll()` — orchestrates full draw order
19. `nextLevel()` — reset maze, apply level config
20. `resetPositions()` — reset entities keeping maze/score state
21. `startSiren() / stopSiren() / updateSiren()` — Web Audio oscillator management

## Edge Cases

- Tunnel wrap: row 13, cols 0 and 27 are tunnel tiles. Entities crossing edges teleport.
- Ghost house: T_HOUSE and T_DOOR are impassable to Pac-Man. Ghosts pass through T_DOOR.
- Eaten ghost re-entry: eyes reach homeTarget → teleport inside house → wait 500ms → emerge.
- Mode switch reversal: all non-eaten ghosts reverse direction on scatter↔chase transition.
- Frightened mode freezes scatter/chase timer (resumes after fright ends).
- Power pellet during existing fright: reset frightTimer, reset ghostsEatenThisPellet to 0.
- Multiple ghosts same tile: each collision independent.
- Extra life: awarded once at 10000 points.
- Ghost warning (L3+): when ghost within 3 tiles but outside fog, faint glow on nearest wall edge.
- L4+ speed bonus: eating all 4 ghosts within 3s of power pellet doubles ghost eat scores.
- L7+ Blinky cruise: no scatter mode, permanent chase. <10 dots: all ghosts 110% speed.

## meta.json

```json
{
  "name": "Pac-Man",
  "description": "Navigate the phantom maze, eat spirit orbs, and outsmart four luminous ghosts in the dark.",
  "version": "2.0.0",
  "category": "classic",
  "color": "#ffd600"
}
```

## Estimated Size

~800-1000 lines. Most complex game in the set due to ghost AI state machine, fog of war rendering, and multi-level progression.
