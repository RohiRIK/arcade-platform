# Spec: Pong (Volt Rally)

## Overview
Rewrite Pong as "Volt Rally" — an electric duel with 4 implicit rally stages, deuce mechanics, 7 zzfx sounds, ambient hum, lightning arcs, and particle effects. Single file at `frontend/public/js/games/pong-volt-rally.js`, exported via `startPongVoltRally()`.

## File
`frontend/public/js/games/pong-volt-rally.js` (~500 lines)

## Entry Point
```js
function startPongVoltRally(canvas, ctx) → { controls: string, cleanup: () => void }
```

## Constants (top of function)
```js
const W = 600, H = 400;
const WIN_SCORE = 11;
const DEUCE_CAP = 15;
const STARTING_LIVES = 0; // not used, score-based
const BALL_BASE_SPEED = 4;
const BALL_STAGE_SPEEDS = [4, 5.5, 7, 8]; // per stage
const BALL_BASE_RADIUS = 8;
const BALL_OVERCHARGE_RADIUS = 12;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 5; // px/frame when key held
const PADDLE_X_PLAYER = 10;
const PADDLE_X_CPU = W - 20;
const CPU_BASE_DELAY = 60; // ms
const CPU_DELAY_REDUCTION = 5; // ms per CPU score
const CPU_MIN_DELAY = 20; // ms
const CPU_SPEED_FACTOR = 0.85;
const PARTICLE_CAP = 150;
const STAGE_THRESHOLDS = [0, 5, 10, 20]; // rally counts for stage transitions
const RALLY_BONUS = [1, 1, 3, 5]; // score multiplier per stage
const BG_COLOR = '#050510';
const PLAYER_COLOR = '#60a5fa';
const CPU_COLOR = '#e94560';
const BALL_COLOR = '#ffffff';
```

## Data Structures
```js
let player = { y: H/2 - 40, score: 0 };
let cpu = { y: H/2 - 40, score: 0, lastUpdate: 0, targetY: H/2 };
let ball = { x: W/2, y: H/2, vx: 4, vy: 3, radius: 8, trail: [] };
let rallyCount = 0;
let particles = []; // { x, y, vx, vy, life, maxLife, color, size }
let lightningArcs = []; // { x1, y1, x2, y2, life, maxLife, color }
let floatingTexts = []; // { text, x, y, vy, life, maxLife, color, size }
let matchOver = false;
let winner = null;
let lateGame = false; // both scores >= 8
let deuce = false; // both scores >= 10, scores equal
let keysDown = {}; // for smooth held-key input
let audioCtx = null;
let oscillator = null;
let gainNode = null;
```

## 8 Named Functions

### 1. `startPongVoltRally(canvas, ctx)`
- Init all state variables
- Set up keydown/keyup listeners (track held keys in `keysDown` object)
- Create AudioContext + oscillator for ambient hum (sawtooth wave, 55Hz, gain 0)
- Start rAF loop with delta-time accumulator (16.67ms fixed step)
- Return `{ controls, cleanup }`

### 2. `updateBall(dt)`
- Move ball by `(vx, vy)` per frame
- Wall bounce: if `ball.y - radius <= 0` or `ball.y + radius >= H`, reflect vy, play `wall_bounce` zzfx
- Push current position to `ball.trail` (max trail length by stage: [3, 4, 6, 8])
- Score detection:
  - `ball.x < 0` → CPU scores, call `onScore('cpu')`
  - `ball.x > W` → player scores, call `onScore('player')`

### 3. `updatePaddles(dt, now)`
- **Player:** if `keysDown['ArrowUp']` or `keysDown['w']`, move up by `PADDLE_SPEED`. Same for down. Clamp to `[0, H - PADDLE_HEIGHT]`.
- **CPU AI:**
  - Track `cpu.lastUpdate` timestamp
  - Compute delay: `max(CPU_MIN_DELAY, CPU_BASE_DELAY - cpu.score * CPU_DELAY_REDUCTION)`
  - If `now - cpu.lastUpdate > delay`:
    - `cpu.targetY = ball.y - PADDLE_HEIGHT / 2`
    - `cpu.lastUpdate = now`
  - Move toward `cpu.targetY` at `currentBallSpeed * CPU_SPEED_FACTOR` px/frame
  - Clamp to `[0, H - PADDLE_HEIGHT]`

