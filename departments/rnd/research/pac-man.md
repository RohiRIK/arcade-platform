# Research: Pac-Man

## Original Game Analysis
- **Developer/Publisher**: Namco (designed by Toru Iwatani), 1980
- **Platform**: Arcade cabinet, later ported to nearly every platform
- **Cultural Impact**: One of the most iconic video games ever made. First game to target a broad audience beyond the shoot-em-up crowd. Introduced character-driven gameplay to arcades.

### Core Mechanics (What Makes It Fun)
1. **Maze Navigation**: Player navigates Pac-Man through a fixed maze eating dots (pellets). Simple to understand, hard to master.
2. **Ghost AI (the heart of the game)**: Four ghosts, each with distinct personality/behavior:
   - **Blinky (Red)**: Chaser — directly targets Pac-Man's current tile. Speeds up as dots are eaten ("Cruise Elroy" mode).
   - **Pinky (Pink)**: Ambusher — targets 4 tiles ahead of Pac-Man's facing direction.
   - **Inky (Cyan)**: Fickle — uses a complex vector: doubles the vector from Blinky to 2 tiles ahead of Pac-Man. Creates unpredictable flanking.
   - **Clyde (Orange)**: Random/Shy — targets Pac-Man when far away (>8 tiles), retreats to home corner when close.
3. **Scatter/Chase Cycles**: Ghosts alternate between chasing Pac-Man and retreating to their home corners on a timer. This creates breathing room and patterns.
   - Level 1: 7s scatter, 20s chase, 7s scatter, 20s chase, 5s scatter, 20s chase, 5s scatter, then permanent chase.
4. **Power Pellets**: 4 large dots in corners. Eating one makes ghosts vulnerable (blue/frightened) for a limited time. Pac-Man can eat frightened ghosts for escalating points (200, 400, 800, 1600).
5. **Fruit Bonus**: Bonus item appears twice per level near the ghost house. Cherry (100), Strawberry (300), Orange (500), Apple (700), Melon (1000), etc.

### Control Scheme
- 4-directional joystick (up/down/left/right)
- No action button — movement only
- "Cornering": Pac-Man can pre-input a turn before reaching an intersection. The game buffers the input. This is critical to the feel.

### Difficulty Curve
- Ghost speed increases per level
- Frightened time decreases (down to 0 by level 19 — power pellets become useless)
- Blinky's "Cruise Elroy" speed threshold lowers each level
- Scatter phases shorten in later levels
- Level 256 is the famous "kill screen" (buffer overflow creates garbled right half)

### Scoring System
- Dot: 10 points (240 dots per maze)
- Power Pellet: 50 points (4 per maze)
- Ghosts (while frightened): 200, 400, 800, 1600 (resets each power pellet)
- Fruit: 100–5000 depending on level
- Extra life at 10,000 points
- Perfect game (no deaths, eat everything): 3,333,360

## Technical Approach

### Data Structures
- **Maze**: 2D grid (28 columns × 31 rows in original). Each cell is: wall, dot, power-pellet, empty, ghost-house-door, tunnel.
- **Entity State**: `{ x, y, direction, nextDirection, speed, mode }` for Pac-Man and each ghost.
- **Tile vs Pixel Position**: Entities move in pixel space but AI decisions happen in tile space. Need conversion functions.
- **Ghost State Machine**: Each ghost has modes: SCATTER, CHASE, FRIGHTENED, EATEN (eyes returning to house), IN_HOUSE (waiting to exit).

### Game Loop Design
1. Handle input (buffer next direction)
2. Move Pac-Man (check wall collision, apply cornering)
3. Check dot/pellet/fruit collection
4. Update ghost mode timers (scatter↔chase cycle)
5. Move each ghost (AI targeting per personality)
6. Check Pac-Man↔ghost collision
7. Render maze, dots, entities, score, lives, fruit

### Collision Detection
- Tile-based: Pac-Man and ghost occupy the same tile = collision
- Wall collision: check if the target tile in the desired direction is a wall before moving
- Tunnel: wrapping at left/right edges (entities slow down in tunnel)

### Rendering Approach
- Draw maze walls once to an offscreen canvas, blit each frame
- Animate Pac-Man mouth (3 frames: closed, half-open, open — cycle based on movement)
- Ghost rendering: body shape + eyes direction + color per ghost / blue when frightened / flashing blue-white near end of frightened
- Eyes-only when eaten (returning to house)

## Scope for Arcade Platform

### v1 Include
- Classic maze layout (faithful to original 28×31 grid)
- All 4 ghosts with correct AI personalities
- Scatter/chase mode cycling
- Power pellets with frightened mode
- Fruit bonuses (at least cherry through melon)
- Score, lives (3), extra life at 10K
- Pac-Man death animation
- Ghost eaten → eyes return to house
- Increasing difficulty across levels
- Tunnel wrap-around
- Input buffering (cornering feel)

### v1 Skip
- Intermission cutscenes
- Kill screen at level 256 (just loop difficulty)
- Exact original speed tables (approximate is fine)
- Sound effects

### Estimated Complexity: **L (Large)**
This is the most complex game yet. Ghost AI with 4 distinct personalities, scatter/chase cycles, frightened mode, ghost house logic, and the maze rendering make this significantly more involved than Tetris or Space Invaders. Expect 400-600 lines of game code.
