# ADR-001: Game Module Cleanup Contract

**Date:** 2026-05-30
**Status:** Proposed
**Context:** Vanilla JS restructure pivot

## Decision

Every game module under `js/games/` must export a `stop()` function that:

1. Cancels any `requestAnimationFrame` handle
2. Clears all `setInterval` / `setTimeout` handles
3. Removes all `addEventListener` bindings added by the game
4. Nullifies references to canvas context
5. Returns synchronously (no async cleanup)

## Pattern

```js
export function stop() {
  cancelAnimationFrame(rafId);
  clearInterval(timerInterval);
  document.removeEventListener('keydown', handleKey);
  document.removeEventListener('keyup', handleKeyUp);
  ctx = null;
}
```

## Rationale

Current `startXxx()` functions use closure-captured `cleanup()` that the next game call invokes. This works in the monolith but breaks with dynamic imports because the closure reference isn't shared across modules. An explicit `stop()` export makes the contract visible and testable.

## Consequences

- R&D must refactor each game's cleanup during extraction
- `main.js` game loader calls `currentGame.stop()` before loading next game
- QA can verify cleanup by checking for leaked listeners after game switch
