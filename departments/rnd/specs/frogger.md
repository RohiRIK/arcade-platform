# Spec: Frogger

## Overview
Implement Frogger as `startFrogger()` in `frontend/public/index.html`. Canvas 600×400, black background, primary color `#4ade80` (green — classic frog color). Grid-based navigation game: cross traffic, ride river objects, fill 5 home slots.

## Constants
```javascript
const CANVAS_W = 600, CANVAS_H = 400;
const COLS = 14, ROWS = 13;
const CELL_W = CANVAS_W / COLS;   // ~42.86px
const CELL_H = CANVAS_H / ROWS;   // ~30.77px

const STARTING_LIVES = 3;
const LEVEL_TIME = 60;             // seconds per frog
const EXTRA_LIFE_SCORE = 10000;
const HOME_SLOTS = 5;

// Scoring
const SCORE_HOP_FORWARD = 10;
const SCORE_HOME = 50;
const SCORE_TIME_BONUS = 10;       // per half-second remaining
const SCORE_ALL_HOME = 1000;

// Row layout (0 = top)
const ROW_HOME = 0;
const ROW_RIVER_START = 1;
const ROW_RIVER_END = 5;
const ROW_MEDIAN = 6;
const ROW_ROAD_START = 7;
const ROW_ROAD_END = 11;
const ROW_START = 12;

// Lane speed multiplier per level
const BASE_SPEED_MULT = 1.0;
const SPEED_INCREASE_PER_LEVEL = 0.15;

// Turtle dive timing
const TURTLE_DIVE_INTERVAL = 180;  // frames between dive start
const TURTLE_DIVE_DURATION = 60;   // frames submerged
```

## Lane Configuration
```javascript
// Each lane: { row, type, direction, speed, objects[] }
// direction: 1 = right, -1 = left
// speed: cells per second (base, multiplied by level)

const LANE_CONFIG = [
  // River lanes (rows 1-5)
  { row: 1, type: 'log',    dir:  1, speed: 1.0, pattern: [3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0] },
  { row: 2, type: 'turtle', dir: -1, speed: 1.2, pattern: [2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], diving: true },
  { row: 3, type: 'log',    dir:  1, speed: 1.5, pattern: [4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { row: 4, type: 'log',    dir: -1, speed: 0.8, pattern: [2, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0] },
  { row: 5, type: 'turtle', dir:  1, speed: 1.3, pattern: [3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0], diving: false },

  // Road lanes (rows 7-11)
  { row: 7,  type: 'car',   dir: -1, speed: 1.5, pattern: [{w:1}, null, null, {w:1}, null, null, {w:1}, null, null, null, null, null, null, null] },
  { row: 8,  type: 'truck', dir:  1, speed: 1.0, pattern: [{w:2}, null, null, null, null, {w:2}, null, null, null, null, null, null, null, null] },
  { row: 9,  type: 'car',   dir: -1, speed: 2.0, pattern: [{w:1}, null, null, {w:1}, null, null, {w:1}, null, {w:1}, null, null, null, null, null] },
  { row: 10, type: 'bus',   dir:  1, speed: 1.8, pattern: [{w:2}, null, null, null, null, null, {w:2}, null, null, null, null, null, null, null] },
  { row: 11, type: 'car',   dir: -1, speed: 1.2, pattern: [{w:1}, null, null, null, {w:1}, null, null, null, {w:1}, null, null, null, null, null] },
];
```

## Data Structures

### Frog State
```javascript
let frog = {
  gridX: 7,            // center column
  gridY: ROW_START,    // bottom row
  alive: true,
  ridingObject: null,  // reference to lane object frog is on
  highestRow: ROW_START, // for forward-hop scoring (reset per life)
};
```

### Lane Objects
```javascript
// Generated from LANE_CONFIG at level start
// Each lane has a continuous array of objects that wrap around
let lanes = []; // lanes[i] = { config, objects[] }
// Each object: { x (float, in cells), width (cells), diving (bool), diveTimer (int) }
```

