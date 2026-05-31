# Research: Breakout (Prism Shatter)

## Original Game Analysis

### History
- **Developer:** Atari, designed by Nolan Bushnell and Steve Bristow, prototyped by Steve Wozniak and Steve Jobs
- **Release:** 1976 (arcade cabinet)
- **Platform:** Dedicated arcade hardware, later Atari 2600 (1978)
- **Legacy:** Spawned Arkanoid (1986, Taito) which added power-ups, multi-hit bricks, and enemies — the template most modern Breakout clones follow. Influenced countless brick-breaker games across every platform.

### Core Mechanics (What Makes It Fun)
1. **Angle control:** Player influences ball trajectory by hitting it with different parts of the paddle. Edge hits create steep angles, center hits go more vertical. This is the skill expression — you're aiming by positioning.
2. **Brick clearing loops:** Each brick destroyed opens more space, changing ball trajectories unpredictably. The field evolves as you play, keeping each moment novel.
3. **Risk/reward tension:** Steeper angles clear bricks faster but are harder to recover. Going for the sides is riskier but more efficient.
4. **Speed escalation:** Original Breakout sped up the ball after hitting the top wall and after clearing certain brick counts, creating natural tension curves within a single level.
5. **Near-miss excitement:** The ball passing just above the paddle edge creates tension no other mechanic can replicate. Every return feels earned.

### Control Scheme
- **Original:** Rotary paddle controller (analog horizontal movement)
- **Modern standard:** Left/right arrow keys or mouse horizontal tracking
- **Our implementation:** Arrow keys + mouse, spacebar/click to launch

### Difficulty Curve
- Original had 2 walls of 8 rows (8 colors, 14 columns = 112 bricks per wall)
- Ball speed increased after 4 hits, 12 hits, and hitting the top wall
- Paddle shrank by 50% after first top-wall hit
- No levels per se — clearing both walls = win, but speed made it brutally hard
- Arkanoid introduced explicit levels with layouts, power-ups, and enemies

### Scoring System
- Original: 1pt (bottom row) to 7pt (top row), colored by row
- Points scaled by row color — higher rows worth more, encouraging risky steep-angle play
- Our adaptation: 10-30pt per brick by row, combo multiplier up to 3.0×, level clear bonuses

## Technical Approach

### Data Structures
- **Brick grid:** 2D array of brick objects `{type: 'standard'|'multi'|'indestructible', hits: number, row: number, col: number, color: string}`. 5 level layouts stored as template arrays.
- **Ball state:** `{x, y, dx, dy, speed, combo, trail: [{x,y}]}` — position, velocity components, current speed, combo counter, trail history for afterimage rendering.
- **Paddle state:** `{x, width, baseWidth}` — horizontal position, current width (may be modified by power-ups), default width for reset.
- **Power-ups:** Array of active falling gems `{x, y, type, rotation}`. Types: wide-paddle, multi-ball, slow.
- **Game state:** `{level, score, lives, highScore, balls: [], powerUpTimers: {}, gamePhase: 'ready'|'playing'|'levelClear'|'gameOver'}`.

### Game Loop Design
1. **Input:** Read keyboard (left/right arrows) and mouse position for paddle
2. **Update:** Move ball(s), check collisions (paddle, bricks, walls, floor), update combo, move power-ups, check power-up collection, check level clear
3. **Render:** Draw background → bricks (with crack overlays) → paddle → ball(s) with trail → particles → power-ups → HUD (score, lives, combo, level)
4. **Transitions:** Level clear animation (prismatic explosion) → next level setup → brick materialize animation

### Collision Detection
- **Ball-brick:** AABB test: check if ball circle intersects any brick rectangle. On hit: determine which face was hit (compare overlap on each axis) to reflect dx or dy appropriately. Remove/damage brick, spawn particles, play sound, increment combo.
- **Ball-paddle:** Ball bottom vs paddle top. Reflection angle based on hit position: `dx = (ballX - paddleCenterX) / (paddleWidth/2) * maxAngle`. Combo resets on paddle hit.
- **Ball-walls:** Simple boundary checks. Reflect dx on side walls, reflect dy on ceiling.
- **Ball-floor:** Life lost. Decrement lives, reset ball to paddle if lives remain, game over if 0.
- **Power-up-paddle:** AABB test on falling gem vs paddle rectangle.

### Rendering Approach
- Canvas 600×400
- Procedural drawing: rounded rects for bricks (54×18px, 2px gaps, 3px border-radius), rounded rect for paddle (80×12px), circle for ball (7px radius) with glow via shadow
- Particle system: array of particles `{x, y, dx, dy, size, color, life, maxLife, gravity}`, updated per frame, drawn as small filled circles/rects
- Ball trail: ring buffer of last 3 positions, drawn at decreasing opacity
- HUD: score top-left, level top-center, lives bottom-left as ball icons, combo display center-right when active

## Scope for Arcade Platform

### Include in v1
- 5 explicit levels with designed layouts (standard, indestructible, multi-hit bricks)
- Combo system (consecutive hits without paddle touch = multiplier up to 3.0×)
- 3 power-up types (wide paddle, multi-ball, slow)
- 7 zzfx sound effects (brick hit with row-based pitch, paddle hit, ball lost, row clear, combo heat, victory cascade, gem pickup)
- Crystal shatter particles, light beams on row clear, prismatic explosion on level clear
- Level transitions with brick materialize animation
- 3 lives, high score via localStorage
- Ball trail effect starting level 4
- Hard mode loop (level 5 → level 1 with +1.0px/frame)

### Skip for v1
- Online leaderboards
- Custom level editor
- Additional power-up types beyond the 3 specified
- Boss encounters
- Music/ambient audio beyond zzfx effects

### Estimated Complexity
**L (Large)** — 5 level layouts, 3 power-up types, multi-hit + indestructible brick types, combo system, ball trail, extensive particle effects, level transitions. More complex than Pong Volt Rally, comparable to Snake Neon Serpent but with more entity types (bricks, power-ups, multi-ball).

## References
- Original Breakout (Atari, 1976) — paddle angle physics, speed escalation design
- Arkanoid (Taito, 1986) — power-ups, multi-hit bricks, level design patterns
- Creative direction: `departments/creative/artifacts/breakout-creative-direction.md`
- Stage scripts: `departments/creative/scripts/breakout-prism-shatter-stages.md`
