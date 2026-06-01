# Spec: Tetris Cascade

## Overview
Rewrite Tetris as "Cascade" — a zen-industrial Tetris with liquid-metal visuals, 5 seamless stages, SRS rotation with wall kicks, T-spin detection, combo system, 8 zzfx sounds, particle effects, and progressive background tension.

Implements Creative Direction: `departments/creative/artifacts/tetris-creative-direction.md`
Stage Script: `departments/creative/scripts/tetris-cascade-stages.md`

Function: `startTetrisCascade(canvas, ctx)` in `frontend/public/js/games/tetris-cascade.js`
Returns: `{ controls: string, cleanup: Function }`

Canvas: 600×400, `#0a0e14` background.

## Acceptance Criteria
- [ ] Game loads in browser without JS errors
- [ ] Canvas renders at 600×400
- [ ] Arrow keys move/rotate, Space hard drops, C holds piece
- [ ] Score displays and increments on line clears
- [ ] Game over triggers when pieces stack to top
- [ ] Restart works with R key without page reload
- [ ] No hardcoded localhost in any URL
- [ ] SRS rotation with wall kicks works for all 7 pieces
- [ ] Ghost piece shows drop preview
- [ ] Next piece and Hold piece display correctly
- [ ] All 5 stages transition seamlessly by level
- [ ] T-spin detection awards 2× multiplier
- [ ] Combo counter tracks consecutive clears
- [ ] 8 zzfx sounds play on correct events
- [ ] Line clear animations (single/double/triple/Tetris meltdown)
- [ ] High score persists via localStorage

## Constants
```js
const W = 600, H = 400;
const COLS = 10, ROWS = 20;
const CELL_SIZE = 18;             // 10×18=180px wide, 20×18=360px tall
const WELL_X = 30;                // left margin to center well
const WELL_Y = 16;                // top margin
const CELL_DRAW = 16;             // 16px drawn in 18px slot (1px gap)

// Right panel layout
const PANEL_X = WELL_X + COLS * CELL_SIZE + 20;  // 230
const PREVIEW_CELL = 14;          // smaller cells for next/hold preview

// Colors
const BG_COLOR = '#0a0e14';
const WELL_BORDER = '#1c2833';
const GRID_LINE = '#111820';
const SCORE_COLOR = '#b0bec5';
const LABEL_COLOR = '#78909c';

const PIECE_COLORS = {
  I: '#00bcd4',  // cyan liquid metal
  O: '#ffc107',  // gold alloy
  T: '#9c27b0',  // purple titanium
  S: '#4caf50',  // green chrome
  Z: '#f44336',  // red-hot iron
  L: '#ff9800',  // orange copper
  J: '#2196f3',  // blue steel
};

// Drop speed per level (ms)
const DROP_SPEEDS = [
  800,  // level 1
  740,  // level 2
  680,  // level 3
  620,  // level 4
  560,  // level 5
  500,  // level 6
  440,  // level 7
  380,  // level 8
  320,  // level 9
  260,  // level 10
  200,  // level 11
  140,  // level 12
];
const MIN_DROP_SPEED = 100;       // level 13+

// Lock delay
const LOCK_DELAY = 500;           // ms before piece locks after landing
const MAX_LOCK_RESETS = 15;       // max lock delay resets per piece

// Scoring
const LINE_SCORES = [0, 100, 300, 500, 800];  // 0-4 lines × level
const TSPIN_MULTIPLIER = 2;
const COMBO_BONUS = 50;           // per combo level × level
const MELTDOWN_MULTIPLIER = 1.5;  // stage 5 (level 12+)

const LINES_PER_LEVEL = 10;

const PARTICLE_CAP = 200;
```

## Data Structures

### Tetrominoes (SRS)
Each piece defined as 4 rotation states. Each state is an array of 4 [col, row] offsets relative to rotation center.

```js
const PIECES = {
  I: [
    [[0,1],[1,1],[2,1],[3,1]],    // 0°
    [[2,0],[2,1],[2,2],[2,3]],    // 90°
    [[0,2],[1,2],[2,2],[3,2]],    // 180°
    [[1,0],[1,1],[1,2],[1,3]],    // 270°
  ],
  O: [
    [[1,0],[2,0],[1,1],[2,1]],    // all same
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
  ],
  T: [
    [[1,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[2,1],[1,2]],
    [[1,0],[0,1],[1,1],[1,2]],
  ],
  S: [
    [[1,0],[2,0],[0,1],[1,1]],
    [[1,0],[1,1],[2,1],[2,2]],
    [[1,1],[2,1],[0,2],[1,2]],
    [[0,0],[0,1],[1,1],[1,2]],
  ],
  Z: [
    [[0,0],[1,0],[1,1],[2,1]],
    [[2,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[1,2],[2,2]],
    [[1,0],[0,1],[1,1],[0,2]],
  ],
  L: [
    [[2,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[2,2]],
    [[0,1],[1,1],[2,1],[0,2]],
    [[0,0],[1,0],[1,1],[1,2]],
  ],
  J: [
    [[0,0],[0,1],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[1,2]],
    [[0,1],[1,1],[2,1],[2,2]],
    [[1,0],[1,1],[0,2],[1,2]],
  ],
};
```

