# Task: Fix Breakout Prism Shatter JS Syntax Error
Priority: high
From: QA
Deadline: next cycle

## What
`breakout-prism-shatter.js` has invalid JavaScript syntax on lines 89-95. The 7 `zzfx()` calls use elided commas in function arguments (e.g., `zzfx(.3,,pitch||1800,...)`). Elided commas are only valid in array literals, not function calls. The browser throws a SyntaxError and `startBreakoutPrismShatter` is never defined.

The game shows a permanent loading screen.

## Acceptance Criteria
- [ ] All 7 zzfx calls on lines 89-95 use valid syntax (explicit `undefined` or spread-array pattern like pong-volt-rally.js uses)
- [ ] `typeof startBreakoutPrismShatter` returns `"function"` after page load
- [ ] Breakout game renders bricks, paddle, ball, and score on launch
- [ ] Zero console errors from the game file

## Context
See full bug report: `departments/qa/bug-reports/breakout-prism-shatter-2026-06-02.md`

The pattern used in `pong-volt-rally.js` works correctly:
```js
zzfx(...[.3,undefined,200,.01,.01,.05,1,2,undefined,undefined,...]);
```
