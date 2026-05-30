# Pitch: Tetris

## Elevator Pitch
The most iconic puzzle game ever made — stack falling tetrominoes, clear lines, chase high scores — a must-have for any arcade platform.

## Gameplay
- **How does the player interact?** Arrow keys to move/soft-drop, Up to rotate, Space to hard-drop. Simple inputs, deep decisions.
- **What's the core loop?** A piece falls → player positions and rotates it → piece locks → lines clear → score increases → next piece appears → gravity gets faster. Each piece is a 2-second micro-puzzle under increasing time pressure.
- **What makes it replayable?** The difficulty curve is endless — you can always try to survive one more level. NES-style scoring rewards Tetris clears (4 lines) at 12× the value of singles, incentivizing risky stacking. The 7-bag randomizer ensures fairness while still demanding adaptation.

## Technical Fit
- **Canvas complexity**: Medium — 10×20 grid of colored squares, a next-piece preview box, ghost piece projection, and HUD text. No particle effects or complex sprites.
- **Estimated lines of code**: ~250 lines for the `startTetris()` function.
- **Dependencies on platform features**: Standard canvas game slot (600×400). No additional platform features needed. Score display uses canvas text rendering like existing games.

## Scope
### v1 Deliverables
- All 7 tetrominoes (I, O, T, S, Z, J, L) with 4 rotation states
- 10×20 playfield with faint grid lines
- Movement, clockwise rotation, soft drop, hard drop
- Ghost piece showing landing position
- Next piece preview
- NES-style scoring: Single=40×(lvl+1), Double=100×(lvl+1), Triple=300×(lvl+1), Tetris=1200×(lvl+1)
- Level-up every 10 lines with increasing gravity
- Game over when pieces stack past the top

### Deferred to v2
- Hold piece, T-spin bonuses, wall kicks, line-clear animations

## Mockup
```
┌──────────────────────────────────┐
│  TETRIS             NEXT:       │
│                     ┌────┐      │
│  ┌──────────────┐   │ ██ │      │
│  │              │   │██  │      │
│  │              │   └────┘      │
│  │              │               │
│  │     ████     │   SCORE:      │
│  │      ↓↓      │   004800      │
│  │      ::      │               │
│  │              │   LEVEL:      │
│  │              │   03          │
│  │              │               │
│  │   ▒▒        │   LINES:      │
│  │  ▒▒██       │   27          │
│  │████████  ████│               │
│  │██████████  ██│               │
│  └──────────────┘               │
│                                 │
│  ← → Move  ↑ Rotate  Space Drop│
└──────────────────────────────────┘
```
The playfield sits left-of-center. The right column shows next piece, score, level, and lines. Ghost piece (dotted `::`) shows where the active piece will land. Colors match standard Tetris conventions (cyan I, yellow O, purple T, etc.).
