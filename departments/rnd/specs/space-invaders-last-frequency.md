# Spec: Space Invaders — Last Frequency

## Overview
Rewrite Space Invaders as "Last Frequency" — a CRT-radio-signal defense game with 5 waves, procedural pixel-art sprites, 8 zzfx sounds, particle effects, CRT post-processing, and progressive difficulty.

Implements Creative Direction: `departments/creative/artifacts/space-invaders-creative-direction.md`
Stage Script: `departments/creative/scripts/space-invaders-last-frequency-stages.md`

Function: `startSpaceInvadersLastFrequency(canvas, ctx)` in `frontend/public/js/games/space-invaders-last-frequency.js`
Returns: `{ controls: string, cleanup: Function }`

Canvas: 600×400, `#020408` background.

## Acceptance Criteria
- [ ] Game loads in browser without JS errors
- [ ] Canvas renders at 600×400
- [ ] Arrow Left/Right move cannon, Space fires
- [ ] Score displays and increments on invader kill
- [ ] Game over triggers when lives=0 or invaders reach player
- [ ] Restart works with R key without page reload
- [ ] No hardcoded localhost in any URL
- [ ] 3 invader types with 2 animation frames each
- [ ] 4 destructible shields with pixel erosion
- [ ] UFO appears randomly, awards variable points
- [ ] 5 waves with escalating difficulty per creative spec
- [ ] 8 zzfx sounds play on correct events
- [ ] CRT scan lines + vignette overlay
- [ ] Glitch shatter particles on invader destroy
- [ ] High score persists via localStorage
- [ ] Wave clear bonus awards correctly

## Constants
```js
const W = 600, H = 400;
const BG_COLOR = '#020408';
const SCAN_LINE_COLOR = '#0a0a14';

// Player
const PLAYER_W = 26, PLAYER_H = 16;
const PLAYER_SPEED = 4;
const PLAYER_Y = H - 40;
const PLAYER_COLOR = '#00ff88';
const PLAYER_GLOW = 2; // px

// Bullets
const BULLET_W = 2, BULLET_H = 8, BULLET_SPEED = 7;
const BULLET_COLOR = '#00ff88';
const MAX_PLAYER_BULLETS = 1; // increases to 2 in wave 4, 3 with signal boost
const FIRE_COOLDOWN = 300; // ms, reduces to 150 in wave 4

// Invader grid
const ALIEN_ROWS = 5, ALIEN_COLS = 11;
const ALIEN_W = 22, ALIEN_H = 16; // 11x8 at 2x scale
const ALIEN_PAD_X = 14, ALIEN_PAD_Y = 12;
const TOTAL_INVADERS = 55;

// Invader colors by row (top to bottom)
const ROW_COLORS = ['#ff1744', '#ff9100', '#ffea00', '#69f0ae', '#69f0ae'];
const ROW_POINTS = [40, 30, 20, 10, 10];

// Fleet movement
const ALIEN_STEP_X = 10;
const ALIEN_STEP_Y = 16;

// Wave difficulty table
const WAVE_CONFIG = [
  { stepMs: 500, fireRate: 0.5, startYOffset: 0 },
  { stepMs: 450, fireRate: 0.8, startYOffset: 0 },
  { stepMs: 400, fireRate: 1.2, startYOffset: 16 },
  { stepMs: 350, fireRate: 1.5, startYOffset: 16 },
  { stepMs: 300, fireRate: 2.0, startYOffset: 32 },
];
const WAVE_BONUS_PER = 1000; // wave_number * this

// Invader bombs
const BOMB_W = 2, BOMB_H = 6, BOMB_SPEED_BASE = 4;
const BOMB_COLOR_RED = '#ff1744';
const BOMB_COLOR_GREEN = '#69f0ae';
const MAX_BOMBS = 5;

// Shields
const SHIELD_COUNT = 4;
const SHIELD_COLS = 22, SHIELD_ROWS = 16;
const SHIELD_PX = 4; // each pixel = 4x4 canvas px
const SHIELD_COLOR = '#00bfa5';
const SHIELD_Y = H - 90;

// UFO
const UFO_W = 32, UFO_H = 14;
const UFO_SPEED = 2;
const UFO_COLOR = '#e040fb';
const UFO_GLOW = 3;
const UFO_POINTS = [50, 100, 150, 300];
const UFO_WEIGHTS = [4, 3, 2, 1]; // weighted random
const UFO_SPAWN_INTERVAL = [20000, 30000]; // ms range

// Super UFO (wave 5 only)
const SUPER_UFO_W = 48, SUPER_UFO_H = 20;
const SUPER_UFO_HP = 3;
const SUPER_UFO_POINTS = 500;

// Lives
const STARTING_LIVES = 3;
const BONUS_LIFE_SCORE = 10000;
const INVINCIBLE_MS = 2000;

// Particles
const PARTICLE_CAP = 200;

// CRT effects
const SCAN_LINE_OPACITY_BASE = 0.15;
const VIGNETTE_STRENGTH = 0.2;

// Score multiplier (wave 2+)
const MAX_MULTIPLIER = 5;
```