### Home Slots
```javascript
let homeSlots = [false, false, false, false, false];
// Positions: evenly spaced across row 0
// Slot centers at columns: 1, 4, 7, 10, 13 (approx, tuned for visual balance)
const HOME_SLOT_COLS = [1, 4, 7, 10, 13];
const HOME_SLOT_WIDTH = 1.5; // cells wide (landing zone)
```

### Game State
```javascript
let score = 0, lives = STARTING_LIVES, level = 1;
let timeRemaining = LEVEL_TIME;
let frogsHome = 0;
let gameOver = false;
let extraLifeAwarded = false; // track 10K threshold
```

## Game Loop

### Input Handling
```javascript
// On keydown (not keyup — discrete movement)
// ArrowUp: frog.gridY -= 1 (if not at row 0)
// ArrowDown: frog.gridY += 1 (if not at row 12)
// ArrowLeft: frog.gridX -= 1 (if not at col 0)
// ArrowRight: frog.gridX += 1 (if not at col COLS-1)
// Movement is instant — one cell per press, no held-key repeat
// After move: check forward-hop scoring
```

### Update (60fps)
```javascript
function update(dt) {
  if (gameOver) return;

  // 1. Move lane objects
  const speedMult = BASE_SPEED_MULT + (level - 1) * SPEED_INCREASE_PER_LEVEL;
  for (each lane) {
    for (each object in lane) {
      object.x += lane.config.dir * lane.config.speed * speedMult * dt;
      // Wrap: if object goes off right edge, wrap to left (and vice versa)
      if (object.x > COLS + object.width) object.x = -object.width;
      if (object.x + object.width < 0) object.x = COLS;
    }
    // Update dive timers for turtle lanes
    if (lane.config.diving) {
      lane.diveTimer++;
      if (lane.diveTimer >= TURTLE_DIVE_INTERVAL) lane.submerged = true;
      if (lane.diveTimer >= TURTLE_DIVE_INTERVAL + TURTLE_DIVE_DURATION) {
        lane.submerged = false;
        lane.diveTimer = 0;
      }
    }
  }

  // 2. Riding mechanic (river zone)
  if (frog.gridY >= ROW_RIVER_START && frog.gridY <= ROW_RIVER_END) {
    const lane = getLaneForRow(frog.gridY);
    const rideable = findObjectAtX(lane, frog.gridX);
    if (rideable && !(lane.config.diving && lane.submerged)) {
      // Frog rides: move frog with object
      frog.floatX += lane.config.dir * lane.config.speed * speedMult * dt;
      frog.gridX = Math.round(frog.floatX);
      // Check off-screen
      if (frog.gridX < 0 || frog.gridX >= COLS) killFrog();
    } else {
      // In water with nothing to ride = death
      killFrog();
    }
  }

  // 3. Road collision
  if (frog.gridY >= ROW_ROAD_START && frog.gridY <= ROW_ROAD_END) {
    const lane = getLaneForRow(frog.gridY);
    if (findObjectAtX(lane, frog.gridX)) killFrog();
  }

  // 4. Home slot check
  if (frog.gridY === ROW_HOME) {
    const slotIndex = getHomeSlot(frog.gridX);
    if (slotIndex !== -1 && !homeSlots[slotIndex]) {
      homeSlots[slotIndex] = true;
      frogsHome++;
      score += SCORE_HOME;
      score += Math.floor(timeRemaining * 2) * SCORE_TIME_BONUS;
      if (frogsHome === HOME_SLOTS) {
        score += SCORE_ALL_HOME;
        advanceLevel();
      } else {
        resetFrog();
      }
    } else {
      killFrog(); // landed in gap or already-filled slot
    }
  }

  // 5. Timer
  timeRemaining -= dt;
  if (timeRemaining <= 0) killFrog();

  // 6. Extra life check
  if (!extraLifeAwarded && score >= EXTRA_LIFE_SCORE) {
    lives++;
    extraLifeAwarded = true;
  }
}
```

### Kill Frog
```javascript
function killFrog() {
  lives--;
  if (lives <= 0) {
    gameOver = true;
  } else {
    resetFrog();
  }
}

function resetFrog() {
  frog.gridX = 7;
  frog.gridY = ROW_START;
  frog.floatX = 7;
  frog.highestRow = ROW_START;
  timeRemaining = LEVEL_TIME;
}
```

