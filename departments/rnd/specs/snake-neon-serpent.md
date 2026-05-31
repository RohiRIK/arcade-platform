# Spec: Snake — Neon Serpent (Phase 2)

**Date:** 2026-05-31
**Research:** departments/rnd/research/snake-neon-serpent.md
**Pitch:** departments/rnd/pitches/snake-neon-serpent.md
**Creative Script:** departments/creative/scripts/snake-neon-serpent-stages.md
**CTO Review:** departments/cto/reviews/2026-05-31-snake-neon-serpent-research.md
**Phase:** arcade-evolution Phase 2

---

## Overview

Full rewrite of `startSnake()` (currently 162 lines) into ~450-line Neon Serpent with 8 implicit stages, combo system, particle effects, zzfx audio, bonus food, and localStorage persistence. Uses Canvas 2D directly (not LittleJS renderer). Imports `playSound()` and `drawGameOverOverlay()` from Phase 1 shared modules.

---

## CTO Requirements (all 3 addressed)

1. **zzfx ambient loop:** Decision: **Raw Web Audio oscillator** for ambient_hum and heartbeat. Simple sine oscillator with GainNode envelope. ~25 lines. No zzfx looping hack.
2. **Particle cap:** Hard max **150 particles**. Oldest-first eviction (shift from array when length exceeds cap).
3. **Code decomposition:** 8 named internal functions inside `startSnake()` closure (see §Architecture).

---

## Constants

```js
// Canvas
const W = canvas.width;           // 600
const H = canvas.height;          // 400
const CELL = 20;
const COLS = Math.floor(W / CELL); // 30
const ROWS = Math.floor(H / CELL); // 20

// Speed
const INITIAL_SPEED = 120;        // ms per tick
const MIN_SPEED = 50;
const SPEED_DECREMENT = 5;        // per 5 food (smoother than current 8)
const SPEED_UP_EVERY = 5;

// Scoring
const POINTS_PER_FOOD = 10;
const POINTS_PER_FOOD_STAGE8 = 15;
const BONUS_FOOD_POINTS = 50;
const BONUS_FOOD_INTERVAL = 10;   // every 10th food
const BONUS_FOOD_TIMEOUT = 5000;  // ms

// Combo
const COMBO_WINDOW = 2000;        // ms to chain
const COMBO_TIERS = [1, 2, 3, 5, 8]; // multipliers

// Particles
const MAX_PARTICLES = 150;

// Audio
const AMBIENT_FREQ = 80;          // Hz sine
const HEARTBEAT_FREQ = 60;        // Hz sine
const HEARTBEAT_INTERVAL = 1000;  // ms
```

---

## Architecture — Named Internal Functions

All inside `startSnake()` closure:

| Function | Responsibility |
|----------|---------------|
| `getStageConfig(foodEaten)` | Returns stage object {bgColor, gridColor, gridOpacity, speed, fireflyCount, effects} |
| `updateSnake()` | Grid movement, collision, food eating, scoring |
| `updateParticles(delta)` | Move particles, decay life, evict dead, enforce 150 cap |
| `updateCombo()` | Check combo window, update tier, spawn combo text |
| `updateAudio()` | Manage ambient oscillator gain, heartbeat timing |
| `drawBackground(stageConfig)` | Fill, grid, fireflies, vignette, wave distortion |
| `drawSnake()` | Body segments with glow, head, afterimage trail |
| `drawHUD()` | Score, combo indicator, stage number |
| `spawnParticles(type, x, y)` | Create particle burst by type (food/star/death/ring/trail/afterimage) |

---

## Data Structures

