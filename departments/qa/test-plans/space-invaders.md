# Test Plan: Space Invaders

## Game ID: space-invaders
## Version: 1.0.0
## Date: 2026-05-29

## Acceptance Criteria

### TC-1: Game Loads
- Launch Space Invaders game
- Canvas renders with invader rows, shields, player ship
- Wave 1, score 0 displayed

### TC-2: Controls
- Arrow Left/Right moves player ship
- Space fires bullet
- Touch controls for mobile (left/right + fire)

### TC-3: Gameplay
- Bullets destroy invaders on hit
- Invaders move side-to-side and descend
- Shields degrade when hit by bullets (player or invader)
- Score increments per invader destroyed
- Wave advances after clearing all invaders

### TC-4: Game Over
- Invaders reaching player row or player losing all lives = game over
- Score displayed

## Results (2026-05-29)
- TC-1: PASS — Canvas loads, invader rows visible, shields present, player ship at bottom, Wave 1
- TC-2: Not tested
- TC-3: Not tested
- TC-4: Not tested

## Note
CSP bug and JS syntax bug both fixed. Space Invaders now visible in game list and launches correctly.
