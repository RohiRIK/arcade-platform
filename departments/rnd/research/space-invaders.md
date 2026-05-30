# Research: Space Invaders

## Original Game Analysis
- **Creator**: Tomohiro Nishikado, published by Taito (Japan) and Midway (US)
- **Year**: 1978
- **Platform**: Custom Intel 8080 hardware, later ported everywhere
- **Cultural impact**: One of the first major arcade hits; helped launch the golden age of arcade games. Caused a 100-yen coin shortage in Japan.

### Core Mechanics
- **Player controls a laser cannon** that moves horizontally along the bottom of the screen.
- **55 aliens arranged in an 11×5 grid** march left-to-right, shift down one row when hitting a screen edge, then reverse direction. Speed increases as aliens are destroyed.
- **Player fires one bullet at a time** — no rapid fire. You must wait for your shot to hit or leave the screen before firing again.
- **Aliens fire randomly** — aliens in the lowest row of each column can drop bombs downward. Frequency increases as fewer aliens remain.
- **4 destructible shields (bunkers)** sit between the player and aliens. Both player bullets and alien bombs erode them pixel by pixel. Aliens marching through them also destroy them.
- **Mystery UFO (flying saucer)** appears periodically across the top of the screen. Worth 50–300 points (in the original, the score depends on shot count — every 23rd shot yields 300 points, a famous exploit).

### Scoring System
- Bottom row aliens (easiest to hit): 10 points
- Middle rows: 20 points  
- Top row (smallest, hardest): 30 points
- Mystery UFO: 50, 100, 150, or 300 points (pattern-based in original; we'll use random for simplicity)

### Difficulty Curve
- As aliens are destroyed, the remaining ones move faster — this is the iconic escalation mechanic. The original achieved this as a side effect: fewer sprites to render meant the CPU processed each frame faster.
- Each new wave starts aliens one row lower, making the game progressively harder across rounds.
- Alien fire rate increases with fewer aliens remaining.

### Control Scheme
- Left/Right arrows to move cannon
- Space bar to fire (one active bullet at a time)
- That's it — beautifully simple.

## Technical Approach

### Data Structures
- **Alien grid**: 2D array (5 rows × 11 cols) of `{ alive: boolean, type: 0|1|2 }`. Type determines sprite and point value.
- **Alien fleet state**: `{ x, y, dx (direction), speed, stepDown (flag) }` — the entire grid moves as one unit, individual positions derived from grid indices + fleet offset.
- **Player**: `{ x, y, lives, score }`.
- **Bullets**: Single player bullet `{ x, y, active }`. Array of alien bombs `[{ x, y, active }]`.
- **Shields**: Array of 4 shields, each represented as a 2D pixel grid (e.g., 24×16 boolean array) for erosion.
- **UFO**: `{ x, y, active, direction, points }`.

### Game Loop Design
1. Handle input (move player, fire)
2. Move player bullet upward
3. Move alien bombs downward
4. Move alien fleet (step-based, not continuous — move every N frames, N decreases as count drops)
5. Randomly spawn alien bombs
6. Occasionally spawn UFO
7. Collision detection (bullet↔aliens, bullet↔shields, bombs↔player, bombs↔shields, aliens↔shields, aliens↔ground)
8. Check wave clear → next wave
9. Check lives → game over
10. Render

### Collision Detection
- **Bullet vs aliens**: Convert bullet position to grid cell, check if that alien is alive. Simple and O(1).
- **Bombs vs player**: AABB rectangle overlap.
- **Bullet/Bombs vs shields**: Check pixel in shield's boolean grid, clear a small cluster of pixels on hit (erosion effect).
- **Aliens vs ground line**: If fleet Y + grid height reaches player Y → game over.

### Rendering Approach
- Canvas 600×400.
- Pixel-art style sprites drawn via fillRect blocks (no image assets needed — classic Space Invaders sprites are simple enough to draw procedurally).
- Two-frame animation for aliens (legs open/closed), toggled each time the fleet steps.
- Shields rendered pixel-by-pixel from their boolean grids.
- Clean HUD: score top-left, high score top-center, lives bottom-left (drawn as small cannon icons).

## Scope for Arcade Platform

### v1 Include
- Full 11×5 alien grid with 3 alien types and correct point values
- Single player bullet, multiple alien bombs
- 4 destructible shields with pixel erosion
- Mystery UFO with random scoring
- Speed escalation as aliens die
- Wave progression (aliens start lower each wave)
- Lives system (3 lives)
- Score display and game-over screen
- Two-frame alien animation

### v1 Skip
- Two-player alternating mode
- Exact shot-count-based UFO scoring exploit
- Cabinet-style attract mode
- Sound effects (no audio system in platform yet)

### Estimated Complexity: **M-L**
More complex than Breakout (shields with erosion, fleet movement logic, multiple enemy types) but well-understood patterns. Roughly 250-350 lines of game code.