```js
// Snake
let snake = []; // Array of {x, y} grid coords, head at [0]
let direction = {x: 1, y: 0};
let nextDirection = null; // buffered input

// State
let score = 0;
let highScore = parseInt(localStorage.getItem('arcade_snake_highscore')) || 0;
let zoneReached = localStorage.getItem('arcade_snake_zone_reached') === 'true';
let foodEaten = 0;
let running = false;
let gameOver = false;
let currentStage = 1;
let previousStage = 1;
let stageTransitionT = 0; // 0-1, for color lerp

// Food
let food = {x: 0, y: 0};
let bonusFood = {x: 0, y: 0, active: false, spawnTime: 0};

// Combo
let comboTier = 0;       // index into COMBO_TIERS
let lastEatTime = 0;

// Particles
let particles = [];      // Array of {x,y,vx,vy,life,maxLife,size,color,type}

// Floating text
let floatingTexts = [];  // Array of {text,x,y,vy,life,maxLife,color,fontSize}

// Timing
let lastTime = 0;
let tickAccumulator = 0;
let currentSpeed = INITIAL_SPEED;

// Audio
let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;
let heartbeatTimeout = null;
```

---

## Stage Configuration

```js
function getStageConfig(foodEaten) {
  const stages = [
    { min:0,  bg:'#0a0a1a', grid:'#141428', gridOp:0.3, speed:120, flies:0,  vignette:false, wave:false, heartbeat:false, afterimage:false, foodPts:10 },
    { min:5,  bg:'#0a0a1a', grid:'#1e1e3c', gridOp:0.5, speed:115, flies:0,  vignette:false, wave:false, heartbeat:false, afterimage:false, foodPts:10 },
    { min:10, bg:'#0a0a1a', grid:'#1e1e3c', gridOp:0.5, speed:110, flies:5,  vignette:false, wave:false, heartbeat:false, afterimage:false, foodPts:10 },
    { min:15, bg:'#0a0a1a', grid:'#1e1e3c', gridOp:0.5, speed:105, flies:10, vignette:false, wave:false, heartbeat:false, afterimage:false, foodPts:10 },
    { min:20, bg:'#08081a', grid:'#1a1a40', gridOp:0.4, speed:100, flies:10, vignette:true,  wave:false, heartbeat:false, afterimage:false, foodPts:10 },
    { min:25, bg:'#08081a', grid:'#1a1a40', gridOp:0.4, speed:95,  flies:10, vignette:true,  wave:false, heartbeat:false, afterimage:false, foodPts:10 },
    { min:35, bg:'#050510', grid:'#141428', gridOp:0.2, speed:85,  flies:0,  vignette:true,  wave:true,  heartbeat:true,  afterimage:false, foodPts:10 },
    { min:45, bg:'#030308', grid:'#000000', gridOp:0.0, speed:50,  flies:0,  vignette:true,  wave:false, heartbeat:true,  afterimage:true,  foodPts:15 },
  ];
  for (let i = stages.length - 1; i >= 0; i--) {
    if (foodEaten >= stages[i].min) return { ...stages[i], index: i + 1 };
  }
  return { ...stages[0], index: 1 };
}
```

Stage 6 speed ramps from 95→90 over its 10-food span. Interpolate: `speed = 95 - (foodEaten - 25) * 0.5`.
Stage 7 speed ramps from 85→80 similarly.

### Stage Transitions

When `currentStage !== previousStage`:
- Set `stageTransitionT = 0`
- Over 500ms, lerp `stageTransitionT` from 0→1
- Interpolate bgColor, gridColor, gridOpacity between old and new stage configs
- `lerpColor(a, b, t)` utility: parse hex, lerp each RGB channel

---

## Game Loop

```
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  if (running) {
    tickAccumulator += delta;
    while (tickAccumulator >= currentSpeed) {
      if (nextDirection) { direction = nextDirection; nextDirection = null; }
      updateSnake();
      tickAccumulator -= currentSpeed;
      if (gameOver) break;
    }
    updateParticles(delta);
    updateCombo();
    updateFloatingTexts(delta);
    updateStageTransition(delta);
    updateFireflies(delta);
  }

  draw();
  if (!gameOver) rafId = requestAnimationFrame(gameLoop);
}
```

---

## Combo System