### SRS Wall Kick Data
Standard SRS wall kick tables for JLSTZ and I pieces.

```js
// JLSTZ kick table: [rotation_from][rotation_to] = array of [dx, dy] offsets
const KICK_JLSTZ = {
  '0>1': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '1>0': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '1>2': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '2>1': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '2>3': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '3>2': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '3>0': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '0>3': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
};

const KICK_I = {
  '0>1': [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  '1>0': [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  '1>2': [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
  '2>1': [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  '2>3': [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  '3>2': [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  '3>0': [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  '0>3': [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
};
```

### Game State
```js
let board;           // ROWS×COLS 2D array, null=empty, string=color
let currentPiece;    // { type, rotation, col, row, color }
let nextPiece;       // same shape
let holdPiece;       // same shape or null
let holdUsed;        // boolean, reset per drop
let score, level, linesCleared, highScore;
let comboCount;      // consecutive clears without dry lock
let gameOver, paused;
let dropTimer;       // ms since last drop
let lockTimer;       // ms since piece landed
let lockResets;       // count of lock resets this piece
let particles;       // array of particle objects
let ambientParticles; // array of background spark particles
let animFrameId;
let lastTime;
let screenShake;     // { x, y, duration, elapsed }
let flashText;       // { text, color, size, x, y, elapsed, duration, pulse }
let levelUpFlash;    // { elapsed, duration }
let lineClearAnim;   // { rows: [], elapsed, duration, type }
let gameOverAnim;    // { row, elapsed }
let bagQueue;        // 7-bag randomizer remaining pieces
```

## 7-Bag Randomizer
```
function fillBag():
  bagQueue = shuffle(['I','O','T','S','Z','L','J'])

function nextFromBag():
  if bagQueue is empty: fillBag()
  return bagQueue.pop()
```

## Core Game Loop

```
function gameLoop(timestamp):
  if gameOver:
    updateGameOverAnim(dt)
    render()
    animFrameId = requestAnimationFrame(gameLoop)
    return

  dropTimer += dt
  dropSpeed = getDropSpeed(level)

  // Auto-drop
  if dropTimer >= dropSpeed:
    if canMove(0, 1):
      currentPiece.row++
      dropTimer = 0
      lockTimer = 0
    else:
      // Piece on ground, lock delay
      lockTimer += dt
      if lockTimer >= LOCK_DELAY:
        lockPiece()

  updateParticles(dt)
  updateAmbientParticles(dt)
  updateScreenShake(dt)
  updateFlashText(dt)
  updateLevelUpFlash(dt)
  updateLineClearAnim(dt)
  render()
  animFrameId = requestAnimationFrame(gameLoop)
```

## Input Handling

```
document keydown handler:
  ArrowLeft  → tryMove(-1, 0), play metal_tick
  ArrowRight → tryMove(1, 0), play metal_tick
  ArrowDown  → softDrop (move down 1, award 1 point, reset dropTimer)
  ArrowUp    → tryRotate(+1), play gear_click
  Space      → hardDrop (instant drop, lock immediately), play slam_impact
  c/C        → holdSwap
  r/R        → restart (if gameOver)
  p/P        → toggle pause

On move/rotate success while on ground: reset lockTimer, increment lockResets (up to MAX_LOCK_RESETS)
```

## Movement & Rotation

```
function canPlace(type, rotation, col, row):
  for each [dx, dy] in PIECES[type][rotation]:
    x = col + dx
    y = row + dy
    if x < 0 or x >= COLS: return false
    if y >= ROWS: return false
    if y >= 0 and board[y][x] !== null: return false
  return true

function tryMove(dx, dy):
  if canPlace(type, rotation, col+dx, row+dy):
    col += dx; row += dy
    return true
  return false

function tryRotate(direction):  // +1 = CW, -1 = CCW
  newRot = (rotation + direction + 4) % 4
  kickTable = (type === 'I') ? KICK_I : KICK_JLSTZ
  key = `${rotation}>${newRot}`
  for each [dx, dy] in kickTable[key]:
    if canPlace(type, newRot, col+dx, row+dy):
      col += dx; row += dy
      rotation = newRot
      return true  // also set lastMoveWasRotation = true for T-spin check
  return false
```

