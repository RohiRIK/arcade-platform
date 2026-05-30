# Test Plan: Tetris

## Game ID: tetris
## Version: 1.0.0
## Date: 2026-05-29

## Acceptance Criteria

### TC-1: Game Loads
- Launch Tetris game
- Canvas renders with game board, next piece preview, score/level/lines display
- Pieces begin falling immediately

### TC-2: Controls
- Arrow Left/Right moves piece horizontally
- Arrow Down soft drops
- Arrow Up or Z rotates
- Space hard drops

### TC-3: Gameplay
- Completed rows clear and award points
- Level increases with lines cleared
- Speed increases per level
- Next piece preview updates correctly

### TC-4: Game Over
- Pieces stacking to top triggers game over
- Score displayed on game over screen

## Results (2026-05-29)
- TC-1: PASS — Canvas loads, NEXT preview visible, score/level/lines at 0, piece falling
- TC-2: Not tested
- TC-3: Not tested
- TC-4: Not tested

## Note
CSP bug and JS syntax bug both fixed. Tetris now visible in game list and launches correctly.