## Data Structures

### Invader Sprites
Each invader type is defined as an array of [dx, dy, w, h] rects relative to top-left, at 1× scale (draw at 2×). Three types × 2 frames = 6 variants.

```js
// type 0 (bottom 2 rows, squid): pale green #69f0ae
const SPRITE_TYPE0 = [
  // frame 0: legs down
  [...],
  // frame 1: legs up
  [...]
];
// type 1 (middle 2 rows, crab): yellow/orange
const SPRITE_TYPE1 = [/* frame0, frame1 */];
// type 2 (top row, octopus): red
const SPRITE_TYPE2 = [/* frame0, frame1 */];
```
Each sprite: 11×8px grid, ~10-12 rects per frame. Sprites are symmetric — define left half, mirror right.

### Player Cannon Sprite
13×8px at 2× = 26×16px. Trapezoid: wide base, narrow barrel top. Color: `#00ff88`.

### UFO Sprite
16×7px at 2× = 32×14px. Classic saucer dome shape. Color: `#e040fb`.
Super UFO: 24×10px at 2× = 48×20px. Same shape but wider, with white stripes.

### Fleet State
```js
const fleet = {
  x: 60, y: 50,
  dx: 1,              // 1=right, -1=left
  stepTimer: 0,       // ms accumulated
  animFrame: 0,       // 0 or 1
  aliveCount: 55,
  grid: []            // 2D: grid[row][col] = { alive, type }
};
```

### Player State
```js
const player = {
  x: W / 2 - PLAYER_W / 2,
  lives: STARTING_LIVES,
  score: 0, hiScore: 0,
  invincibleUntil: 0,
  maxBullets: 1,
  fireCooldown: FIRE_COOLDOWN,
  multiplier: 1, missStreak: 0,
  signalBoost: 0      // ms remaining
};
```

### Shields
```js
// Array of 4 shields
// Each: { x, y, grid: boolean[SHIELD_ROWS][SHIELD_COLS] }
// Arch cutout at bottom center (classic shape)
function createShields() { ... }
```

### Bullets & Bombs
```js
let playerBullets = []; // { x, y, active }
let bombs = [];         // { x, y, active, type: 'red'|'green', speed }
```

### UFO
```js
let ufo = { x: 0, y: 30, active: false, dx: 0, points: 0,
            showScore: 0, showX: 0, hp: 1, isSuper: false };
```

### Particles
```js
let particles = []; // { x, y, vx, vy, life, maxLife, color, w, h, gravity }
```

### CRT State
```js
const crt = {
  scanOpacity: SCAN_LINE_OPACITY_BASE,
  staticTimer: 0, staticInterval: 0,  // random flicker
  tearTimer: 0, tearActive: false, tearY: 0, tearShift: 0,
  rollTimer: 0, rollActive: false,
  tremor: 0 // wave 4+ screen shake
};
```

### Wave/Game State
```js
let wave = 0; // 0-4 (waves 1-5)
let gameState = 'playing'; // 'playing' | 'waveTransition' | 'dying' | 'gameOver' | 'victory'
let transitionTimer = 0;
let lastTime = 0;
```

## Sound Design (zzfx)
All 8 sounds via `zzfx(...[...])` spread-array pattern (avoids elided comma parse errors):

```js
const SFX = {
  pulse_fire:      () => zzfx(...[...]),  // 60ms square 1kHz
  static_pop:      () => zzfx(...[...]),  // 100ms noise burst 3kHz bandpass
  ufo_warble:      null,                  // looping — see UFO section
  signal_catch:    () => zzfx(...[...]),  // rising arpeggio 500→750→1000Hz
  static_crash:    () => zzfx(...[...]),  // 400ms descending noise
  march_blip:      (pitch) => zzfx(...[...]),  // variable pitch square 40ms
  shield_crunch:   () => zzfx(...[...]),  // 50ms low noise
  frequency_sweep: () => zzfx(...[...]),  // 500ms ascending sine
};
```
UFO warble: sine oscillator at 300Hz ±50Hz at 4Hz rate, 15% volume. Implemented as a looping zzfx or manual oscillation via `setInterval` that stops when UFO deactivates.

## Game Loop (delta-time based)

