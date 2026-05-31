# Research: Pong Volt Rally — Card Identity & HUD

## Problem
Pong is being rewritten as "Volt Rally" — an electric duel theme with cyan/orange Tesla coil paddles and plasma ball. The game card in the selection grid currently uses a generic tinted banner. It needs a distinct visual identity matching the electric/voltage theme, consistent with how Snake got its dark-green neon glow treatment.

The in-game HUD elements (rally counter, score display, win text) also need CSS consideration for the game-over overlay and any platform-level UI pieces.

## Inspiration
- **Tron Legacy UI** — cyan/orange neon contrast on black, electric grid lines. The duality of two colors representing opposing forces maps perfectly to Pong's two-player dynamic.
- **Tesla coil photography** — electric arcs have a characteristic blue-white/purple glow with orange heat at contact points. The color split (cyan left, orange right) is visually striking.
- **Modern fighting game select screens** — player 1 vs player 2 color coding (blue vs red/orange) is an established pattern players recognize instantly.

## Proposed Approach

### Card Banner
- Dark gradient: `#050510` (near-black blue) → `#1a1a2e` (standard card bg) at 135deg
- Text shadow: dual glow combining both player colors — cyan `#00e5ff` and orange `#ff6d00`
- This makes the Pong card immediately recognizable as an "electric duel" game
- Pattern: same `data-game="pong"` attribute approach used for Snake

### HUD Considerations
- Rally counter: amber `#ffab00`, appears after 5-hit rallies, pulses — this is canvas-rendered by R&D, no CSS needed
- Score display: monospace, top-center — canvas-rendered
- Win text: uses winner's color with flicker — canvas-rendered
- **No platform-level HUD CSS needed** — Pong's HUD is entirely canvas-drawn per Creative spec

### Scope
- Card banner CSS: 2 rules (gradient + text-shadow) following Snake pattern
- `data-game="pong"` attribute on the game card HTML element
- No game logic changes (R&D domain)
- No HUD CSS (all canvas-rendered)

## Risk
- Low. Same pattern as Snake card identity. 1:1 additions, no modifications to existing rules.