### 4. `checkCollisions()`
- **Player paddle:** if `ball.x - ball.radius <= PADDLE_X_PLAYER + PADDLE_WIDTH` AND `ball.y >= player.y` AND `ball.y <= player.y + PADDLE_HEIGHT`:
  - Reflect vx (set positive)
  - Calculate offset: `(ball.y - (player.y + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2)` → clamp [-1, 1]
  - New angle: `offset * (PI/3)` (max 60°)
  - Set `vx = cos(angle) * currentSpeed`, `vy = sin(angle) * currentSpeed`
  - `rallyCount++`
  - Play `paddle_hit` zzfx
  - Spawn 8 particles at ball position in `PLAYER_COLOR`
  - Check stage transitions
- **CPU paddle:** mirror logic at `PADDLE_X_CPU`
  - Same angle calc, vx set negative
  - `rallyCount++`
  - Spawn 8 particles in `CPU_COLOR`

### 5. `updateParticles(dt)`
- For each particle: update position by velocity, decrement life
- Remove dead particles (life <= 0)
- For each lightning arc: decrement life, remove dead
- For each floating text: update y by vy, decrement life, remove dead
- Spawn lightning arcs based on stage:
  - Stage 3 (rally 10-19): 1 arc every 500ms (or 350ms if lateGame + rally 7+)
  - Stage 4 (rally 20+): 1 arc every 300ms
  - Arc: random x1=0..W, y1=random, x2=0..W, y2=random, life=150ms, color by stage

### 6. `updateAudio()`
- Compute match state from scores:
  - `0-3 either`: gain 0.05, freq 55Hz
  - `4+ either`: gain 0.08, freq 55Hz
  - `8+ both (lateGame)`: gain 0.10, freq 105Hz
  - `deuce (10-10+)`: gain 0.15, freq 105Hz, add tremolo (LFO)
  - `match point`: gain 0 (silence for tension)
- Smoothly ramp oscillator frequency and gain to target values

### 7. `renderGame()`
```
1. Fill background BG_COLOR
2. Draw court border (color by stage/lateGame/deuce)
   - Normal: #1a1a3a → #2a2a4a → #3a3a6a → pulsing #3a3a6a↔#5a5aaa
   - lateGame: #2a2a5a permanent
   - deuce: red border pulse #ff1744, 2px, 500ms sine
3. Draw dashed center line (opacity by stage: 20%→30%→50%→50%)
4. Draw lightning arcs (white lines with glow)
5. Draw ball trail (ghost circles with decreasing opacity)
6. Draw ball (circle, radius by stage, glow shadow)
7. Draw paddles (rectangles with shadowBlur glow by stage)
   - Stage 4: ±1px random vibration offset
8. Draw score: "P_SCORE : CPU_SCORE" centered top, 24px monospace white
9. Draw rally counter (if rallyCount >= 5):
   - "⚡ RALLY: N ⚡" center-bottom area
   - Color #ffab00, 14px, pulsing scale 0.9–1.1 on 600ms sine
   - Show bonus multiplier "[3×]" or "[5×]" if active
10. Draw floating texts
11. Draw particles
12. If deuce: draw "DEUCE" center-top, #ff1744, 18px, flicker
13. If matchOver: draw victory screen
    - Winner's paddle flashes 3× (150ms each)
    - 30-particle burst in winner's color
    - If deuce win: "CLUTCH" text floats up #ffea00 24px bold
    - "Press R to play again" at bottom
```

### 8. `cleanup()`
- Cancel rAF
- Remove keydown/keyup listeners
- Close AudioContext (oscillator, gainNode)
- Clear any pending timeouts

## Helper Functions (inside startPongVoltRally scope)