## T-Spin Detection
After locking a T-piece that was last moved by rotation:
```
function isTSpin(piece):
  if piece.type !== 'T': return false
  if !lastMoveWasRotation: return false
  // Check 4 diagonal corners of T center
  cx = piece.col + 1  // T center col
  cy = piece.row + 1  // T center row
  corners = [[cx-1,cy-1],[cx+1,cy-1],[cx-1,cy+1],[cx+1,cy+1]]
  filledCorners = count corners where (out of bounds OR board cell filled)
  return filledCorners >= 3
```

## Lock Piece
```
function lockPiece():
  play clamp_thud
  // Place cells on board
  for each [dx, dy] in PIECES[type][rotation]:
    x = col + dx; y = row + dy
    if y < 0: gameOver = true; return
    board[y][x] = PIECE_COLORS[type]
  
  // Solidify flash particles (150ms white highlight per cell)
  spawnSolidifyParticles(currentPiece)
  
  // Check for completed lines
  clearedRows = findFullRows()
  
  if clearedRows.length > 0:
    // T-spin check
    tSpin = isTSpin(currentPiece)
    
    // Score
    baseScore = LINE_SCORES[clearedRows.length] * level
    if tSpin: baseScore *= TSPIN_MULTIPLIER
    if level >= 12: baseScore *= MELTDOWN_MULTIPLIER  // stage 5
    
    // Combo
    comboCount++
    comboBonus = comboCount * COMBO_BONUS * level
    score += baseScore + comboBonus
    
    // Start line clear animation
    startLineClearAnim(clearedRows)
    
    // Play sound
    if clearedRows.length === 4: play meltdown_boom
    else: play drain_hiss
    
    // Flash text
    if tSpin: showFlashText("T-SPIN", '#9c27b0', 20)
    if comboCount > 1: showFlashText("COMBO ×" + comboCount, '#ffc107', 18)
    if clearedRows.length === 4: showFlashText("TETRIS!", '#ffc107', 36)
    
    // Update lines and level
    linesCleared += clearedRows.length
    newLevel = Math.floor(linesCleared / LINES_PER_LEVEL) + 1
    if newLevel > level:
      level = newLevel
      play power_surge
      startLevelUpFlash()
  else:
    comboCount = 0  // combo breaks
  
  // Next piece
  spawnNextPiece()
  holdUsed = false
```

## Line Clear Animation
```
Types by line count:
  1 line:  400ms dissolve drain — cells stretch-y to 0, 3 particles per cell drop down
  2 lines: 500ms double drain + horizontal light bar (#ffffff 15%)
  3 lines: 600ms triple cascade — rows dissolve with 100ms stagger, screen vibrate ±1px 200ms
  4 lines: 800ms Tetris Meltdown — all flash white 100ms → dissolve → 40 particles spray up → shake ±2px 300ms

During animation, cleared rows are visually animating.
After animation completes: remove rows from board, collapse above.
```

## Hold Piece
```
function holdSwap():
  if holdUsed: return
  holdUsed = true
  if holdPiece === null:
    holdPiece = { type: currentPiece.type }
    spawnNextPiece()
  else:
    temp = holdPiece.type
    holdPiece = { type: currentPiece.type }
    spawnPiece(temp)
```

## Ghost Piece
```
function getGhostRow():
  testRow = currentPiece.row
  while canPlace(type, rotation, col, testRow + 1):
    testRow++
  return testRow
```
Draw ghost piece at ghost row with piece color at 20% opacity, outlined (2px border, no fill).

## Rendering

### Well
- Draw well background: filled rect at WELL_X, WELL_Y, COLS×CELL_SIZE, ROWS×CELL_SIZE with BG_COLOR
- Draw grid lines: 1px lines in GRID_LINE color
- Draw well border: 2px stroke in WELL_BORDER color

### Cells (board + current piece)
- Each occupied cell: 16×16 filled rect with piece color
- Bevel effect: 1px lighter line on top + left edges, 1px darker line on bottom + right edges
- Border radius 2px (use roundRect if available, else plain rect)

### Right Panel
Layout at PANEL_X:
```
y=20:   "NEXT" label (LABEL_COLOR, 12px)
y=30:   Next piece preview (4×4 grid, PREVIEW_CELL size)
y=100:  "HOLD" label (LABEL_COLOR, 12px) — only after Stage 2 unlocks it
y=110:  Hold piece preview (4×4 grid, PREVIEW_CELL size)
y=200:  "SCORE" label
y=215:  score value (SCORE_COLOR, 14px)
y=245:  "LEVEL" label
y=260:  level value
y=290:  "LINES" label
y=305:  linesCleared value
y=340:  "HIGH" label
y=355:  highScore value
```

