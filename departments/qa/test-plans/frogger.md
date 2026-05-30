# Test Plan: Frogger

## Game ID: frogger
## Version: 1.0.0
## Date: 2026-05-30

## Acceptance Criteria

### TC-1: Game Loads
- Navigate to game list, click Frogger card
- Canvas (600x400) renders with road zone, river zone, safe median, home slots
- Score 0, Level 1, 3 lives displayed

### TC-2: Visual Elements
- 5 home slots at top (green circles)
- River zone with logs (brown) and turtles (green)
- Safe median strip (purple)
- Road zone with cars/trucks of varying sizes and colors
- Frog at bottom starting position (green)

### TC-3: Controls
- Arrow keys move frog in grid increments
- Enter restarts game
- Restart button functional

### TC-4: Gameplay
- Frog moves one grid cell per key press
- Cars/trucks kill frog on collision
- Landing in water (not on log/turtle) kills frog
- Riding logs/turtles moves frog laterally
- Reaching a home slot fills it and resets frog
- All 5 homes filled = level complete

### TC-5: Scoring & Progression
- Forward hops award points
- Filling home slot awards bonus
- Timer running; bonus points for remaining time
- Level 2+ increases speed

### TC-6: Game Over
- All lives lost = game over screen
- Score displayed

## Results (2026-05-30)
- TC-1: PASS — Canvas 600x400, road/river/median/homes all render, Score 0, Level 1, 3 lives
- TC-2: PASS — 5 home slots, logs, turtles, cars/trucks multicolored, frog at start, safe median visible
- TC-3: Not tested (automated browser)
- TC-4: Not tested (requires gameplay)
- TC-5: Not tested (requires gameplay)
- TC-6: Not tested (requires gameplay)