```
function updateCombo() {
  // Called after eating food — check if within window
  // If now - lastEatTime > COMBO_WINDOW, reset comboTier to 0
}

// On food eat:
if (now - lastEatTime <= COMBO_WINDOW && lastEatTime > 0) {
  comboTier = Math.min(comboTier + 1, COMBO_TIERS.length - 1);
} else {
  comboTier = 0;
}
lastEatTime = now;
const multiplier = COMBO_TIERS[comboTier];
score += pointsPerFood * multiplier;

// Spawn floating text: "+10 ×3" at food position
// At comboTier >= 1: spawn combo_ding sound
// At comboTier == 2 (×3): snake body flashes (Stage 6+ visual from creative script)
// At comboTier == 4 (×8): "MEGA COMBO" text + star burst particles
```

---

## Bonus Food

```
// Every BONUS_FOOD_INTERVAL (10th) food eaten:
if (foodEaten % BONUS_FOOD_INTERVAL === 0 && foodEaten > 0) {
  bonusFood.active = true;
  bonusFood.x = randomFreeCell().x;
  bonusFood.y = randomFreeCell().y;
  bonusFood.spawnTime = performance.now();
}

// Update: if active and elapsed > BONUS_FOOD_TIMEOUT, deactivate with shrink
// Draw: gold diamond (#ffea00), spinning (rotation += 180°/s * delta)
// Pickup: BONUS_FOOD_POINTS * COMBO_TIERS[comboTier], play bonus_chime, star burst particles
```

---

## Particle System

6 types, all procedural:

| Type | Count | Size | Life | Color | Trigger |
|------|-------|------|------|-------|---------|
| food_burst | 12 | 2-4px | 400ms | food color | Food eaten |
| star_burst | 20 | 2-5px | 600ms | #ffea00 | Bonus food / Stage 8 food |
| death_sparks | 30 | 2-3px | 800ms | #ff1744 + #39ff14 | Death |
| ring_pulse | 1 | 0→100px | 500ms | #39ff14 at 30% | Every 5th food |
| trail_glow | 1/tick | 3px | 300ms | #39ff14 at 20% | Always (head position) |
| afterimage | body.length | 2px | 1500ms | #39ff14 at 15% | Stage 8, every 500ms |

```js
function spawnParticles(type, cx, cy) {
  // Create particles based on type table above
  // Random velocity: food_burst ±2px/frame, star_burst ±3, death ±4
  // Push to particles[], enforce MAX_PARTICLES via shift()
}

function updateParticles(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * (delta / 16);
    p.y += p.vy * (delta / 16);
    p.life -= delta;
    if (p.life <= 0) { particles.splice(i, 1); }
  }
  // Cap enforcement
  while (particles.length > MAX_PARTICLES) particles.shift();
}
```

---

## Audio

### zzfx One-Shot Sounds (7 total)

All via `playSound(params)` from shared audio.js:

| Sound | Trigger | zzfx params (tuned at build) |
|-------|---------|-----|
| pickup_blip | Food eaten | Short high chirp |
| bonus_chime | Bonus food eaten | Rising sparkle |
| death_buzz | Death | Low distorted buzz |
| levelup_fanfare | Stage change | Quick ascending |
| combo_ding | Combo tier up | Bright ping |
| start_whoosh | Game start | Soft whoosh |
| heartbeat_thump | Stage 7+ interval | 60Hz thud 50ms |

### Web Audio Oscillator (ambient_hum)

```js
function initAmbientAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  ambientOsc = audioCtx.createOscillator();
  ambientGain = audioCtx.createGain();
  ambientOsc.type = 'sine';
  ambientOsc.frequency.value = AMBIENT_FREQ;
  ambientGain.gain.value = 0; // starts silent
  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);
  ambientOsc.start();
}

function updateAudio() {
  const stage = getStageConfig(foodEaten);
  // Stage 1-2: gain 0.02-0.05
  // Stage 3-6: gain 0.05-0.10
  // Stage 7+: switch to heartbeat mode (pulse gain on/off at HEARTBEAT_INTERVAL)
  // Ramp gain with linearRampToValueAtTime for smooth transitions
}
```

Audio init on first user keypress (browser autoplay policy).

---

## Rendering — Draw Order

