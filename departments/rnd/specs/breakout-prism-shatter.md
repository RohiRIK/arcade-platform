# Spec: Breakout (Prism Shatter)

## Overview
Rewrite Breakout as "Prism Shatter" — crystal-breaking arcade with 5 designed levels, combo multipliers, 3 power-up types, 7 zzfx sounds, crystal shatter particles, and prismatic clear explosion. Single file at `frontend/public/js/games/breakout-prism-shatter.js`, exported via `startBreakoutPrismShatter()`.

## File
`frontend/public/js/games/breakout-prism-shatter.js` (~550 lines)

## Entry Point
```js
function startBreakoutPrismShatter(canvas, ctx) → { controls: string, cleanup: () => void }
```

## Constants (top of function)
```js
const W = 600, H = 400;
const BRICK_COLS = 10;
const BRICK_W = 54, BRICK_H = 18;
const BRICK_GAP = 2;
const BRICK_OFFSET_X = 15; // (600 - 10*54 - 9*2) / 2 ≈ 15
const BRICK_OFFSET_Y = 40;
const PADDLE_W = 80, PADDLE_H = 12, PADDLE_Y = H - 30;
const PADDLE_SPEED = 7;
const BALL_RADIUS = 7;
const BALL_SPEEDS = [3.5, 4.0, 4.5, 5.0, 5.5]; // per level
const MAX_BALL_SPEED = 6.0;
const LIVES_START = 3;
const COMBO_MAX_MULT = 3.0;
const COMBO_MULT_STEP = 0.25; // multiplier = 1.0 + combo * 0.25, capped at 3.0
const POWERUP_DROP_CHANCE = 0.10;
const POWERUP_FALL_SPEED = 1.5;
const POWERUP_WIDE_DURATION = 15000; // ms
const POWERUP_SLOW_DURATION = 10000;
const POWERUP_WIDE_WIDTH = 120;
const POWERUP_SLOW_FACTOR = 0.6;
const POWERUP_SIZE = 10;
const PARTICLE_CAP = 120;
const TRAIL_LENGTH = 3;
const BG_COLOR = '#0d0015';
const PADDLE_COLOR = '#c0c0c0';
const BALL_COLOR_NORMAL = '#f0f0ff';
const BALL_COLOR_COMBO3 = '#ffd54f';
const BALL_COLOR_COMBO6 = '#ff6e40';
const ROW_COLORS = ['#e040fb', '#7c4dff', '#448aff', '#00e676', '#ffea00'];
const ROW_POINTS = [30, 25, 20, 15, 10];
const INDESTRUCTIBLE_COLOR = '#505050';
const CLEAR_BONUS = [500, 1000, 1500, 2000, 2500]; // per level
```

## Data Structures
```js
let bricks = []; // 2D array [{type:'standard'|'multi'|'indestructible', hits:0, maxHits:1|2, row, col, color}]
let ball = { x: 0, y: 0, dx: 0, dy: 0, speed: 3.5, launched: false, trail: [] };
let extraBalls = []; // for multi-ball: [{x, y, dx, dy, speed, trail:[]}]
let paddle = { x: W/2 - PADDLE_W/2, width: PADDLE_W };
let powerUps = []; // [{x, y, type:'wide'|'multi'|'slow', color, rotation:0}]
let particles = []; // [{x, y, dx, dy, size, color, life, maxLife, gravity}]
let floatingTexts = []; // [{text, x, y, vy, life, maxLife, color, size}]
let state = {
  level: 1, score: 0, highScore: 0, lives: LIVES_START,
  combo: 0, phase: 'ready', // 'ready'|'playing'|'levelClear'|'gameOver'
  powerUpTimers: { wide: 0, slow: 0 },
  showTrail: false // enabled from level 4
};
let keysDown = {};
let mouseX = W / 2;
let animFrame = null;
let transitionTimer = 0;
```

## Level Layouts
5 levels stored as 2D arrays. Values: `0`=empty, `1`=standard, `2`=multi-hit (2 hits), `X`=indestructible.

### Level 1: First Light (10×5, all standard)
```js
const LEVEL_1 = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
];
```

### Level 2: Crystal Pillars (10×5, 2 indestructible)
```js
const LEVEL_2 = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,'X',1,1,'X',1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
];
```

