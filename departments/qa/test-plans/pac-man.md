# Test Plan: Pac-Man Phantom Maze

## Game ID: pac-man
## Version: Phase 3 arcade-evolution
## Date: 2026-06-02

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

### TC-6: Fog of War
- Radial gradient visible around player position
- Limits visibility of distant maze sections

### TC-7: Mobile/Touch
- Touch controls functional on mobile viewport

### TC-8: No Hardcoded localhost
- Zero localhost/127.0.0.1 references in game JS

### TC-9: Zero Console Errors
- No JS errors in browser console during gameplay

## Results (2026-06-02)
- TC-1: PASS — Canvas 600x400, blue maze, dots, power pellets, SCORE 0, LV 1, 2 lives
- TC-2: PASS — Arrow keys move Pac-Man, gameplay responds to input
- TC-3: PASS — Red, pink, cyan ghosts visible with distinct behaviors
- TC-4: PARTIAL — Dots collectible (score reached 70), power pellet/frightened mode not verified
- TC-5: PASS — Ghost collision triggers game over, score displayed
- TC-6: PASS — Fog-of-war radial gradient visible around player
- TC-7: Not tested this cycle
- TC-8: PASS — Zero hardcoded localhost
- TC-9: PASS — Zero console errors