### Advance Level
```javascript
function advanceLevel() {
  level++;
  homeSlots = [false, false, false, false, false];
  frogsHome = 0;
  resetFrog();
  // Lane speeds already affected by level multiplier
}
```

## Collision Detection

### Object Overlap (grid-based)
```javascript
function findObjectAtX(lane, gridX) {
  // Returns first object that overlaps gridX
  for (const obj of lane.objects) {
    if (gridX >= Math.floor(obj.x) && gridX < Math.ceil(obj.x + obj.width)) {
      return obj;
    }
  }
  return null;
}
```

### Home Slot Detection
```javascript
function getHomeSlot(gridX) {
  for (let i = 0; i < HOME_SLOTS; i++) {
    if (Math.abs(gridX - HOME_SLOT_COLS[i]) <= HOME_SLOT_WIDTH / 2) return i;
  }
  return -1; // gap between slots
}
```

## Rendering

### Background Zones
```javascript
// Row colors:
// ROW_HOME (0): dark green with lily pad slots
// RIVER (1-5): #1a3a5c (dark blue)
// MEDIAN (6): #6b21a8 (purple, classic Frogger)
// ROAD (7-11): #1f1f1f (dark grey)
// START (12): dark green
```

### Frog
```javascript
// Green (#4ade80) circle/rectangle in cell with two white eye dots
// Size: 80% of cell, centered
```

### Vehicles (Road)
```javascript
// Cars: single-cell, colored rectangles (red, yellow, white variety)
// Trucks: 2-cell, darker rectangle with cab detail
// Buses: 2-cell, tall rectangle, distinct color
// All have small wheel indicators (dark circles at bottom)
```

### River Objects
```javascript
// Logs: brown (#8B4513) rectangles with horizontal line "bark" texture
// Turtles: green ovals, dim when about to dive, invisible when submerged
// Water: blue background shows through gaps
```

### Home Slots
```javascript
// Draw as darker green alcoves in row 0
// Filled slots show a small frog icon
// Empty slots show a subtle lily pad outline
```

### HUD
```javascript
// Bottom of screen or overlay on start row:
// Left: "SCORE: 0000" in white
// Center: frog icons × lives remaining
// Right: time bar (green → yellow → red as time depletes)
// Top-left: "LEVEL: 1"
```

## Restart / Game Over
```javascript
// On game over: display "GAME OVER" centered, score below
// "Press ENTER to restart" — full state reset
// On restart: score=0, lives=3, level=1, all homes empty
```

## Edge Cases
- Frog must not move during death/reset frame
- Held keys must NOT cause continuous movement (only process keydown, not repeat)
- Lane objects must wrap seamlessly (new objects appear from off-screen edge)
- Turtle dive timing shared per lane (all turtles in a lane dive together)
- If frog is on diving turtles when they submerge → death
- Forward-hop scoring: only award 10pts when gridY decreases below highest reached this life
- Prevent moving down below ROW_START or up above ROW_HOME

## Acceptance Criteria
- [ ] Game loads in browser without JS errors
- [ ] Canvas renders at 600×400
- [ ] Arrow key controls respond with discrete grid hops
- [ ] Road vehicles move and wrap correctly
- [ ] River objects (logs, turtles) move and wrap correctly
- [ ] Frog rides river objects (moves with them)
- [ ] Diving turtles submerge periodically; frog dies if on them when submerged
- [ ] Collision with vehicles causes death
- [ ] Falling in water (no object under frog) causes death
- [ ] Frog carried off-screen causes death
- [ ] Landing in home slot scores points and resets frog
- [ ] All 5 homes filled → level advance with speed increase
- [ ] Timer counts down; expiry kills frog
- [ ] Score displays and increments correctly (forward hops, home, time bonus, all-home bonus)
- [ ] Game over state triggers at 0 lives and displays correctly
- [ ] Restart works without page reload
- [ ] No hardcoded localhost in any URL
- [ ] Works from LAN IP (not just localhost)
