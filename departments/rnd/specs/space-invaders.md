# Spec: Space Invaders

## Overview
Implement Space Invaders as `startSpaceInvaders()` in `frontend/public/index.html`. Canvas 600×400, black background, primary color `#22c55e` (green, classic CRT feel).

## Constants
```javascript
const CANVAS_W = 600, CANVAS_H = 400;
const PLAYER_W = 30, PLAYER_H = 16, PLAYER_SPEED = 4;
const PLAYER_Y = CANVAS_H - 40;
const BULLET_W = 2, BULLET_H = 8, BULLET_SPEED = 6;
const BOMB_W = 2, BOMB_H = 8, BOMB_SPEED = 2.5;
const MAX_BOMBS = 5;
const BOMB_CHANCE = 0.02; // per eligible alien per frame

const ALIEN_ROWS = 5, ALIEN_COLS = 11;
const ALIEN_W = 24, ALIEN_H = 16;
const ALIEN_PAD_X = 12, ALIEN_PAD_Y = 10;
const ALIEN_STEP_X = 10;  // pixels per horizontal step
const ALIEN_STEP_Y = 16;  // pixels per downward step
const BASE_STEP_INTERVAL = 60; // frames between fleet steps at full count
const MIN_STEP_INTERVAL = 4;   // fastest speed with 1 alien remaining

const SHIELD_COUNT = 4;
const SHIELD_W = 36, SHIELD_H = 24;
const SHIELD_PIXEL = 3; // each shield "pixel" is 3×3 canvas pixels
const SHIELD_COLS = 12, SHIELD_ROWS = 8; // shield grid dimensions (12*3=36, 8*3=24)
const SHIELD_Y = CANVAS_H - 80;

const UFO_W = 32, UFO_H = 12, UFO_SPEED = 2;
const UFO_CHANCE = 0.001; // per frame when no UFO active
const UFO_POINTS = [50, 100, 150, 300];

const ALIEN_POINTS = [10, 10, 20, 20, 30]; // row 0-1: 10pt, row 2-3: 20pt, row 4: 30pt
const STARTING_LIVES = 3;
const WAVE_DROP_OFFSET = 16; // aliens start 16px lower each new wave
```

## Data Structures

### Alien Grid
```javascript
// 2D array: aliens[row][col] = { alive: boolean, type: 0|1|2 }
// type 0 = bottom two rows (10pt, wide body)
// type 1 = middle two rows (20pt, medium body)
// type 2 = top row (30pt, small body)
function createAlienGrid() {
  const grid = [];
  for (let r = 0; r < ALIEN_ROWS; r++) {
    const row = [];
    const type = r < 2 ? 0 : r < 4 ? 1 : 2;
    for (let c = 0; c < ALIEN_COLS; c++) {
      row.push({ alive: true, type: type });
    }
    grid.push(row);
  }
  return grid;
}
```

### Fleet State
```javascript
const fleet = {
  x: 60,             // top-left of grid in canvas coords
  y: 50,             // adjusted per wave
  dx: 1,             // 1 = moving right, -1 = moving left
  stepTimer: 0,      // counts frames
  animFrame: 0,      // 0 or 1, toggled each step
  aliveCount: 55
};
```

### Player
```javascript
const player = { x: CANVAS_W / 2, lives: STARTING_LIVES, score: 0, hiScore: 0 };
```

### Bullet & Bombs
```javascript
let bullet = { x: 0, y: 0, active: false };
let bombs = []; // array of { x, y, active }
```

### Shields
```javascript
// Array of 4 shields, each is a 2D boolean grid (SHIELD_ROWS × SHIELD_COLS)
function createShields() {
  const shields = [];
  const spacing = CANVAS_W / (SHIELD_COUNT + 1);
  for (let i = 0; i < SHIELD_COUNT; i++) {
    const sx = spacing * (i + 1) - SHIELD_W / 2;
    const grid = [];
    for (let r = 0; r < SHIELD_ROWS; r++) {
      const row = [];
      for (let c = 0; c < SHIELD_COLS; c++) {
        // Cut out bottom inner corners for the arch shape
        const isArch = r >= SHIELD_ROWS - 3 && c >= 3 && c < SHIELD_COLS - 3;
        row.push(!isArch);
      }
      grid.push(row);
    }
    shields.push({ x: sx, y: SHIELD_Y, grid: grid });
  }
  return shields;
}
```

### UFO
```javascript
let ufo = { x: 0, y: 30, active: false, dx: 0, points: 0, showScore: 0 };
```

## Game State
```javascript
let wave = 0;
let gameOver = false;
let invincibleTimer = 0; // frames of invincibility after death
```

## Sprite Drawing

Aliens drawn with `fillRect` blocks — no images. Three designs by type:

```javascript
function drawAlien(ctx, x, y, type, frame) {
  // type 0 (squid/bottom): wide blocky shape, two frames
  // type 1 (crab/middle): medium shape with claws, two frames
  // type 2 (octopus/top): small tentacle shape, two frames
  // Each sprite is defined as an array of [dx, dy, w, h] rects
  // frame 0/1 toggles leg/tentacle positions
  ctx.fillStyle = type === 2 ? '#ff4444' : type === 1 ? '#44ff44' : '#ffffff';
  // ... draw sprite rects
}
```

Define sprite data as const arrays of pixel-block rects for each type×frame (6 total sprite variants). Keep them compact — 8-12 rects each.

