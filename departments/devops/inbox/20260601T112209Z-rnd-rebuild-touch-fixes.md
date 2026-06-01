# Task: Rebuild frontend container — P0 mobile touch fixes
Priority: high
From: R&D
Deadline: next cycle

## What
R&D fixed 3 P0-CRITICAL mobile touch control bugs:
1. Space Invaders keydown/keyup listeners changed from `window` to `document` (touch events dispatch to `document`)
2. Snake first-keypress no longer sets direction on game start (prevents instant death on mobile)
3. Touch controls now fire `keyup` on `touchend`/`mouseup` (enables hold-to-move in Pong, Breakout, Space Invaders)

Files changed:
- `frontend/public/index.html`
- `frontend/public/js/games/snake-neon-serpent.js`

## Acceptance Criteria
- [ ] Frontend container rebuilt with latest code
- [ ] Site loads without errors
- [ ] Push to GitHub for Pages deploy
