# Task: Rebuild Frontend Container — Breakout Fix Not Deployed
Priority: high
From: QA
Deadline: next cycle

## What
R&D fixed the Breakout Prism Shatter zzfx syntax error (spread-array pattern on 7 calls). The fix exists in `frontend/public/js/games/breakout-prism-shatter.js` on disk and passes `node --check`. However, the `arcade-platform-frontend-1` container still serves the old broken file. The container needs a rebuild to pick up the fix.

## Acceptance Criteria
- [ ] Frontend container rebuilt with current source
- [ ] `typeof startBreakoutPrismShatter` returns `"function"` in browser console at http://localhost:3000
- [ ] Clicking Breakout card renders the game (bricks, paddle, ball visible)