### Level 3: Crystal Fortress (10×6, 4 indestructible + 4 multi-hit)
```js
const LEVEL_3 = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,'X',1,1,1,1,'X',1,1],
  [1,1,1,1,'X','X',1,1,1,1],
  [2,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,1,2],
  [1,1,1,1,1,1,1,1,1,1],
];
```

### Level 4: Labyrinth (10×6, zigzag indestructible + 6 multi-hit)
```js
const LEVEL_4 = [
  [2,1,2,1,2,2,1,2,1,2],
  [1,'X',1,'X',1,1,'X',1,'X',1],
  [1,1,1,1,1,'X',1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
];
```

### Level 5: The Vault (10×7, roof of 8 indestructible + 8 multi-hit)
```js
const LEVEL_5 = [
  [1,'X','X','X','X','X','X','X','X',1],
  [1,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
];
```

`const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];`

## Named Functions

### 1. `startBreakoutPrismShatter(canvas, ctx)`
- Load highScore from `localStorage.getItem('arcade_breakout_highscore')`
- Init all state variables, set `state.phase = 'ready'`, `state.level = 1`
- Call `buildLevel(1)` to populate bricks array
- Set up keydown/keyup listeners (ArrowLeft, ArrowRight, Space, r — track in `keysDown`)
- Set up mousemove listener on canvas: `mouseX = e.offsetX`
- Set up click listener: if `state.phase === 'ready'`, launch ball
- Start rAF loop calling `gameLoop(timestamp)`
- Return `{ controls: '← → Move | Space Launch | R Restart', cleanup }`

### 2. `buildLevel(levelNum)`
- Read `LEVELS[levelNum - 1]` template
- Populate `bricks[]` 2D array with brick objects
- Each brick: `{ type, hits: 0, maxHits, row, col, color, x, y, width: BRICK_W, height: BRICK_H, alive: true }`
- Color by row index: `ROW_COLORS[row % ROW_COLORS.length]`
- Indestructible: color = `INDESTRUCTIBLE_COLOR`, maxHits = Infinity
- Multi-hit: maxHits = 2
- Standard: maxHits = 1
- Set `state.showTrail = (levelNum >= 4)`
- Set ball speed: `BALL_SPEEDS[levelNum - 1]` (capped at MAX_BALL_SPEED for hard mode loops)
- Reset ball to paddle, `ball.launched = false`, `state.phase = 'ready'`
- Clear `extraBalls`, `powerUps`, reset `state.combo = 0`

### 3. `updateGame(dt, now)`
- If `state.phase !== 'playing'`: return
- **Paddle input:** if `keysDown.ArrowLeft`, paddle.x -= PADDLE_SPEED. If `keysDown.ArrowRight`, paddle.x += PADDLE_SPEED. Also track mouseX: `paddle.x = mouseX - paddle.width/2`. Clamp `[0, W - paddle.width]`.
- **Power-up timers:** decrement `state.powerUpTimers.wide` and `.slow` by dt. On expiry: reset paddle.width to PADDLE_W, ball speed to level base.
- **Ball update (main + extras):** for each active ball:
  - Push `{x, y}` to trail (max TRAIL_LENGTH entries)
  - Effective speed = `ball.speed * (state.powerUpTimers.slow > 0 ? POWERUP_SLOW_FACTOR : 1.0)`
  - Move: `ball.x += ball.dx * effectiveSpeed`, `ball.y += ball.dy * effectiveSpeed`
  - Wall collisions: left/right → reflect dx. Top → reflect dy.
  - Floor: `ball.y + BALL_RADIUS >= H` → ball lost (see below)
  - Paddle collision: AABB — ball bottom vs paddle top. If hit:
    - `offset = (ball.x - (paddle.x + paddle.width/2)) / (paddle.width/2)`, clamp [-1, 1]
    - `angle = offset * (Math.PI / 3)` (max 60°)
    - `ball.dx = Math.sin(angle)`, `ball.dy = -Math.cos(angle)`
    - Reset combo to 0
    - Play `mirror_ping` zzfx
    - Spawn mirror flash particle (white line on paddle)
  - Brick collisions: iterate all alive bricks, AABB test
    - Determine hit face (compare x/y overlap) to reflect dx or dy
    - Call `hitBrick(brick)`
- **Power-up fall:** for each powerUp: `y += POWERUP_FALL_SPEED`, `rotation += 90 * dt/1000`
  - If y > H: remove
  - If AABB with paddle: collect — call `collectPowerUp(type)`
- **Level clear check:** if no alive destructible bricks remain → `state.phase = 'levelClear'`, start clear animation