```js
function draw() {
  const cfg = getStageConfig(foodEaten);
  drawBackground(cfg);
  drawFireflies(cfg);
  if (cfg.vignette) drawVignette();
  if (cfg.afterimage) drawAfterimages();
  drawTrailParticles();
  drawSnake();
  drawFood();
  if (bonusFood.active) drawBonusFood();
  drawParticles(); // non-trail particles on top
  drawRingPulse();
  drawHUD();
  drawFloatingTexts();
  if (gameOver) {
    drawGameOverOverlay(ctx, {
      score, highScore,
      isNewBest: score === highScore && score > 0,
      accent: '#39ff14'
    });
  }
}
```

### drawBackground(cfg)
- Fill canvas with `cfg.bg` (lerped during transitions)
- Draw grid: vertical + horizontal lines at CELL intervals, `cfg.grid` color, `cfg.gridOp` opacity
- Stage 4: grid opacity oscillates (sin wave, 4000ms period)
- Stage 7: horizontal sine distortion on grid lines (amplitude 2px)

### drawSnake()
- Body: rounded rects (radius 3px), `#39ff14`, 1px lighter border `#7dff6b`
- Head: same but 2px glow (shadowBlur=8, shadowColor=#39ff14)
- Stage 4+: body segments get 1px `#2acc0e` border glow
- Stage 6 combo ×3+: alternate body colors every 200ms

### drawHUD()
- Top-left: `SCORE: {score}` 16px monospace white
- Top-right: `BEST: {highScore}` 14px monospace #888
- Top-center: combo indicator when active — `×{multiplier}` in #ffea00, size scales with tier (14→22px)
- Bottom-right: `STAGE {n}` 12px monospace #666

---

## localStorage

```js
// On game over:
if (score > highScore) {
  highScore = score;
  localStorage.setItem('arcade_snake_highscore', highScore);
}
if (currentStage >= 8 && !zoneReached) {
  zoneReached = true;
  localStorage.setItem('arcade_snake_zone_reached', 'true');
  // Trigger Stage 8 unlock celebration: particle rain + "∞ THE ZONE ∞" text
}
```

---

## Input Handling

```js
const onKey = (e) => {
  if (gameOver && e.key === 'r') { resetGame(); return; }
  const map = {
    ArrowUp: {x:0,y:-1}, ArrowDown: {x:0,y:1},
    ArrowLeft: {x:-1,y:0}, ArrowRight: {x:1,y:0}
  };
  const nd = map[e.key];
  if (nd && !(nd.x === -direction.x && nd.y === -direction.y)) {
    nextDirection = nd;
    e.preventDefault();
  }
  // Init audio on first keypress
  if (!audioCtx) initAmbientAudio();
};
document.addEventListener('keydown', onKey);
```

---

## Cleanup (Stop Contract)

```js
return {
  controls: 'Arrow keys to move. R to restart. Chain combos for high scores!',
  cleanup: () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener('keydown', onKey);
    if (ambientOsc) { ambientOsc.stop(); ambientOsc.disconnect(); }
    if (ambientGain) ambientGain.disconnect();
    if (audioCtx) audioCtx.close();
    if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
    particles.length = 0;
    floatingTexts.length = 0;
  }
};
```

---

## Acceptance Criteria

- [ ] Game loads in browser without JS errors
- [ ] Canvas renders at 600×400
- [ ] Arrow key controls respond, 180° reversal blocked
- [ ] Score displays and increments (10pts × combo multiplier)
- [ ] High score persists in localStorage across page reloads
- [ ] Combo system: chaining within 2s increases tier, timeout resets
- [ ] Bonus food spawns every 10th food, despawns after 5s
- [ ] 8 stages trigger at correct food thresholds (5,10,15,20,25,35,45)
- [ ] Stage transitions: 500ms color lerp, no loading screens
- [ ] Particles render and cap at 150 max
- [ ] zzfx sounds play on: food pickup, bonus, death, stage change, combo, start
- [ ] Ambient audio: sine oscillator fades in, heartbeat at Stage 7+
- [ ] Game over uses shared `drawGameOverOverlay()` with accent `#39ff14`
- [ ] Restart via R key works without page reload
- [ ] No hardcoded localhost in code
- [ ] Works from LAN IP
- [ ] Code decomposed into 8+ named functions (no monolith)
- [ ] All constants named at top, no magic numbers inline
