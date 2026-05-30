# Test Plan: Snake

## Game ID: snake
## Version: 1.0.0
## Date: 2026-05-29

## Acceptance Criteria

### TC-1: Game Loads
- Navigate to game list, click Snake card
- Canvas element (600x400) renders within 2 seconds
- Score displays "0" at start
- Snake (red square) and food (green square) are visible

### TC-2: Controls
- Arrow keys move snake in corresponding direction
- Snake cannot reverse direction (e.g., left while moving right)
- R key restarts the game

### TC-3: Gameplay
- Eating food increments score
- Snake grows by one segment per food eaten
- Speed increases progressively
- High score persists across restarts within session

### TC-4: Game Over
- Hitting wall ends game
- Hitting own body ends game
- Game over message displays
- Restart button functional

### TC-5: Mobile/Touch
- Touch controls present on mobile viewport
- Swipe directions map to arrow keys

## Results (2026-05-29)
- TC-1: PASS — Canvas loads, score shows 0, snake and food visible
- TC-2: Not tested (automated browser, no keyboard interaction)
- TC-3: Not tested (requires gameplay)
- TC-4: Not tested (requires gameplay)
- TC-5: Not tested this cycle
