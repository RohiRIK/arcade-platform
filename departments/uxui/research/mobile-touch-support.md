# Research: Mobile Touch Support

## Problem
All three games (Snake, Pong, Breakout) require keyboard input (arrow keys). On mobile devices, there are no physical arrow keys, making the games completely unplayable. The game grid and header are passably responsive via CSS grid auto-fill, but the games themselves are dead on touch devices.

## Current State
- Snake: `keydown` listener for ArrowUp/Down/Left/Right + R to restart
- Pong: `keydown` listener for ArrowUp/Down
- Breakout: `keydown` listener for ArrowLeft/Right + R to restart
- Canvas is fixed at 600×400, no scaling for small screens
- No `touch` event listeners anywhere in codebase

## Inspiration
- **itch.io mobile games**: Overlay translucent D-pad and action buttons over the canvas. Simple, recognizable, doesn't obscure too much gameplay area.
- **RetroArch touch overlay**: Minimal virtual gamepad with directional arrows + action buttons. Semi-transparent, positioned at bottom of screen.
- **Google Chrome dino game**: Tap-anywhere for single action (jump). Simple but only works for single-input games.

## Proposed Approach
1. **Touch D-pad overlay**: A translucent 4-directional pad (for Snake) or left/right buttons (for Pong/Breakout) rendered as HTML elements positioned over/below the canvas. Only shown when `'ontouchstart' in window` or screen width ≤ 768px.
2. **Swipe gestures for Snake**: Alternative to D-pad — swipe direction on canvas sets snake direction. More natural on mobile.
3. **Canvas scaling**: Scale canvas to fit viewport width on small screens using CSS `max-width: 100%; height: auto;` while keeping internal resolution.
4. **Restart button**: HTML button instead of requiring "R" key press.

## Recommendation
Start with the touch D-pad overlay approach — it's explicit, discoverable, and works across all three games with minor per-game customization. Swipe can be added later as an enhancement for Snake specifically.

## Scope
- This is a UX/UI concern (overlay HTML/CSS + touch event dispatching)
- Game logic changes (if any) would need R&D coordination via inbox
- Touch events should synthesize the same `keydown` events so game code needs zero changes