### 4. `hitBrick(brick)`
- `brick.hits++`
- If brick.type === 'indestructible': play thunk sound (220Hz, 100ms), spawn 2 gray particles, return
- If brick.hits >= brick.maxHits: destroy brick
  - `brick.alive = false`
  - `state.combo++`
  - `multiplier = Math.min(COMBO_MAX_MULT, 1.0 + state.combo * COMBO_MULT_STEP)`
  - `points = ROW_POINTS[brick.row % ROW_POINTS.length] * multiplier`
  - `state.score += Math.round(points)`
  - Play `glass_clink` zzfx (pitch varies: 2200Hz top row → 1400Hz bottom row)
  - Spawn 6 crystal shatter particles in brick.color
  - If combo === 3: play `heat_sizzle`, spawn 4-particle burst, ball color → yellow
  - If combo === 6: play `heat_sizzle`, spawn 8-particle burst, ball color → orange
  - Show floating text with multiplier if combo >= 3
  - Roll power-up drop: `Math.random() < POWERUP_DROP_CHANCE` → spawn power-up gem at brick center
  - Check row clear: if all bricks in this row destroyed → spawn light beam effect, play `chime_cascade`
- Else (multi-hit, first hit): play `glass_clink` at 50% pitch (900Hz), add crack overlay flag

### 5. `collectPowerUp(type)`
- Play `gem_pickup` zzfx
- If 'wide': `paddle.width = POWERUP_WIDE_WIDTH`, `state.powerUpTimers.wide = POWERUP_WIDE_DURATION`
- If 'slow': `state.powerUpTimers.slow = POWERUP_SLOW_DURATION`
- If 'multi': spawn 2 extra balls from current ball position with ±30° angle variation
  - Push to `extraBalls[]`
- Show floating text with power-up name

### 6. `onBallLost(ballRef)`
- If ballRef is an extra ball: remove from extraBalls, return
- If extraBalls.length > 0: promote first extra to main ball, return
- `state.lives--`
- If `state.lives <= 0`: `state.phase = 'gameOver'`, trigger game over animation
- Else: reset ball to paddle, `ball.launched = false`, `state.phase = 'ready'`, play `drop_womp`

### 7. `renderGame()`
```
1. Fill canvas BG_COLOR
2. If level >= 4: draw radial gradient centered on ball (150px radius, #1a0030)
3. Draw bricks:
   - Alive standard/multi: roundedRect in row color, 3px border-radius
   - 1px lighter highlight top/left edge for crystal facet
   - Multi-hit with hits > 0: draw crack overlay (2 diagonal white lines, 40% opacity)
   - Indestructible: gray with metallic sheen (1px white top, 1px dark bottom)
4. Draw paddle: roundedRect PADDLE_COLOR, 6px border-radius, 1px white top highlight
5. Draw ball trail (if state.showTrail or combo >= 6):
   - Draw trail positions at 60%, 30%, 10% opacity, color matches ball state
6. Draw ball: circle BALL_RADIUS with glow
   - Color: combo < 3 → BALL_COLOR_NORMAL, combo 3-5 → BALL_COLOR_COMBO3, combo 6+ → BALL_COLOR_COMBO6
   - shadowBlur: combo < 3 → 3px, combo 3-5 → 5px, combo 6+ → 7px
7. Draw extra balls (same style)
8. Draw power-up gems: rotated squares (diamond), pulsing glow, color by type
   - Wide: #448aff, Slow: #ffea00, Multi: #00e676
9. Draw particles
10. Draw floating texts (score popups, power-up names)
11. Draw HUD:
    - Score: top-left, "SCORE: N" 16px monospace #e0e0e0
    - Level: top-center, "LEVEL N" 16px monospace #e0e0e0
    - Combo: center-right (if combo >= 3), "COMBO ×N.NN" 14px #ffea00, pulsing
    - Lives: bottom-left, small ball icons (6px radius, #f0f0ff)
    - High score: top-right, "HI: N" 14px #7c4dff
12. If phase === 'ready': "CLICK or SPACE to launch" center, 14px, pulsing opacity
13. If phase === 'levelClear': prismatic explosion animation + clear bonus text
14. If phase === 'gameOver':
    - Shatter remaining bricks animation
    - Dark overlay
    - "GAME OVER" 28px #e040fb
    - "Score: N" 20px #e0e0e0
    - "High Score: N" 16px #7c4dff
    - "Press R to restart" 14px pulsing
    - Save high score to localStorage
```

