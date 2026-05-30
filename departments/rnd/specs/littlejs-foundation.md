# Spec: LittleJS Foundation (Phase 1)

**Date:** 2026-05-31
**Depends on:** stop-contract.md, game-over-screen-polish.md (UX/UI), snake-creative-direction.md (Creative)
**Phase:** arcade-evolution Phase 1

---

## 1. CSS Extraction

Extract all content between `<style>` and `</style>` in index.html into `css/styles.css`. Replace with:
```html
<link rel="stylesheet" href="css/styles.css">
```

No CSS modifications — exact copy. This unblocks UX/UI for independent style iteration.

---

## 2. js/shared/platform-ui.js

Per UX/UI design doc (game-over-screen-polish.md):

```js
/**
 * Shared game-over overlay renderer.
 * Used by all games for consistent end-screen experience.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} options
 * @param {number} options.score - Final score
 * @param {number} [options.highScore] - High score (omit to skip)
 * @param {boolean} [options.isNewBest=false] - Show "NEW HIGH SCORE!" celebration
 * @param {boolean} [options.isWin=false] - Show "YOU WIN!" instead of "GAME OVER"
 * @param {string} [options.accent='#e94560'] - Title color override (per-game identity)
 */
function drawGameOverOverlay(ctx, options) {
  const { score, highScore, isNewBest = false, isWin = false, accent = '#e94560' } = options;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  // Overlay background
  ctx.fillStyle = 'rgba(15, 15, 35, 0.85)';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = isWin ? '#4ade80' : accent;
  const title = isWin ? '══ YOU WIN! ══' : '══ GAME OVER ══';
  ctx.fillText(title, W / 2, H / 2 - 40);

  // Score
  ctx.font = '18px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 10);

  // High score
  if (highScore !== undefined) {
    ctx.font = '14px monospace';
    ctx.fillStyle = '#888888';
    ctx.fillText(`Best: ${highScore}`, W / 2, H / 2 + 35);
  }

  // New high score celebration
  if (isNewBest) {
    ctx.font = '16px monospace';
    ctx.fillStyle = '#facc15';
    ctx.fillText('★ NEW HIGH SCORE! ★', W / 2, H / 2 + 60);
  }

  // Restart prompt
  ctx.font = '14px monospace';
  ctx.fillStyle = '#888888';
  ctx.fillText('Press R to restart', W / 2, H / 2 + 90);
}
```

**Note:** This is a standalone function. During Phase 1 it's available globally. Games adopt it individually in later phases.

---

## 3. js/shared/audio.js

```js
/**
 * Audio wrapper with lazy zzfx initialization.
 * Works for both legacy games (no sound) and LittleJS games (zzfx).
 * Does nothing if zzfx not available — graceful degradation.
 */
let _zzfx = null;
let _muted = false;

function initAudio() {
  if (!_zzfx) {
    _zzfx = window.zzfx || null;
  }
}

function playSound(params) {
  if (_muted) return;
  initAudio();
  if (_zzfx) _zzfx(...params);
}

function setMuted(muted) {
  _muted = muted;
}

function isMuted() {
  return _muted;
}
```

---

## 4. js/shared/engine-reset.js

Per stop-contract spec v2:

```js
/**
 * Tears down LittleJS engine state between game switches.
 * Must be called AFTER game's own stop() and BEFORE next game init.
 */
function resetLittleJS() {
  // Clear all engine objects
  if (typeof engineObjects !== 'undefined') {
    engineObjects.length = 0;
  }

  // Reset camera
  if (typeof setCameraPos === 'function') {
    setCameraPos(vec2());
    setCameraScale(1);
  }

  // Reset frame counter
  if (typeof frame !== 'undefined') {
    frame = 0;
  }

  // Clear input state
  if (typeof clearInput === 'function') {
    clearInput();
  }

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

---

## 5. js/main.js

Dual-mode game loader that wraps existing `launchGame`:

```js
/**
 * Dual-mode game loader.
 * Handles both legacy inline games and future LittleJS module games.
 * During Phase 1, delegates to existing launchGame(). 
 * Phase 2+ adds LittleJS game routing.
 */

const LITTLEJS_GAMES = []; // Populated as games migrate: ['snake', 'pong', ...]
let littlejsActive = false;
let currentModuleGame = null;

async function loadGame(name) {
  // If a LittleJS module game was active, tear down engine
  if (littlejsActive && currentModuleGame?.stop) {
    currentModuleGame.stop();
    resetLittleJS();
    littlejsActive = false;
    currentModuleGame = null;
  }

  if (LITTLEJS_GAMES.includes(name)) {
    // Future: load LittleJS game module
    // currentModuleGame = await import(`./games/${name}.js`);
    // littlejsActive = true;
    // currentModuleGame.start(document.getElementById('gameCanvas'));
    console.warn(`[main.js] LittleJS game '${name}' not yet migrated, falling through to legacy`);
  }

  // Delegate to legacy launcher (existing inline function)
  if (typeof launchGame === 'function') {
    launchGame(name);
  }
}
```

**Phase 1 behavior:** `loadGame()` is defined but not yet wired as the primary entry point. Existing `launchGame()` remains the active launcher. `loadGame()` is available for Phase 2 integration.

---

## 6. index.html Changes

Minimal changes:
1. Replace `<style>...</style>` with `<link rel="stylesheet" href="css/styles.css">`
2. Add script tags before closing `</body>`:
   ```html
   <script src="lib/littlejs.min.js"></script>
   <script src="js/shared/engine-reset.js"></script>
   <script src="js/shared/platform-ui.js"></script>
   <script src="js/shared/audio.js"></script>
   <script src="js/main.js"></script>
   ```
3. All existing game code stays inline (unchanged)

---

## Acceptance Criteria

- [ ] Page loads without JS errors in browser console
- [ ] All 7 games launch and play correctly
- [ ] CSS renders identically to pre-extraction
- [ ] `drawGameOverOverlay` is callable from console
- [ ] `resetLittleJS` is callable without error (no-op when engine not init)
- [ ] `playSound` is callable without error (no-op when zzfx unavailable)
- [ ] Docker rebuild succeeds
- [ ] Health check passes
- [ ] No hardcoded localhost in new files
- [ ] Canvas remains 600×400
- [ ] LAN access works

---

## Build Order

1. Extract CSS → `css/styles.css`
2. Write `js/shared/platform-ui.js`
3. Write `js/shared/audio.js`
4. Write `js/shared/engine-reset.js`
5. Write `js/main.js`
6. Update `index.html` (link CSS, add script tags)
7. Docker rebuild + smoke test
