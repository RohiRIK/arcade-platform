# Spec: Frogger — Neon Crossing

## Overview
Rewrite Frogger as "Neon Crossing" — a cyberpunk street-crossing game where a delivery drone navigates rain-soaked neon city streets and sky platforms. 5 levels with escalating storm intensity, 7 zzfx sounds, continuous rain particles, procedural sprites, and the Perfect Crossing wow moment.

Implements Creative Direction: `departments/creative/artifacts/frogger-creative-direction.md`
Stage Script: `departments/creative/scripts/frogger-neon-crossing-stages.md`

Function: `startFroggerNeonCrossing(canvas, ctx)` in `frontend/public/js/games/frogger-neon-crossing.js`
Returns: `{ controls: string, cleanup: Function }`

Canvas: 600×400, `#0c0c1a` background.

## Acceptance Criteria
- [ ] Game loads in browser without JS errors
- [ ] Canvas renders at 600×400
- [ ] Arrow keys respond with discrete grid hops
- [ ] Road vehicles (cars, trucks, bikes, hover-buses) move and wrap correctly
- [ ] Sky platforms (sky-trains, ad-boards, cargo drones) move and wrap correctly
- [ ] Drone rides sky platforms (moves with them)
- [ ] Cargo drones submerge periodically; drone dies if on them when submerged
- [ ] Collision with vehicles causes death with neon crash particles
- [ ] Falling off platform causes death with splash particles
- [ ] Drone carried off-screen causes death
- [ ] Landing in home slot scores points with slot activation particles
- [ ] All 5 homes filled → level advance with city pulse effect
- [ ] Timer counts down with visual bar; expiry kills drone
- [ ] Score displays and increments correctly
- [ ] Game over state triggers at 0 lives and displays correctly
- [ ] Restart works with R key without page reload
- [ ] No hardcoded localhost in any URL
- [ ] Rain system renders continuously, intensifies per level
- [ ] 7 zzfx sounds play on correct events
- [ ] High score persists via localStorage
- [ ] Perfect Crossing bonus triggers when all 5 homes filled without dying
- [ ] 5 difficulty levels with speed/timer/density progression

## Constants
```js
const W = 600, H = 400;
const COLS = 14, ROWS = 13;
const CELL_W = W / COLS;   // ~42.86px
const CELL_H = H / ROWS;   // ~30.77px

// Colors
const BG_ROAD = '#0c0c1a';
const BG_SKY = '#060618';
const LANE_DIVIDER = '#1a1a30';
const SAFE_ZONE = '#121228';
const DRONE_COLOR = '#76ff03';
const DRONE_GLOW = 3; // px
const DRONE_SIZE = 16;
const CAR_COLOR = '#ff1744';
const TRUCK_COLOR = '#ff6d00';
const BIKE_COLOR = '#e040fb';
const HOVERBUS_COLOR = '#ffab00';
const SKYTRAIN_COLOR = '#00e5ff';
const ADBOARD_COLOR = '#ffd600';
const CARGO_DRONE_COLOR = '#69f0ae';
const HOME_SLOT_COLOR = '#1a237e';
const HOME_FILLED_COLOR = '#76ff03';
const RAIN_COLOR = '#4fc3f7';
const SCORE_COLOR = '#b0bec5';

// Layout
const ROW_HOME = 0;
const ROW_SKY_START = 1;
const ROW_SKY_END = 5;
const ROW_MEDIAN = 6;
const ROW_ROAD_START = 7;
const ROW_ROAD_END = 11;
const ROW_START = 12;

// Home slots
const HOME_SLOTS = 5;
const HOME_SLOT_COLS = [1, 4, 7, 10, 13];
const HOME_SLOT_WIDTH = 1.5;

// Lives
const STARTING_LIVES = 3;

// Scoring
const SCORE_HOP_FORWARD = 10;
const SCORE_HOME_BASE = 200;    // × level
const SCORE_ALL_HOME = 1000;
const SCORE_PERFECT = 2000;
const SCORE_FLYBY = 25;         // level 3+
const EXTRA_LIFE_SCORE = 10000;

// Particles
const PARTICLE_CAP = 150;

// Cargo drone dive timing
const CARGO_DIVE_INTERVAL_BASE = 240; // frames (4s at 60fps)
const CARGO_DIVE_DURATION_BASE = 90;  // frames (1.5s)

// Emergency boost (level 4+)
const BOOST_COOLDOWN = 480; // frames (8s)

// Level configs
const LEVEL_CONFIG = [
  { speedMult: 1.0,  timer: 30, rainCount: 20, diveInterval: 240, diveDuration: 90  },
  { speedMult: 1.1,  timer: 27, rainCount: 30, diveInterval: 240, diveDuration: 90  },
  { speedMult: 1.2,  timer: 24, rainCount: 40, diveInterval: 240, diveDuration: 90  },
  { speedMult: 1.33, timer: 21, rainCount: 50, diveInterval: 180, diveDuration: 90  },
  { speedMult: 1.47, timer: 18, rainCount: 70, diveInterval: 150, diveDuration: 120 },
];
// Level 6+ repeats level 5 config with +5% speed per level past 5
```