### 8. `cleanup()`
- Cancel rAF (`cancelAnimationFrame(animFrame)`)
- Remove keydown/keyup listeners
- Remove mousemove/click listeners from canvas
- Clear all arrays (bricks, particles, powerUps, extraBalls, floatingTexts)

## zzfx Sound Effects (7 sounds)
```js
const SFX = {
  glass_clink:     (pitch) => zzfx(...[.3,,pitch||1800,.01,.02,.05,1,2,,,,,,,,,,.3,.01]),
  mirror_ping:     () => zzfx(...[.2,,880,.01,.01,.04,1,1,,,,,,,,,,.3,.01]),
  drop_womp:       () => zzfx(...[.4,,400,.02,.1,.15,2,1,-10,,,,,,,,,.5,.05]),
  chime_cascade:   () => zzfx(...[.3,,1200,.01,.15,.1,1,1,,,,,,,,,,.4,.02]),
  heat_sizzle:     () => zzfx(...[.2,,0,.01,.1,.05,4,2,,,,,,,,,,.2,.01]),
  victory_cascade: () => zzfx(...[.5,,523,.02,.3,.2,1,1,,,,,,,,,,.8,.1]),
  gem_pickup:      () => zzfx(...[.3,,660,.01,.05,.05,1,1,,,990,,,,,,,,,.02]),
};
```
(Exact zzfx params to be tuned during build.)

## Transitions

### Level Clear Sequence (1500ms total)
1. `state.phase = 'levelClear'`
2. Play `victory_cascade` zzfx
3. Spawn 50 prismatic particles (10 per row color) with radial burst from center, confetti physics
4. Show "LEVEL N CLEAR!" text 24px #ffea00 for 500ms
5. Show clear bonus "+Npts" 20px for 500ms
6. Fade to black (300ms)
7. If level < 5: `state.level++`, call `buildLevel(state.level)`
8. If level === 5: increment speed by 1.0, loop to level 1 (hard mode)

### Game Over Sequence (1000ms)
1. All remaining bricks shatter simultaneously (6 particles each)
2. Dark overlay fades in (200ms)
3. Score + high score display
4. Update localStorage if new high score

### Brick Materialize (on level start, 600ms)
- Bricks appear row-by-row top→bottom, 80ms per row (opacity 0→1)
- Paddle slides up from bottom edge

## Integration with index.html
1. Add `<script src="js/games/breakout-prism-shatter.js"></script>` before `js/main.js`
2. In `launchGame()`: replace `startBreakout(canvas, ctx)` with `startBreakoutPrismShatter(canvas, ctx)`

## Acceptance Criteria
- [ ] Game loads in browser without JS errors
- [ ] Canvas renders at 600x400
- [ ] Arrow keys and mouse move paddle smoothly
- [ ] Space/click launches ball from paddle
- [ ] Ball reflects off walls, ceiling, paddle, bricks correctly
- [ ] Paddle hit position affects ball angle (max 60°)
- [ ] 5 level layouts render correctly with correct brick types
- [ ] Standard bricks destroy in 1 hit with crystal shatter particles
- [ ] Multi-hit bricks show crack after 1st hit, destroy on 2nd
- [ ] Indestructible bricks bounce ball, never destroyed
- [ ] Combo counter increments on consecutive brick hits, resets on paddle hit
- [ ] Score multiplier = 1.0 + combo × 0.25, capped at 3.0×
- [ ] Ball color changes at combo 3 (yellow) and 6 (orange)
- [ ] Power-ups drop at ~10% chance, fall as rotating gems
- [ ] Wide paddle, multi-ball, slow power-ups work correctly
- [ ] 3 lives displayed as ball icons, decrement on ball lost
- [ ] Level clear triggers prismatic explosion + bonus
- [ ] Hard mode loop after level 5 (speed +1.0)
- [ ] Ball trail shows from level 4+
- [ ] 7 zzfx sounds trigger at correct events
- [ ] Game over displays score, high score, restart prompt
- [ ] R restarts without page reload
- [ ] High score persists via localStorage key `arcade_breakout_highscore`
- [ ] No hardcoded localhost in any URL
- [ ] Works from LAN IP
- [ ] cleanup() cancels rAF, removes all listeners
- [ ] Particle cap respected (120 max)
- [ ] Row clear triggers light beam effect
