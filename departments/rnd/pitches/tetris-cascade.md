# Pitch: Tetris Cascade

## Elevator Pitch
The most iconic puzzle game ever made, reborn as "Cascade" — a zen-industrial experience where liquid-metal fragments solidify into place, line clears trigger molten dissolve animations, and the world itself shifts from cold steel to red-hot meltdown as tension rises.

## Gameplay
- **How does the player interact?** Arrow keys to move/soft-drop, Up to rotate (SRS with wall kicks), Space to hard drop, C to hold piece. Clean, responsive controls.
- **What's the core loop?** Piece falls → player positions/rotates → piece locks with solidify flash → lines dissolve with molten drain animation → score ticks up → next piece drops → gravity accelerates. Every clear feels physical — metal dissolving, particles spraying, the forge heating up.
- **What makes it replayable?** Five seamless stages from Cold Forge (calm, meditative) to Meltdown Zone (frantic survival at 100ms drops). T-spin detection rewards mastery. Combo counter rewards consecutive clears. The Tetris Meltdown (4-line clear) is a spectacular payoff — 40 molten particles, screen shake, score eruption. High score persists via localStorage.

## Technical Fit
- **Canvas complexity:** Medium-high — 10×20 grid with bevel-effect cells, ghost piece, next/hold previews, ambient particles (up to 12 background sparks), line-clear dissolve animations, combo/T-spin callouts, background color shifting by stack height, CRT scan-line overlay in late stages.
- **Estimated lines of code:** ~700-800 lines for `startTetrisCascade()`.
- **Dependencies:** Standard 600×400 canvas, zzfx for 8 sound effects, localStorage for high score. All procedural rendering, no sprites.

## Scope
### v1 Deliverables (per Creative Direction + Stage Script)
- All 7 tetrominoes with SRS rotation + wall kicks
- 10×20 well with bevel-effect cells (28×28 in 30×30 slots)
- Ghost piece (outlined, 20% opacity)
- Next piece + Hold piece previews
- 5 seamless stages: Cold Forge → Warm Metal → Crucible → Red Heat → Meltdown Zone
- Background tension shift (`#0a0e14` → `#1a0a0a` as stack rises)
- Ambient metallic spark particles (3→12 by stage)
- T-spin detection with 2× multiplier + callout text
- Combo counter for consecutive clears
- Meltdown Zone ×1.5 base score multiplier
- 8 zzfx sounds: metal_tick, gear_click, clamp_thud, slam_impact, drain_hiss, meltdown_boom, power_surge, shutdown
- Line-clear dissolve animations (single/double/triple/Tetris meltdown)
- Solidify flash on piece lock, hard drop impact particles
- Level-up border pulse + center text
- Game over: row-by-row gray-out bottom→top
- High score via localStorage

### Deferred
- Metal ambient drone (Web Audio oscillator) — complex, low ROI for v1
- CRT scan-line overlay in Stage 5 — adds visual noise, defer to polish pass

## Mockup
```
┌─────────────────────────────────────┐
│                                     │
│  ┌──────────────────┐   NEXT:      │
│  │                  │   ┌──────┐   │
│  │                  │   │  ██  │   │
│  │                  │   │ ██   │   │
│  │       ████       │   └──────┘   │
│  │        ↓↓        │              │
│  │        ▒▒        │   HOLD:      │
│  │                  │   ┌──────┐   │
│  │                  │   │ ████ │   │
│  │                  │   └──────┘   │
│  │                  │              │
│  │    ▒▒            │   SCORE      │
│  │   ▒▒██           │   012400     │
│  │ ████████  ████   │   LEVEL      │
│  │ ██████████  ██   │   06         │
│  └──────────────────┘   LINES      │
│                         54         │
│  ← → Move  ↑ Rotate  Space Drop   │
└─────────────────────────────────────┘
```
Cells rendered with liquid-metal colors (cyan, gold, purple, green, red, orange, blue) and bevel highlights. Ghost piece outlined. Background shifts warm/red as stack grows past row 15. Ambient spark particles drift across the background.
