# Bug Report: Snake Neon Serpent — Dies Instantly on Load (Score 0)

## Severity: P1 (Blocker)
## Game/Component: Snake (Neon Serpent rewrite)
## Date: 2026-06-01
## Reporter: QA Department

## Summary
Snake dies within ~1.7 seconds of game start without any player input. The snake starts at center (15,10) moving right at 120ms/tick. With 14 cells to the right wall, it hits the wall in ~1.68 seconds. The game loop starts immediately on `resetGame()` — by the time the canvas renders and the player sees the game, the snake has already consumed most of its runway and dies before input can be processed.

## Steps to Reproduce
1. Open http://localhost:3000
2. Click the Snake game card
3. Observe: GAME OVER with Score 0 appears within ~2 seconds
4. No player input was possible before death

## Expected
Snake spawns and waits for first keypress before starting movement, OR has enough runway to give the player time to react.

## Actual
Snake auto-moves right on spawn. Hits right wall in ~1.68 seconds. GAME OVER, Score 0. Player never has a chance to play.

## Root Cause
`snake-neon-serpent.js` line 730 calls `resetGame()` which sets `running = true` and starts the game loop immediately. The snake spawns at `(COLS/2, ROWS/2)` = `(15, 10)` moving right (`direction = {x:1, y:0}`). With `COLS=30`, there are only 14 cells before the right wall. At `INITIAL_SPEED = 120ms`, that's 1.68 seconds. Combined with browser rendering delay, the player has no time to react.

## Fix Options
1. **Wait for first keypress** — set `running = false` initially, start movement only when player presses an arrow key. Display "Press arrow key to start" text.
2. **Longer runway** — spawn snake at (5, 10) moving right, giving 24 cells (~2.88s) of runway.
3. **Both** — wait for keypress AND position for maximum runway.

Option 1 is the correct fix. Every classic Snake implementation waits for first input.

## Verification
After fix: game should display the snake stationary at spawn, begin movement only on first arrow key press, and allow the player to score at least 1 point.

## Environment
- localhost:3000, viewport 1280x720
- Frontend: nginx container on port 3000
- Browser: Chromium (headless)
