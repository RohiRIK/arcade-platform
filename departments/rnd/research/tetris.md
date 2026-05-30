# Research: Tetris

## Original Game Analysis
- **Creator**: Alexey Pajitnov, 1984, at the Soviet Academy of Sciences in Moscow
- **Platform**: Originally Electronika 60 (PDP-11 clone), then ported everywhere — Game Boy version (1989, Nintendo) became the cultural phenomenon
- **Core Mechanics**: Seven distinct tetrominoes (I, O, T, S, Z, J, L) fall from the top of a 10-wide × 20-tall playfield. The player can move pieces left/right, rotate them, and soft/hard drop them. Completed horizontal lines clear and award points. The game ends when pieces stack to the top.
- **What makes it fun**: The tension between spatial reasoning and time pressure. Every piece placement is a micro-decision with cascading consequences. The "almost cleared a Tetris" near-miss is deeply compelling. Flow state kicks in around level 5-7.
- **Control scheme**: Left/Right to move, Up/Z to rotate clockwise, X to rotate counter-clockwise, Down for soft drop, Space for hard drop, C/Shift for hold piece.
- **Difficulty curve**: Gravity increases with level. Classic NES Tetris uses a frame-based gravity table — level 0 is ~48 frames per drop, level 9 is ~6 frames, level 19+ is ~2 frames ("killscreen" territory). Modern versions (Guideline-era) use lock delay to keep high speeds playable.
- **Scoring system (NES-era)**:
  - Single line clear: 40 × (level + 1)
  - Double: 100 × (level + 1)
  - Triple: 300 × (level + 1)
  - Tetris (4 lines): 1200 × (level + 1)
  - Soft drop: 1 point per cell

## Technical Approach
- **Data structures**: 
  - Playfield: 2D array (10×20), each cell stores 0 (empty) or a color index
  - Tetrominoes: Each piece defined as a set of 4 cell offsets relative to a rotation center. Store all 4 rotation states per piece (use SRS or simple rotation).
  - Current piece state: { type, rotation, x, y }
  - Next piece queue (at least 1 preview piece)
- **Game loop design**: Timer-based gravity tick (setInterval or requestAnimationFrame with accumulator). Separate input handling from gravity. Lock delay: piece locks ~500ms after landing, reset on successful move/rotate.
- **Collision detection**: Before any move/rotation, check if the new position overlaps filled cells or goes out of bounds. Simple loop over the 4 cells of the piece.
- **Rendering approach**: Canvas-based. Draw grid lines faintly, filled cells as colored squares with slight border/bevel. Ghost piece (translucent projection of where piece will land) is a nice-to-have for v1.
- **Random piece generation**: 7-bag randomizer (shuffle all 7 pieces, deal them in order, repeat) prevents drought/flood of specific pieces.

## Scope for Arcade Platform

### Include in v1
- All 7 tetrominoes with 4 rotation states each
- 10×20 playfield
- Left/right movement, rotation (clockwise), soft drop, hard drop
- Line clearing with scoring (NES-style formula)
- Level progression (speed increase every 10 lines)
- Next piece preview
- Ghost piece (drop shadow)
- Game over detection
- Score, level, and lines cleared display

### Skip for v1
- Hold piece mechanic (add in v2)
- T-spin detection and bonus scoring
- Multiplayer / garbage lines
- Wall kicks (use simple rotation — if rotated position is blocked, rotation fails)
- Sound effects
- Animations on line clear (just flash and remove)

### Estimated Complexity: **Medium**
~200-250 lines of game code. Well-understood mechanics, no complex physics. Main challenge is getting rotation and collision detection feeling crisp.
