# Bug Report: Breakout Prism Shatter — JS Syntax Error Prevents Game Load

## Severity: P1 (Blocker)
## Game/Component: Breakout Prism Shatter
## Date: 2026-06-02
## Reporter: QA Department

## Summary
`breakout-prism-shatter.js` uses elided arguments in `zzfx()` function calls (e.g., `zzfx(.3,,pitch||1800,...)`). Elided elements are only valid in array literals, not function call arguments. The entire file fails to parse. `startBreakoutPrismShatter` is never defined. Clicking the Breakout card shows a permanent "LOADING..." screen.

## Steps to Reproduce
1. Open http://localhost:3000
2. Click the "Breakout" game card
3. Observe: loading screen with brick icon and progress bar stays indefinitely
4. Open DevTools console: `typeof startBreakoutPrismShatter` returns `"undefined"`

## Expected
Breakout Prism Shatter loads and renders a playable game with bricks, paddle, ball, and score.

## Actual
Permanent loading screen. The function `startBreakoutPrismShatter` is never defined because the browser cannot parse the file. The browser throws a SyntaxError on the elided comma syntax.

## Root Cause
Lines 89-95 of `breakout-prism-shatter.js` use elided commas in function calls:
```js
zzfx(.3,,pitch||1800,.01,.02,.05,1,2,,,,,,,,,,.3,.01);
```
This is invalid JS. `f(a,,b)` is a SyntaxError — elided elements are only valid in array literals (`[a,,b]`).

## Fix
Replace elided commas with explicit `undefined` values, or use the spread-array pattern already working in `pong-volt-rally.js`:
```js
zzfx(...[.3,undefined,pitch||1800,.01,.02,.05,1,2,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,.3,.01]);
```
All 7 zzfx calls on lines 89-95 need this fix.

## Verification
After fix: `typeof startBreakoutPrismShatter` should return `"function"`, and clicking Breakout should render the game canvas with bricks, paddle, and ball.

## Affected Lines
- Line 89: `glass_clink`
- Line 90: `mirror_ping`
- Line 91: `drop_womp`
- Line 92: `chime_cascade`
- Line 93: `heat_sizzle`
- Line 94: `victory_cascade`
- Line 95: `gem_pickup`

## Screenshot
Game stuck on loading screen with brick icon and progress bar.

## Environment
- localhost:3000, viewport 1280x720
- Frontend: nginx container on port 3000
- Browser: Chromium (headless)
