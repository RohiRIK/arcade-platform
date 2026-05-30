# Bug Report: CSP Blocks API Fetch — Game List Shows Only 3 of 5 Games

## Severity: P1 (Blocker)
## Game/Component: Frontend (all games affected)
## Date: 2026-05-29
## Reporter: QA Department

## Summary
The Content-Security-Policy header on nginx blocks cross-origin fetch requests from port 3000 to port 3001. The frontend JS catches the error silently and falls back to a hardcoded 3-game array (Snake, Pong, Breakout). Tetris and Space Invaders are invisible to users.

## Steps to Reproduce
1. Open http://localhost:3000 in a browser
2. Observe the game list — only 3 cards appear (Snake, Pong, Breakout)
3. Open browser DevTools → Network tab
4. The fetch to `http://localhost:3001/api/games` fails due to CSP `default-src 'self'` blocking cross-origin requests
5. The catch block in `init()` (index.html line 147-155) renders a hardcoded fallback with only 3 games

## Expected
All 5 games (Snake, Pong, Breakout, Tetris, Space Invaders) appear in the game list, fetched from the API.

## Actual
Only 3 games appear. Tetris and Space Invaders are hidden. No error message shown to user — the failure is silent.

## Root Cause
Two interacting issues:
1. **nginx CSP header** (`frontend/nginx.conf` line 7): `default-src 'self'` blocks `connect-src` to a different port (3001 is a different origin than 3000)
2. **No nginx API proxy**: There is no `location /api` proxy_pass rule in nginx.conf, so the frontend must make cross-origin requests

## Fix Options (for R&D/Infra)
**Option A (preferred)**: Add an nginx reverse proxy rule: `location /api { proxy_pass http://backend:3001/api; }` — then change frontend JS to use relative URL `/api/games` instead of `http://hostname:3001/api/games`. This also fixes LAN accessibility.
**Option B**: Add `connect-src 'self' http://localhost:3001` to CSP header. Does NOT fix LAN access.

## Secondary Issue
The fallback array in index.html lines 150-154 is hardcoded to only 3 games. If the fetch fails for any reason, users see an incomplete list with no indication of failure.

## Screenshot
departments/qa/screenshots/current/game-list.png

## Environment
- localhost, viewport 1280x720
- Frontend: nginx container on port 3000
- Backend: Node container on port 3001
