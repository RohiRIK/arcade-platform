# Test Plan: Pong

## Game ID: pong
## Version: 1.0.0
## Date: 2026-05-29

## Acceptance Criteria

### TC-1: Game Loads
- Navigate to game list, click Pong card
- Canvas renders with two paddles, ball, dashed center line
- Score shows 0:0

### TC-2: Controls
- W/S or Arrow Up/Down move player paddle
- CPU paddle tracks ball automatically

### TC-3: Gameplay
- Ball bounces off paddles and top/bottom walls
- Score increments when ball passes a paddle
- Ball resets to center after scoring

### TC-4: Win Condition
- Game ends at score threshold
- Winner message displayed

## Results (2026-05-29)
- TC-1: PASS — Canvas loads with paddles, ball, center line, score 0:0
- TC-2: Not tested (no keyboard interaction)
- TC-3: Not tested
- TC-4: Not tested