```
function update(dt):
  if gameState == 'gameOver' or 'victory': draw overlay, listen R for restart, return
  if gameState == 'waveTransition': run transition animation, return
  if gameState == 'dying': run death animation, return

  1. Input: ArrowLeft/ArrowRight → move player, clamp [0, W-PLAYER_W]
     Space → fire if bullets < maxBullets and cooldown elapsed

  2. Move player bullets upward. Remove if y < 0.
     On miss (bullet exits top): reset multiplier to 1

  3. Fleet step:
     - Accumulate dt into fleet.stepTimer
     - stepInterval = lerp from wave base stepMs down to 80ms based on (1 - aliveCount/55)
     - On step: check edge bounds → shift down + reverse, or shift horizontally
     - Toggle animFrame, play march_blip(currentPitch)
     - march pitch = 120 + (55 - aliveCount) * 2 Hz

  4. Bomb spawning:
     - Per column, find lowest alive invader
     - Probability based on wave fireRate (converted to per-frame chance)
     - Wave 3+: bottom row fires green straight bullets (faster)
     - Wave 4+: top row occasionally fires double-shot

  5. Move bombs downward. Remove if y > H.

  6. UFO logic:
     - Spawn timer based on UFO_SPAWN_INTERVAL range
     - Move across screen, deactivate if off-edge
     - Wave 3+: UFO drops bomb when above player (with 300ms warning circle)
     - Wave 5: second UFO is Super UFO (3 HP, 500pts)
     - Play/stop warble sound

  7. Signal boost pickup (wave 5 only):
     - Spawns once at random destroyed invader position
     - Collect on player overlap: 3s triple fire

  8. Collision detection:
     a. Player bullets vs invaders → kill, score, particles, static_pop
     b. Player bullets vs UFO → damage/kill, magenta explosion
     c. Player bullets vs shields → erode, deactivate bullet
     d. Bombs vs player → if not invincible: lose life, static_crash, invincible 2s
     e. Bombs vs shields → erode, deactivate bomb
     f. Invaders vs shields (on step down) → erode overlapping pixels

  9. Check wave clear: aliveCount == 0 → wave bonus, transition
  10. Check invasion: any alive invader y >= PLAYER_Y → game over
  11. Update particles (move, age, remove dead)
  12. Update CRT effects (scan opacity, static flicker, tear, roll per wave config)
  13. Check bonus life at 10000pt intervals
  14. Render
```

## Rendering Order
```
1. Fill BG_COLOR
2. CRT scan lines (horizontal lines every 2px, opacity per wave)
3. Draw shields (iterate grid, fillRect each true pixel at SHIELD_PX size)
4. Draw invaders (drawAlien for each alive, using ROW_COLORS)
5. Draw player cannon (skip frames if invincible for blink effect)
6. Draw player bullets
7. Draw bombs (red zigzag or green straight)
8. Draw UFO (with glow) or score popup
9. Draw particles
10. Draw HUD: score top-left, hi-score top-center, wave top-right, lives bottom-left
11. Draw multiplier (if >1, "×N" next to score)
12. CRT vignette (radial gradient overlay darkening edges)
13. CRT horizontal tear effect (if active)
14. CRT vertical roll (if active, wave 5)
15. Screen tremor offset (wave 4+)
```

## Wave Transitions
Per creative spec:
- Wave clear: `frequency_sweep` sound, scan-line sweep top→bottom 400ms, new wave materializes row-by-row 100ms/row
- Player death: `static_crash`, screen flicker 3×100ms, respawn center
- Game start: CRT power-on horizontal line expand 500ms
- Game over: CRT power-off collapse to horizontal line 800ms
- Victory (wave 5 clear): full victory sequence per stage script

## Wave-Specific Mechanics
| Wave | Special |
|------|---------|
| 1 | Basic. Learn mechanics. Ghost afterimage on kills (200ms, 15% opacity) |
| 2 | Score multiplier display. Bomb slight homing (±2px drift). 50% shield regen between waves |
| 3 | Green fast bullets from bottom row. Panic zone border pulse. UFO drops bombs |
| 4 | Rapid fire (2 bullets, 150ms cooldown). Double-shot from top row. Screen tremor |
| 5 | Only 2 shields. Signal boost pickup. Super UFO (3HP, 500pts). Maximum CRT degradation |

## Cleanup
```js
function cleanup() {
  cancelAnimationFrame(animId);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
  // Stop UFO warble if playing
  // Clear any timers
}
return { controls: 'Arrow keys: Move | Space: Fire | R: Restart', cleanup };
```

## Edge Cases
- Single bullet rule (waves 1-3), 2 bullets (wave 4), 3 with signal boost (wave 5)
- Bombs cannot spawn from dead aliens
- Shield erosion clamps to grid bounds
- UFO does not spawn during transitions or game over
- Wave startYOffset capped so invaders don't start below shields
- Hi-score persists via localStorage key `spaceInvadersLastFrequency_hiScore`
- Invincibility prevents instant multi-death from bomb clusters
- Super UFO only in wave 5, guaranteed second UFO appearance
- March blip pitch increases as invaders die (120 + deadCount*2 Hz)
- CRT effects intensify per wave (scan opacity, flicker frequency, tear frequency)
- Signal boost pickup despawns after 10s if not collected