### `onScore(scorer)`
- Increment scorer's score
- Determine rally bonus: `RALLY_BONUS[currentStage]`
- Add bonus to score (if > 1, show floating text "+N")
- Spawn 16 particles at ball position (scorer's color)
- Play `score` zzfx
- Reset ball to center with serve direction toward scorer (they just got scored on — other side serves)
- Reset rallyCount to 0
- Update lateGame flag: `player.score >= 8 && cpu.score >= 8`
- Update deuce flag: `player.score >= 10 && cpu.score >= 10 && player.score === cpu.score`
- Ball start speed: `lateGame ? 5 : BALL_BASE_SPEED`
- Check match end:
  - If scorer.score >= WIN_SCORE:
    - If not deuce (lead >= 2 or score < 10 for both): match over
    - If deuce and lead < 2: continue
    - If scorer.score >= DEUCE_CAP: match over regardless
  - On match over: set `matchOver = true`, `winner = scorer`, play `win_fanfare`, spawn victory effects

### `getCurrentStage()`
- Return 0 if rally < 5, 1 if < 10, 2 if < 20, 3 if >= 20
- If `lateGame`: shift thresholds (lightning at rally 7, not 10)

### `getCurrentBallSpeed()`
- Base: `BALL_STAGE_SPEEDS[getCurrentStage()]`
- If `lateGame` and stage 0: return 5 instead of 4

### `spawnParticles(x, y, count, color, spread)`
- Create `count` particles with random velocity within `spread`, life 500-800ms
- Respect PARTICLE_CAP

### `spawnLightningArc()`
- Random start/end points on opposite walls
- 3-5 segment jagged line (store as points array)
- Life 150ms, color by stage

## zzfx Sound Effects (7 sounds)
```js
const SFX = {
  paddle_hit:     () => zzfx(...[.3,,200,.01,.01,.05,1,2,,,,,,,,,,.5,.01]),
  wall_bounce:    () => zzfx(...[.2,,300,.01,.01,.03,1,1,,,,,,,,,,.3,.01]),
  score:          () => zzfx(...[.5,,150,.02,.1,.1,2,1,,,,,,,,,.1,.5,.02]),
  rally_charge:   () => zzfx(...[.3,,200,.01,.15,,1,2,,,800,,,,,,,,,.1]),
  rally_overcharge: () => zzfx(...[.5,,130,.02,.2,.1,3,2,,,,,,,,,.2,.5,.05]),
  win_fanfare:    () => zzfx(...[.6,,400,.02,.3,.2,1,1,,,,,,,,,,.8,.1]),
  electric_hum:   () => {} // handled by oscillator, not zzfx
};
```
(Exact zzfx params to be tuned during build — these are starting points from creative spec patterns.)

## Integration with index.html
1. Add `<script src="js/games/pong-volt-rally.js"></script>` before `js/main.js`
2. In `launchGame()`: replace `startPong(canvas, ctx)` with `startPongVoltRally(canvas, ctx)`
3. Update GAMES array id for pong to keep same card, or keep as-is since id='pong' maps to startPongVoltRally

## Acceptance Criteria
- [x] Game loads in browser without JS errors
- [ ] Canvas renders at 600x400
- [ ] Arrow keys (and W/S) move player paddle smoothly (held key, not per-press)
- [ ] Ball angle varies by paddle hit position
- [ ] Rally counter appears at rally 5+
- [ ] Ball speed increases through 4 stages
- [ ] Lightning arcs appear at rally 10+ (or 7+ in late game)
- [ ] Overcharge mode at rally 20+ (ball grows, paddles vibrate)
- [ ] Score display works, first to 11 wins
- [ ] Deuce mechanic at 10-10 (win by 2, cap 15)
- [ ] Red border pulse during deuce
- [ ] Victory celebration with particles
- [ ] "CLUTCH" text on deuce wins
- [ ] Ambient hum scales with match state
- [ ] 7 zzfx sounds trigger at correct events
- [ ] CPU AI difficulty scales with its score
- [ ] R to restart after match
- [ ] Game over state displays properly
- [ ] Restart works without page reload
- [ ] No hardcoded localhost in any URL
- [ ] Works from LAN IP
- [ ] cleanup() properly cancels rAF, removes listeners, closes AudioContext
- [ ] Particle cap respected (150 max)
- [ ] localStorage: arcade_pong_highscore (winning margin)
