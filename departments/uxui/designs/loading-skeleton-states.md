# Design: Loading & Skeleton States

## Current State
- Game grid renders instantly with no transition — blank flash on slower connections
- Game launch: clicking a card shows game-view div, canvas is blank until first frame draws
- Health indicator: jumps directly to "Online" or "Offline" with no intermediate state
- No `@keyframes` for skeleton/pulse exists yet

## Proposed State

### 1. Game Launch Loading Overlay (highest value)
When `launchGame()` is called, a loading overlay appears over the canvas area:

```
┌──────────────────────────────────┐
│                                  │
│           🐍                     │
│       LOADING...                 │
│                                  │
│       ▓▓▓▓░░░░░░  (pulse bar)   │
│                                  │
└──────────────────────────────────┘
```

- Overlay div `.game-loading` absolutely positioned over canvas
- Shows game emoji (passed from card data) + "LOADING..." in monospace
- CSS-only pulsing bar beneath text
- Hidden by JS after first `requestAnimationFrame` callback in the game loop (or 500ms timeout)
- Fades out with `opacity` transition

### 2. Health Check Pending State
Before first health response:
```
⏳ Checking...   (yellow pulsing dot)
```
- Status text changes from hardcoded "Online"/"Offline" to three states: checking/online/offline
- Checking state uses `var(--warning)` color with pulse animation

### 3. Skeleton Pulse Keyframe (shared)
Used by loading overlay bar and health pending dot.

## CSS Changes

### New keyframe
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
}
```

### Game loading overlay
```css
.game-loading {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-canvas);
  z-index: 10;
  border-radius: var(--radius-md);
  transition: opacity 0.3s ease;
}
.game-loading.hidden {
  opacity: 0;
  pointer-events: none;
}
.game-loading .loading-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.game-loading .loading-text {
  font-family: monospace;
  font-size: 1.2rem;
  color: var(--text-primary);
  letter-spacing: 0.15em;
}
.game-loading .loading-bar {
  width: 120px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
}
.game-loading .loading-bar-fill {
  width: 40%;
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  animation: loading-slide 1s ease-in-out infinite;
}
@keyframes loading-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
```

### Health pending state
```css
.health-bar .status-checking {
  color: var(--warning);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
```

### Canvas wrapper (needs position:relative for overlay)
```css
.canvas-wrapper {
  position: relative;
  display: inline-block;
}
```

## HTML Changes

### Game view section — wrap canvas in `.canvas-wrapper`, add loading overlay
```html
<div class="canvas-wrapper">
  <div class="game-loading" id="gameLoading">
    <div class="loading-icon" id="loadingIcon">🎮</div>
    <div class="loading-text">LOADING...</div>
    <div class="loading-bar"><div class="loading-bar-fill"></div></div>
  </div>
  <canvas id="gameCanvas" width="600" height="400"></canvas>
</div>
```

### Health bar — initial state shows "Checking..."
Change initial health text from empty/Online to `⏳ Checking...` with class `status-checking`.

## JS Changes (minimal, UI-only)

### In `launchGame()`
```js
// Show loading overlay with game emoji
document.getElementById('loadingIcon').textContent = gameEmoji;
const overlay = document.getElementById('gameLoading');
overlay.classList.remove('hidden');
// Hide after game starts (delay to let first frame render)
setTimeout(() => overlay.classList.add('hidden'), 400);
```

### In health check fetch
```js
// Before fetch: show checking state (only on first load)
// After response: replace with online/offline as today
```

## Interaction Notes
- Loading overlay fades out (0.3s opacity transition) — no abrupt hide
- Loading bar slides continuously — gives sense of activity without false progress indication
- Health pulse stops when status resolves — clean state machine
- All animations are CSS-only, no JS animation loops
- Mobile: overlay scales naturally since canvas already has `max-width: 100%`