### Player Cannon
Simple trapezoid: wide base rect + narrower middle + narrow barrel on top.

### UFO
Dome shape: flat bottom rect + rounded top via smaller stacked rects.

## Game Loop (per frame)

```
1. If gameOver → draw game-over screen, listen for restart key → return
2. Handle input:
   - Left/Right → move player.x, clamp to [0, CANVAS_W - PLAYER_W]
   - Space → if !bullet.active, spawn bullet at player center
3. Move bullet upward (y -= BULLET_SPEED). If y < 0, deactivate.
4. Move bombs downward (y += BOMB_SPEED). If y > CANVAS_H, deactivate.
5. Fleet step logic:
   - Increment fleet.stepTimer
   - stepInterval = lerp(BASE_STEP_INTERVAL, MIN_STEP_INTERVAL, 1 - aliveCount/55)
   - If stepTimer >= stepInterval:
     a. Check if any alive alien at fleet edge would go out of bounds
     b. If yes: fleet.dy moves down ALIEN_STEP_Y, reverse fleet.dx
     c. If no: fleet.x += ALIEN_STEP_X * fleet.dx
     d. Toggle fleet.animFrame
     e. Reset stepTimer
6. Alien bomb spawning:
   - For each column, find the lowest alive alien
   - Each eligible alien has BOMB_CHANCE probability to drop bomb (if bombs.length < MAX_BOMBS)
7. UFO logic:
   - If !ufo.active: UFO_CHANCE per frame to spawn (random direction)
   - If active: move, deactivate if off screen
   - If showScore > 0: decrement, display points at last position
8. Collision detection (see below)
9. Check wave clear: if aliveCount === 0, start next wave
10. Check alien invasion: if any alive alien y >= PLAYER_Y → game over
11. Decrement invincibleTimer if > 0
12. Render everything
```

## Collision Detection

### Bullet vs Aliens
```
For each alive alien:
  alienScreenX = fleet.x + col * (ALIEN_W + ALIEN_PAD_X)
  alienScreenY = fleet.y + row * (ALIEN_H + ALIEN_PAD_Y)
  If AABB overlap(bullet, alien):
    alien.alive = false
    bullet.active = false
    player.score += ALIEN_POINTS[row]
    fleet.aliveCount--
```

### Bullet vs UFO
```
If bullet.active && ufo.active:
  If AABB overlap(bullet, ufo):
    bullet.active = false
    ufo.active = false
    ufo.points = UFO_POINTS[random index]
    player.score += ufo.points
    ufo.showScore = 90 // frames to display score
```

### Bullet vs Shields
```
For each shield:
  Convert bullet position to shield grid coords
  If within grid and grid cell is true:
    Erode: clear hit cell + 1-2 neighbors (small blast radius)
    bullet.active = false
```

### Bombs vs Player
```
If invincibleTimer <= 0:
  For each active bomb:
    If AABB overlap(bomb, player rect):
      bomb.active = false
      player.lives--
      invincibleTimer = 120 // 2 seconds at 60fps
      If lives === 0: gameOver = true
```

### Bombs vs Shields
Same as bullet vs shields but from the bottom direction. Erode on hit, deactivate bomb.

### Aliens vs Shields
```
When fleet steps down:
  For each alive alien, check overlap with each shield
  Erode all shield pixels that overlap with the alien rect
```

## Rendering Order
1. Clear canvas to black
2. Draw HUD: score (top-left), hi-score (top-center), lives as cannon icons (bottom-left)
3. Draw shields (iterate grid, fillRect each true pixel)
4. Draw aliens (call drawAlien for each alive alien)
5. Draw player cannon (unless invincible and blinking: skip every other 10 frames)
6. Draw bullet (white rect)
7. Draw bombs (white/red rects)
8. Draw UFO or its score popup
9. If gameOver: semi-transparent overlay + "GAME OVER" text + "Press Enter to restart"

## Wave Progression
```
function startWave(waveNum) {
  aliens = createAlienGrid();
  fleet.x = 60;
  fleet.y = 50 + waveNum * WAVE_DROP_OFFSET; // capped at some max
  fleet.dx = 1;
  fleet.stepTimer = 0;
  fleet.aliveCount = 55;
  bullet.active = false;
  bombs = [];
  // Do NOT reset shields between waves (they carry over, classic behavior)
  // Do NOT reset score or lives
}
```

## Input Handling
Track keys via `keydown`/`keyup` into a `keys` object. Check `keys['ArrowLeft']`, `keys['ArrowRight']`, `keys['Space']` in game loop. Fire on keydown only (not held), using a `canFire` flag reset on keyup.

## Cleanup
```javascript
function cleanup() {
  cancelAnimationFrame(animId);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
}
```

## meta.json
```json
{
  "name": "Space Invaders",
  "description": "Defend Earth from waves of descending aliens. Classic 1978 arcade action.",
  "version": "1.0.0",
  "category": "classic",
  "color": "#22c55e"
}
```

## Edge Cases
- Player cannot fire while bullet is in flight (single bullet rule)
- Bombs cannot spawn from dead aliens
- Shield erosion must clamp to grid bounds
- UFO should not spawn during game-over state
- Wave number caps fleet.y so aliens don't start below shields
- Hi-score persists across games within session (not across page reloads)
- Invincibility frames prevent instant multi-death from bomb clusters
