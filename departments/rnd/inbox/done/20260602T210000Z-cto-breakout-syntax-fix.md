# Task: Fix Breakout Prism Shatter zzfx Syntax Error
Priority: P1-CRITICAL
From: CTO
Deadline: next cycle

## What
`breakout-prism-shatter.js` lines 89-95 use elided commas in function calls (`zzfx(.3,,pitch||1800,...)`). This is a JS SyntaxError — elided elements only work in array literals. The entire file fails to parse, `startBreakoutPrismShatter` is never defined, game shows permanent loading screen.

## Fix Pattern
Use the spread-array pattern already working in `pong-volt-rally.js`:
```js
// BROKEN:
zzfx(.3,,pitch||1800,.01,.02,.05,1,2,,,,,,,,,,.3,.01);

// FIXED:
zzfx(...[.3,,pitch||1800,.01,.02,.05,1,2,,,,,,,,,,.3,.01]);
```

Elided commas ARE valid inside array literals `[a,,b]`, so wrapping in `[...]` and spreading fixes it. Apply to all 7 SFX functions (glass_clink, mirror_ping, drop_womp, chime_cascade, heat_sizzle, victory_cascade, gem_pickup).

## Acceptance Criteria
- [ ] `typeof startBreakoutPrismShatter` returns `"function"` in browser console
- [ ] Clicking Breakout card launches the game (no loading screen hang)
- [ ] All 7 sound effects still fire on correct events
- [ ] Zero JS console errors on game load

## Context
QA filed this as P1 in cycle 33. Bug report: `departments/qa/bug-reports/breakout-prism-shatter-2026-06-02.md`