## Lane Configuration
```js
// direction: 1 = right, -1 = left
// speed: px/frame at base (multiplied by level speedMult)

const ROAD_LANES = [
  { row: 7,  type: 'car',   dir: -1, speed: 1.5, objW: 30, objH: 16, color: CAR_COLOR,   gap: 80  },
  { row: 8,  type: 'truck', dir:  1, speed: 1.2, objW: 50, objH: 16, color: TRUCK_COLOR,  gap: 120 },
  { row: 9,  type: 'bike',  dir: -1, speed: 2.0, objW: 20, objH: 12, color: BIKE_COLOR,   gap: 90  },
  { row: 10, type: 'truck', dir:  1, speed: 1.8, objW: 50, objH: 16, color: TRUCK_COLOR,  gap: 110 },
  { row: 11, type: 'car',   dir: -1, speed: 1.2, objW: 30, objH: 16, color: CAR_COLOR,   gap: 100 },
];

const SKY_LANES = [
  { row: 1, type: 'skytrain',    dir:  1, speed: 1.0, objW: 80, objH: 16, color: SKYTRAIN_COLOR,    gap: 120 },
  { row: 2, type: 'cargo_drone', dir: -1, speed: 1.0, objW: 24, objH: 16, color: CARGO_DRONE_COLOR, gap: 70,  diving: true },
  { row: 3, type: 'skytrain',    dir:  1, speed: 1.2, objW: 80, objH: 16, color: SKYTRAIN_COLOR,    gap: 100 },
  { row: 4, type: 'adboard',     dir: -1, speed: 0.8, objW: 40, objH: 14, color: ADBOARD_COLOR,     gap: 60  },
  { row: 5, type: 'cargo_drone', dir:  1, speed: 1.0, objW: 24, objH: 16, color: CARGO_DRONE_COLOR, gap: 80,  diving: false },
];

// Level 3+: one road lane replaced with hover-bus
// Level 4+: one road lane becomes speed-bike (3.5px/frame base)
// Level 5+: 2 speed-bike lanes, 3 hover-buses
```

## Data Structures

### Drone (Player)
```js
let drone = {
  gridX: 7,
  gridY: ROW_START,
  pixelX: 0, pixelY: 0,  // for smooth riding
  alive: true,
  highestRow: ROW_START,
  ridingLane: null,
  deathsThisLevel: 0,     // for Perfect Crossing tracking
  boostCooldown: 0,        // frames remaining (level 4+)
};
```

### Lane Objects
```js
// Generated from lane configs
// Each lane: { config, objects[], diveTimer, submerged }
// Each object: { x (px), y (px), w, h, color }
let roadLanes = [];
let skyLanes = [];
```

### Home Slots
```js
let homeSlots = [false, false, false, false, false];
let frogsHome = 0;
```

### Game State
```js
let score = 0, hiScore = 0, lives = STARTING_LIVES, level = 1;
let timeRemaining = 30; // seconds
let gameOver = false;
let gameState = 'playing'; // 'playing' | 'dying' | 'gameOver' | 'transition' | 'levelClear'
let extraLifeAwarded = false;
let perfectCrossingPossible = true; // reset per level
```

### Rain System
```js
let raindrops = []; // { x, y, speed, opacity }
// Initialize with LEVEL_CONFIG[level-1].rainCount drops
// Each: random x [0, W], random y [0, H], speed 8px/frame, opacity 0.15
// Level 5+: 1×8px drops instead of 1×6px
```

### Particles
```js
let particles = []; // { x, y, vx, vy, life, maxLife, color, size, gravity }
```

### Neon Signs (decorative)
```js
// Static colored rectangles at screen edges, 10% opacity level 1
// Level 3+: cycle hue through #ff1744→#ffd600→#00e5ff→#e040fb over 8s
// Level 4+: flicker (100ms blink-off every 3-5s random)
// Level 5+: 30% opacity, 4s cycle
```

## Sound Design (zzfx)
All sounds via `zzfx(...[...])` spread-array pattern:

