# Spec: Game Module `stop()` Export Contract

**Date:** 2026-05-30
**Updated:** 2026-05-30 (v2 — LittleJS engine isolation per CTO directive)
**Context:** CTO ADR-001, arcade-evolution pivot Phase 1 prerequisite
**Status:** Updated with LittleJS engine teardown requirements

## Overview

Each game extracted to `js/games/<name>.js` must export a `stop()` function that fully cleans up all runtime state. This replaces the current closure-based `cleanup()` pattern which won't survive module boundaries.

## Contract

Every `stop()` MUST:
1. Cancel `requestAnimationFrame` handle(s)
2. Clear all `setInterval` / `setTimeout` handles
3. Remove all `addEventListener` bindings added by the game
4. Nullify canvas context reference
5. Return synchronously (no async)

## Per-Game Cleanup Inventory

### Snake
- **Loop:** `setInterval` → store handle, `clearInterval` in stop()
- **Listeners:** 1× `keydown` → `removeEventListener`
- **Refs:** ctx → null

### Pong
- **Loop:** `setInterval` → store handle, `clearInterval` in stop()
- **Listeners:** 1× `keydown` → `removeEventListener`
- **Refs:** ctx → null

### Breakout
- **Loop:** `setInterval` → store handle, `clearInterval` in stop()
- **Listeners:** 2× (`mousemove`, `keydown`) → `removeEventListener`
- **Refs:** ctx → null

### Tetris
- **Loop:** `requestAnimationFrame` → store handle, `cancelAnimationFrame` in stop()
- **Timers:** `setTimeout` (lock timer) → store handle, `clearTimeout` in stop()
- **Listeners:** 1× `keydown` → `removeEventListener`
- **Refs:** ctx → null

### Space Invaders
- **Loop:** `requestAnimationFrame` → store handle, `cancelAnimationFrame` in stop()
- **Listeners:** 2× (`keydown`, `keyup`) → `removeEventListener`
- **Refs:** ctx → null

### Pac-Man
- **Loop:** `requestAnimationFrame` → store handle, `cancelAnimationFrame` in stop()
- **Listeners:** 1× `keydown` → `removeEventListener`
- **Refs:** ctx → null

### Frogger
- **Loop:** `requestAnimationFrame` → store handle, `cancelAnimationFrame` in stop()
- **Listeners:** 1× `keydown` → `removeEventListener`
- **Refs:** ctx → null

## Implementation Template

```js
// js/games/<name>.js
let rafId = null;
let intervalId = null;
let timeoutId = null;
let ctx = null;
let handleKey = null;
let handleKeyUp = null;

export function start(canvas) {
  ctx = canvas.getContext('2d');
  handleKey = (e) => { /* ... */ };
  document.addEventListener('keydown', handleKey);
  // game loop
  function loop() {
    // update + draw
    rafId = requestAnimationFrame(loop);
  }
  loop();
}

export function stop() {
  if (rafId) cancelAnimationFrame(rafId);
  if (intervalId) clearInterval(intervalId);
  if (timeoutId) clearTimeout(timeoutId);
  if (handleKey) document.removeEventListener('keydown', handleKey);
  if (handleKeyUp) document.removeEventListener('keyup', handleKeyUp);
  ctx = null;
  rafId = null;
}
```

## main.js Loader Pattern

```js
let currentGame = null;

async function loadGame(name) {
  if (currentGame?.stop) currentGame.stop();
  currentGame = await import(`./games/${name}.js`);
  currentGame.start(canvas);
}
```

## LittleJS Engine Teardown (v2 addition — CTO directive)

### Problem

LittleJS uses global mutable state: `engineObjects`, `cameraPos`, `frame`, input handlers, WebGL context. The app-level `stop()` contract above does NOT cover engine internals. Switching between LittleJS games (or from LittleJS to legacy) leaks state.

### Additional `stop()` Requirements for LittleJS Games

Every LittleJS game `stop()` MUST also:

6. Clear `engineObjects` array → `engineObjects.length = 0`
7. Reset camera → `setCameraPos(vec2())`, `setCameraScale(1)`
8. Reset frame counter → `frame = 0`
9. Unbind LittleJS internal input handlers → call `engineObjectsDestroy()` if available, otherwise manually clear `inputData` / `keyIsDown` state
10. Destroy WebGL context if LittleJS was using it → `glCanvas?.remove()`, nullify `glContext`
11. Call `engineInit()` teardown or equivalent reset function

### Engine Reset Function

```js
// shared/engine-reset.js
function resetLittleJS() {
  // Clear all engine objects
  engineObjects.length = 0;
  engineObjectsDestroy?.();

  // Reset camera
  setCameraPos(vec2());
  setCameraScale(1);

  // Reset frame
  frame = 0;

  // Clear input state
  clearInput?.();
  // If no clearInput, manually:
  // inputData.length = 0;
  // mousePos = vec2();

  // Destroy WebGL overlay if present
  if (typeof glCanvas !== 'undefined' && glCanvas) {
    glCanvas.remove();
    glContext = null;
    glCanvas = null;
  }

  // Cancel engine's own rAF
  if (typeof engineFrameId !== 'undefined' && engineFrameId) {
    cancelAnimationFrame(engineFrameId);
    engineFrameId = null;
  }
}
```

### Dual-Mode Loader

During Phases 2-4, the game loader must handle both LittleJS and legacy canvas games:

```js
let currentGame = null;
let littlejsActive = false;

const LITTLEJS_GAMES = []; // populated as games are migrated

async function loadGame(name) {
  // 1. Stop current game
  if (currentGame?.stop) currentGame.stop();

  // 2. If LittleJS was active, tear down engine
  if (littlejsActive) {
    resetLittleJS();
    littlejsActive = false;
  }

  // 3. Load new game module
  currentGame = await import(`./games/${name}.js`);

  // 4. If new game is LittleJS, init engine first
  if (LITTLEJS_GAMES.includes(name)) {
    await initLittleJS(canvas);
    littlejsActive = true;
  }

  // 5. Start game
  currentGame.start(canvas);
}
```

### Shared Module Init Order

`platform-ui.js` and `audio.js` MUST NOT assume LittleJS is initialized at import time:

```js
// BAD — crashes if LittleJS not loaded yet
import { zzfx } from 'littlejs';
export function playSound() { zzfx(...); }

// GOOD — lazy init, works for both legacy and LittleJS games
let _zzfx = null;
export function playSound(params) {
  if (!_zzfx) _zzfx = window.zzfx || (() => {});
  _zzfx(...params);
}
```

### Engine Isolation Proof Test

Before Snake rewrite begins, run this verification:

```
Test: Engine Isolation PoC
1. Init LittleJS, create 50 engineObjects (game A simulation)
2. Call stop() + resetLittleJS()
3. Verify: engineObjects.length === 0
4. Verify: no rAF callbacks running (measure frame count stability)
5. Verify: document event listeners === baseline count
6. Init LittleJS again, create 10 objects (game B simulation)
7. Verify: engineObjects.length === 10 (not 60)
8. Load a legacy canvas game
9. Verify: LittleJS globals don't interfere with 2D context drawing
10. PASS if all 9 checks green
```

**Deliverable:** PoC script + documented results committed before Phase 2.

## QA Verification

After `stop()` + load next game:
- `getEventListeners(document)` should show no stale handlers
- No rAF callbacks firing for previous game
- No console errors from orphaned timers
- (LittleJS) `engineObjects.length === 0`
- (LittleJS) No WebGL canvas overlay remaining
- (Dual-mode) Legacy games render correctly after LittleJS game was stopped
