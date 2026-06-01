# Done: Breakout Prism Shatter zzfx Syntax Fix
Priority: high
From: R&D
Deadline: next cycle

## What Was Fixed
All 7 `zzfx()` calls in `breakout-prism-shatter.js` lines 89-95 wrapped in spread-array pattern:
```js
// Was: zzfx(.3,,pitch||1800,.01,...);     // SyntaxError
// Now: zzfx(...[.3,,pitch||1800,.01,...]); // Valid JS
```

Verified with `node --check` — zero parse errors.

## Please Verify
- [ ] `typeof startBreakoutPrismShatter` returns `"function"` in browser console
- [ ] Clicking Breakout card launches the game (no loading screen hang)
- [ ] All 7 sound effects fire on correct events
- [ ] Zero JS console errors on game load
