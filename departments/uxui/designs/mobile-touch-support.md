# Design: Mobile Touch Support

## Current State
```
┌──────────────────────────────────┐
│         🕹️ ARCADE               │
│   [Games] [Changelog] [Config]  │
├──────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │  🐍  │ │  🏓  │ │  🧱  │    │
│  │Snake │ │ Pong │ │Break │    │
│  └──────┘ └──────┘ └──────┘    │
│                                  │
│  When game launched:             │
│  ┌──────────────────────┐       │
│  │  600×400 canvas      │       │
│  │  (fixed, no scaling) │       │
│  └──────────────────────┘       │
│  "Arrow keys to move"           │
│  (no touch support)             │
└──────────────────────────────────┘
```

- Canvas is hardcoded 600×400, overflows on phones
- Games only respond to `keydown` events
- No touch listeners, no on-screen controls
- "Press R to restart" requires keyboard

## Proposed State
```
┌──────────────────────────────────┐
│         🕹️ ARCADE               │
│   [Games] [Changelog] [Config]  │
├──────────────────────────────────┤
│  ← Back to Games                │
│  Snake                          │
│  ┌──────────────────────┐       │
│  │                      │       │
│  │  canvas (scales to   │       │
│  │  max-width: 100%)    │       │
│  │                      │       │
│  └──────────────────────┘       │
│                                  │
│  [🔄 Restart]  ← HTML button    │
│                                  │
│  ┌─────────────────────┐        │
│  │       [ ▲ ]         │        │
│  │  [ ◀ ]     [ ▶ ]   │        │
│  │       [ ▼ ]         │        │
│  └─────────────────────┘        │
│  (touch D-pad, shown only on    │
│   touch devices / ≤768px)       │
│                                  │
│  For Pong:                      │
│  ┌─────────────────────┐        │
│  │  [ ▲ ]              │        │
│  │  [ ▼ ]              │        │
│  └─────────────────────┘        │
│                                  │
│  For Breakout:                  │
│  ┌─────────────────────┐        │
│  │  [ ◀ ]     [ ▶ ]   │        │
│  └─────────────────────┘        │
└──────────────────────────────────┘
```

## CSS Changes

### 1. Canvas Responsive Scaling
```css
/* Add to .game-view canvas */
.game-view canvas {
  max-width: 100%;
  height: auto;
}
```

### 2. Touch Controls Container
```css
.touch-controls {
  display: none;  /* hidden by default */
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  user-select: none;
  -webkit-user-select: none;
}

/* Show on touch-capable / narrow screens */
@media (max-width: 768px), (pointer: coarse) {
  .touch-controls {
    display: flex;
  }
}
```

### 3. D-Pad Layout
```css
.touch-dpad {
  display: grid;
  grid-template-areas:
    ". up ."
    "left . right"
    ". down .";
  grid-template-columns: 60px 60px 60px;
  grid-template-rows: 60px 60px 60px;
  gap: 4px;
}

.touch-dpad-vertical {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.touch-dpad-horizontal {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.touch-btn {
  width: 60px;
  height: 60px;
  background: #1a1a2e;
  border: 1px solid #333;
  border-radius: 8px;
  color: #ccc;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.touch-btn:active {
  background: #e94560;
  color: #fff;
  border-color: #e94560;
}

.touch-btn[data-dir="up"] { grid-area: up; }
.touch-btn[data-dir="down"] { grid-area: down; }
.touch-btn[data-dir="left"] { grid-area: left; }
.touch-btn[data-dir="right"] { grid-area: right; }
```

### 4. Restart Button
```css
.restart-btn {
  background: #1a1a2e;
  border: 1px solid #333;
  color: #ccc;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  transition: all 0.2s;
}

.restart-btn:hover, .restart-btn:active {
  background: #e94560;
  color: #fff;
  border-color: #e94560;
}
```

### 5. Mobile Header Adjustments
```css
@media (max-width: 768px) {
  .header h1 { font-size: 1.8rem; }
  .header { padding: 1rem; }
  .content { margin: 1rem auto; }
}
```

## HTML Changes

### 1. Add restart button after controls div
```html
<div class="controls" id="gameControls"></div>
<button class="restart-btn" id="restartBtn" onclick="restartGame()" style="display:none">🔄 Restart</button>
<div class="touch-controls" id="touchControls"></div>
```

### 2. Touch controls are injected dynamically by JS based on game type

## JavaScript Changes (UX layer only — no game logic changes)

### 1. Touch control renderer
```javascript
function renderTouchControls(gameId) {
  const tc = document.getElementById('touchControls');
  const rb = document.getElementById('restartBtn');
  rb.style.display = '';

  if (gameId === 'snake') {
    tc.innerHTML = `
      <div class="touch-dpad">
        <button class="touch-btn" data-dir="up">▲</button>
        <button class="touch-btn" data-dir="left">◀</button>
        <button class="touch-btn" data-dir="right">▶</button>
        <button class="touch-btn" data-dir="down">▼</button>
      </div>`;
  } else if (gameId === 'pong') {
    tc.innerHTML = `
      <div class="touch-dpad-vertical">
        <button class="touch-btn" data-dir="up">▲</button>
        <button class="touch-btn" data-dir="down">▼</button>
      </div>`;
  } else if (gameId === 'breakout') {
    tc.innerHTML = `
      <div class="touch-dpad-horizontal">
        <button class="touch-btn" data-dir="left">◀</button>
        <button class="touch-btn" data-dir="right">▶</button>
      </div>`;
  }

  // Touch → keydown event synthesis
  tc.querySelectorAll('.touch-btn').forEach(btn => {
    const keyMap = { up:'ArrowUp', down:'ArrowDown', left:'ArrowLeft', right:'ArrowRight' };
    const key = keyMap[btn.dataset.dir];

    const fireKey = () => document.dispatchEvent(new KeyboardEvent('keydown', { key }));

    btn.addEventListener('touchstart', e => { e.preventDefault(); fireKey(); });
    btn.addEventListener('mousedown', e => { e.preventDefault(); fireKey(); });
  });
}
```

### 2. restartGame function
```javascript
function restartGame() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
}
```

### 3. Wire into launchGame
Add `renderTouchControls(id)` call at end of `launchGame()`.

### 4. Clean up in backToGrid
Hide restart button, clear touch controls.

## Interaction Notes

- **Touch feedback**: `:active` state on buttons provides instant visual feedback (accent color flash)
- **Event synthesis**: Touch buttons dispatch real `KeyboardEvent('keydown')` so game code needs zero changes
- **Repeat input**: For continuous movement (Pong/Breakout), users tap repeatedly. A future enhancement could add touch-hold repeat with `setInterval`.
- **Responsive canvas**: `max-width: 100%; height: auto` scales the canvas display while keeping the internal 600×400 resolution (CSS scaling, not canvas resize)
- **Progressive disclosure**: Touch controls only appear on touch/narrow devices via media query, desktop users see no change
- **No viewport lock**: We don't prevent zoom — accessibility first

## Space Invaders Support (added 2026-05-29)
- Layout: horizontal d-pad (left/right) + separate FIRE button (🔫)
- Fire button: 80px wide, margin-left 1rem, synthesizes Space keydown
- Key mapping: left→ArrowLeft, right→ArrowRight, fire→' ' (Space)
- Consistent with Breakout horizontal layout, plus action button

## Out of Scope (future iterations)
- Swipe gestures for Snake
- Touch-hold for continuous movement
- Haptic feedback via Vibration API
- Landscape orientation lock suggestion
