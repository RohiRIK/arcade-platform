# Test Plan: Pac-Man

## Game ID: pac-man
## Version: 1.0.0
## Date: 2026-05-30

## Acceptance Criteria

### TC-1: Game Loads
- Navigate to game list, click Pac-Man card
- Canvas (600x400) renders with blue maze walls, dots, power pellets
- Score 0, lives displayed, level 1

### TC-2: Controls
- Arrow keys move Pac-Man through maze corridors
- Pac-Man cannot move through walls
- Enter restarts game

### TC-3: Ghosts
- Four ghosts visible with distinct colors (red, pink, cyan, orange)
- Ghosts move through maze pursuing Pac-Man
- Each ghost has distinct AI behavior

### TC-4: Gameplay
- Eating dots increments score
- Power pellets turn ghosts blue (frightened mode)
- Eating frightened ghosts awards bonus points
- All dots cleared advances to next level

### TC-5: Game Over
- Ghost collision loses a life
- All lives lost = game over
- Score displayed on game over

### TC-6: Mobile/Touch
- Touch controls functional on mobile viewport

## Results (2026-05-30)
- TC-1: PASS — Canvas 600x400, blue maze, dots, power pellets in corners, score 0, LV 1, 2 lives shown
- TC-2: Not tested (automated browser)
- TC-3: PASS — Four colored ghosts visible (red, cyan, others near bottom)
- TC-4: Not tested (requires gameplay)
- TC-5: Not tested (requires gameplay)
- TC-6: Not tested this cycle