### Background Tension
Interpolate background color from `#0a0e14` to `#1a0a0a` based on highest occupied row:
```
function getBgColor():
  highestRow = find topmost non-empty row in board
  tension = clamp((ROWS - highestRow) / ROWS, 0, 1)
  // Lerp from cold (#0a0e14) to hot (#1a0a0a)
  r = lerp(0x0a, 0x1a, tension)
  g = lerp(0x0e, 0x0a, tension)
  b = lerp(0x14, 0x0a, tension)
  return rgb(r, g, b)
```

### Ambient Particles
Background metallic sparks. Count scales with stage:
- Stage 1-2 (level 1-5): 3 particles
- Stage 3 (level 6-8): 6 particles
- Stage 4 (level 9-11): 8 particles (mix orange + red)
- Stage 5 (level 12+): 12 particles (all piece colors)

Each: 1-2px, 6-10% opacity, random slow drift, respawn when off-screen.

### Screen Shake
When active, offset all rendering by `shake.x, shake.y` (random within ±amplitude).

### Flash Text
Rendered center-screen with pulse scale animation (1.0→1.2→1.0 over duration).

## Stages (Implicit by Level)

### Stage 1: Cold Forge (Level 1-2)
- Background: `#0a0e14` (static)
- 3 ambient sparks
- Basic mechanics only (no hold, no T-spin callout, no combos)

### Stage 2: Warm Metal (Level 3-5)
- Hold piece unlocks (show "HOLD" panel)
- Faint radial gradient behind well
- 3 ambient sparks

### Stage 3: Crucible (Level 6-8)
- T-spin detection active with callout
- Grid line opacity oscillates (sine wave, 4000ms period)
- 6 ambient sparks in orange
- Level-up border pulse + center text

### Stage 4: Red Heat (Level 9-11)
- Combo counter active with display
- Background shifts to red tint
- 8 ambient sparks (orange + red)
- Well border subtly pulses

### Stage 5: Meltdown Zone (Level 12+)
- All scores ×1.5
- 12 ambient particles (all colors)
- Tetris meltdown enhanced: 60 particles, ±3px shake, 42px text
- Drop speed locked at 100ms

## Sound Effects (zzfx)
All wrapped in `try { zzfx(...[...]); } catch(e) {}` pattern.

```js
const SFX = {
  metal_tick:    () => zzfx(...[.2,,600,.01,.03,.01,1,1,,,,,,,,,,,.01]),
  gear_click:    () => zzfx(...[.2,,800,.01,.02,.01,1,1,,,,,,,,,,,.02]),
  clamp_thud:    () => zzfx(...[.3,,150,.01,.08,.05,2,1,,,,,,,,,,,.03]),
  slam_impact:   () => zzfx(...[.5,,80,.01,.12,.08,3,2,,,,,,,,,,,.05]),
  drain_hiss:    () => zzfx(...[.3,,2000,.01,.3,.2,4,1,,-10,,,,,,,,,.1]),
  meltdown_boom: () => zzfx(...[.6,,50,.02,.5,.3,2,2,,,,,,,,,.1,.5,.02]),
  power_surge:   () => zzfx(...[.4,,200,.01,.4,.1,1,2,,,,800,,,,,,,,.1]),
  shutdown:      () => zzfx(...[.4,,400,.02,.6,.3,2,1,,-5,,,,,,,,,.2]),
};
```
(Exact zzfx params to be tuned during build — these are starting points matching the creative spec descriptions.)

## Game Over
```
When a piece spawns overlapping existing cells:
  gameOver = true
  play shutdown
  Start game over animation:
    Gray out rows bottom→top at 50ms per row
    After all rows grayed: show overlay
    Overlay: "GAME OVER" centered, final score, high score
    If new high score: "NEW BEST!" in #ffc107 24px with pulse
    "Press R to restart"
    Save high score to localStorage('tetrisCascadeHigh')
```

## Cleanup Function
```
function cleanup():
  cancelAnimationFrame(animFrameId)
  document.removeEventListener('keydown', keyHandler)
  animFrameId = null
```

## File Structure
Single file: `frontend/public/js/games/tetris-cascade.js`
Function signature: `function startTetrisCascade(canvas, ctx) { ... return { controls, cleanup }; }`

## Integration
In `index.html`:
1. Add `<script src="js/games/tetris-cascade.js"></script>` before main.js
2. Change `launchGame` tetris case: `currentGame = startTetrisCascade(canvas, ctx);`
3. Update touch controls for tetris to include hold (C) button

## Edge Cases
- Piece spawn collision = game over
- Hard drop from spawn position = instant lock at lowest valid row
- Hold swap immediately after another hold swap in same drop = blocked
- T-spin mini (only 2 corners) = not counted (only full T-spin with 3+ corners)
- Lock delay resets on successful move/rotate, max 15 resets
- Wrap-around rotation NOT allowed (standard SRS)
- Board cells above row 0 are valid placement but invisible (buffer zone)
- Soft drop awards 1 point per cell descended
- Hard drop awards 2 points per cell descended