```js
const SFX = {
  hop_blip:      () => zzfx(...[...]),  // sine 500Hz, 50ms, clean pop
  crash_static:  () => zzfx(...[...]),  // noise burst + descending square 600→100Hz, 250ms
  splash_drop:   () => zzfx(...[...]),  // noise low-pass 800Hz, 200ms, muffled splash
  dock_chime:    () => zzfx(...[...]),  // two-note 660→880Hz, 100ms each, triangle
  level_clear:   () => zzfx(...[...]),  // ascending arpeggio C5-E5-G5-C6, 120ms each, sine
  tick_urgent:   () => zzfx(...[...]),  // square 1kHz, 60ms
  perfect_chord: () => zzfx(...[...]),  // C3+E3+G3 chord, 600ms (3 simultaneous zzfx calls)
};
```

City hum ambient: low synth pad via oscillator at C2+G2, 8% volume + white noise high-pass 6kHz at 3%. Implemented as AudioContext oscillators started on game init, stopped on cleanup.

## Game Loop (delta-time based, 60fps target)

```
function update(dt):
  if gameState == 'gameOver': draw overlay, listen R for restart, return
  if gameState == 'dying': run death animation, decrement timer, return
  if gameState == 'transition' or 'levelClear': run transition, return

  1. Input (keydown only, no repeat):
     ArrowUp: gridY -= 1 (if > ROW_HOME), hop_blip, landing splash particles
     ArrowDown: gridY += 1 (if < ROW_START), hop_blip
     ArrowLeft: gridX -= 1 (if > 0), hop_blip
     ArrowRight: gridX += 1 (if < COLS-1), hop_blip
     Space (level 4+): emergency boost — gridY -= 2, trail afterimages, 8s cooldown

  2. Forward-hop scoring:
     if gridY < drone.highestRow: score += SCORE_HOP_FORWARD, highestRow = gridY

  3. Move lane objects:
     For each road/sky lane:
       obj.x += dir * speed * levelSpeedMult * dt
       Wrap: off-screen right → reappear left (and vice versa)

  4. Cargo drone dive cycle:
     For diving lanes: increment diveTimer
     if diveTimer >= diveInterval: submerged = true
     if diveTimer >= diveInterval + diveDuration: submerged = false, reset

  5. Riding mechanic (sky zone, rows 1-5):
     if drone in sky zone:
       find platform under drone (overlap check)
       if platform found AND not submerged:
         drone.pixelX moves with platform (dir * speed * mult * dt)
         gridX = Math.round(pixelX / CELL_W)
         if gridX < 0 or >= COLS: killDrone() // carried off screen
       else:
         killDrone() // fell off / submerged

  6. Road collision (rows 7-11):
     if drone in road zone:
       check overlap with any vehicle in lane
       if overlap: killDrone() with neon crash particles

  7. Fly-by bonus (level 3+):
     if drone in road zone and vehicle passes within 4px without collision:
       score += SCORE_FLYBY, show "CLOSE!" text

  8. Home slot check (row 0):
     slotIndex = getHomeSlot(gridX)
     if valid and not filled:
       homeSlots[slotIndex] = true
       frogsHome++
       score += SCORE_HOME_BASE * level
       score += Math.floor(timeRemaining) * 10
       dock_chime, slot activation particles
       if frogsHome == 5:
         if perfectCrossingPossible: score += SCORE_PERFECT, perfectCrossingSequence()
         score += SCORE_ALL_HOME
         advanceLevel()
       else:
         resetDrone()
     else:
       killDrone() // gap or filled slot

  9. Timer:
     timeRemaining -= dt
     if timeRemaining <= 0: killDrone()
     if timeRemaining <= timer * 0.25: tick_urgent every 500ms, bar flashes

  10. Extra life:
      if score >= EXTRA_LIFE_SCORE and not awarded: lives++, awarded = true

  11. Storm surge (level 5+):
      every 10s: all vehicles accelerate 50% for 2s
      warning: road lanes flash #ff1744 at 3% for 500ms before surge

  12. Update rain, particles, neon signs, boost cooldown

  13. Render
```

## Rendering Order
```
1. Fill background: road zone BG_ROAD, sky zone BG_SKY
2. Lane dividers (dashed lines, 1px, LANE_DIVIDER color)
3. Safe zones (start row, median, home area) in SAFE_ZONE color
4. Neon sign decorations at screen edges
5. Road lane objects (vehicles: rounded rects with neon trim + headlight dots)
6. Sky lane objects (sky-trains with window dots, ad-boards with cycling border, cargo drones as triangle formation)
7. Home slots (dark alcoves, filled ones glow DRONE_COLOR)
8. Drone (16×16 diamond with 4 rotor circles, center dot, 3px glow)
9. Rain system (1×6px vertical lines, RAIN_COLOR at 15% opacity)
10. Particles
11. HUD:
    - Top-left: "SCORE: NNNNN" in SCORE_COLOR 14px monospace
    - Top-center: "HI: NNNNN"
    - Bottom-left: mini drone icons × lives
    - Bottom-right: "LEVEL N"
    - Bottom: timer bar (DRONE_COLOR → CAR_COLOR gradient, depletes left→right)
    - Boost cooldown dot below drone (level 4+)
12. Level 2+ wet road reflections (vehicles mirrored below, 5-8% opacity)
13. Level 3+ lightning flash (entire bg to #1a1a30, 80ms, every 15-20s)
14. Text popups (forward bonus, fly-by, perfect crossing)
15. Game over overlay: rain intensifies, neons dim to 20%, "GAME OVER" + score + hi-score + "R to restart"
```

