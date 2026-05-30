# Pitch: Space Invaders

## Elevator Pitch
The 1978 game that launched the arcade revolution — defend Earth from descending alien waves with a single laser cannon, using destructible shields for cover as the invaders speed up relentlessly.

## Gameplay
- **Player interaction**: Move left/right, fire one bullet at a time. Simple two-button mastery.
- **Core loop**: Clear all 55 aliens → next wave starts lower and faster. Survive as long as possible, chase high score.
- **Replayability**: The escalating speed creates genuine tension every round. Each wave plays differently as shield erosion changes your cover options. The "last alien zooming across the screen" moment is iconic panic. Mystery UFO adds risk/reward — do you break position to grab bonus points?

## Technical Fit
- **Canvas complexity**: Medium — pixel-art sprites via fillRect, shield erosion via boolean grids, no heavy rendering.
- **Estimated lines of code**: 280–350 (game function + sprite drawing helpers).
- **Dependencies on platform features**: None beyond standard canvas and keyboard input already used by Breakout/Pong/Snake.

## Scope
- 11×5 alien grid, 3 types (10/20/30 pts), two-frame animation
- Single player bullet, multiple alien bombs
- 4 destructible shields with pixel-by-pixel erosion
- Mystery UFO with random point values
- Speed escalation, wave progression, 3 lives
- Skip: two-player mode, sound, attract mode

## Mockup
```
  SCORE: 0340        HI-SCORE: 1250        LIVES: ♦♦♦

               ?????                          ← UFO (occasional)

     ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼                 ← 30pt aliens (top)
     ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆                 ← 20pt aliens
     ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆                 ← 20pt aliens
     ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■                 ← 10pt aliens
     ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■                 ← 10pt aliens (bottom)

        ████      ████      ████      ████   ← destructible shields

                    ▲                         ← player cannon
  ─────────────────────────────────────────
```