## Sprite Rendering (all procedural)

### Drone
```js
// 16×16px diamond shape
// 4 circles (3px) at corners = rotors
// Center dot (2px)
// 3px glow effect (draw enlarged at 20% opacity behind)
```

### Vehicles
```js
// Rounded rectangles with 1px bright neon trim on top edge
// 2px headlight dots on leading edge (in vehicle color at 80% opacity)
// Cars: 30×16, Trucks: 50×16, Bikes: 20×12, Hover-buses: 70×16
```

### Sky Platforms
```js
// Sky-trains: 80×16 elongated rects, 3px window squares spaced 6px apart in SKYTRAIN_COLOR
// Ad-boards: 40×14 rects, 1px border cycling #ffd600→#ff1744→#e040fb over 3s
// Cargo drones: 3 circles (8px) in triangle, connected by 1px lines
//   Diving: blink 3× (200ms on/off) before submerging, invisible when submerged
```

## Transitions
```
Game start (600ms):
  Rain fades in (opacity 0→0.15), lanes populate left→right (vehicles slide in 100ms stagger),
  drone materializes at start with 4-particle burst

Home reached (400ms):
  Drone shrinks into slot → slot glows (0→1 opacity pulse) → 6 lime particles →
  drone respawns at start row

Death (500ms):
  Vehicle hit: 10 particles in vehicle color + white, spark spray, drone blinks 3× then disappears
  Fall off platform: 8 particles #4fc3f7, upward arc with gravity, drone shrinks to 0
  Screen dims 200ms → drone respawns

Level clear (600-1200ms):
  If perfect crossing: rain pauses, neons flash left→right (100ms/col), synth chord, "+PERFECT" scale-in,
    2000pts, rain resumes double intensity 2s
  Else: city pulse (all neons flash 20% brighter 200ms), rain intensifies 1s

Game over (800ms):
  Rain intensifies → drone fades → all neons dim to 20% → overlay appears
```

## Level-Specific Mechanics
| Level | New Feature |
|-------|------------|
| 1 | Base game. Learn lanes, generous timer, wide gaps |
| 2 | Forward bonus display ("FORWARD ×N", 12px, 300ms fade). Wet road reflections at 5% |
| 3 | Fly-by bonus (25pts, "CLOSE!" popup). Hover-bus appears. Neon signs cycle colors. Lightning flashes |
| 4 | Emergency boost (Space = 2-tile dash, 8s cooldown, afterimage trail). Speed-bike lane (3.5px base). Neon flicker |
| 5+ | Storm surge (10s cycle). 2 speed-bike lanes. 3 hover-buses. Cargo drones mostly submerged. Cyan vignette |

## Cleanup
```js
function cleanup() {
  cancelAnimationFrame(animId);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
  // Stop ambient oscillators
  // Clear any timers/intervals
}
return { controls: 'Arrow keys: Move | Space: Boost (L4+) | R: Restart', cleanup };
```

## Edge Cases
- Hop is keydown-only, no held-key repeat (debounce: ignore if same key within 100ms)
- Lane objects wrap seamlessly — new objects reappear from opposite edge
- Cargo drone dive timing shared per lane (all drones in a lane submerge together)
- If drone is on diving cargo drones when they submerge → death
- Forward-hop scoring: only award when gridY decreases below highest reached this life
- Prevent moving below ROW_START or above ROW_HOME
- Emergency boost cannot move past ROW_HOME (clamp)
- Emergency boost is disabled during dying/transition states
- Storm surge warning must fire before acceleration starts
- Fly-by detection: check distance to nearest vehicle edge after each hop in road zone
- Perfect Crossing resets per level (deathsThisLevel counter)
- Timer bar flash only in last 25% of CURRENT level's timer
- High score persists via localStorage key `froggerNeonCrossing_hiScore`
- Rain system resets/scales when level changes
- Ambient city hum must stop on cleanup (AudioContext oscillators)
- Touch controls must dispatch keyup on touchend/mouseup (per P0 mobile fix pattern)

## Workflow
Following `confluence/workflows/creative-pipeline.md` — Creative Pipeline (Game Migration).
