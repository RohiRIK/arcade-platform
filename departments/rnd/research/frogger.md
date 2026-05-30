# Research: Frogger

## Original Game Analysis

### History
- **Developer**: Konami
- **Publisher**: Sega (North America)
- **Year**: 1981
- **Platform**: Arcade (dedicated cabinet), later ported to Atari 2600, ColecoVision, and many others
- **Designer**: Akira Hashimoto
- Frogger became one of the top-grossing arcade games of the early 1980s, earning over $135 million in its first year

### Core Mechanics (What Makes It Fun)
Frogger is a **navigation/timing game** — no shooting, no building. The entire challenge is spatial reasoning under time pressure.

1. **Two-zone structure**: The screen is split into two halves:
   - **Road zone** (bottom half): 5 lanes of traffic moving left/right at varying speeds. Touching any vehicle = death.
   - **River zone** (top half): 5 lanes of logs, turtles, and alligators moving left/right. The frog MUST ride these objects — falling in water = death.

2. **Discrete movement**: The frog moves in grid-aligned hops (one tile per keypress). This is NOT continuous movement — each press advances exactly one cell. This creates a deliberate, chess-like feel where every move matters.

3. **Safe zones**: A median strip (sidewalk) between road and river provides a rest area. The bottom row is the starting area. The top has 5 lily pad "home" slots.

4. **Goal**: Guide 5 frogs into 5 home slots at the top of the screen. Each frog placed = points. All 5 placed = level complete, repeat with increased difficulty.

5. **Hazards**:
   - Cars, trucks, buses (road) — instant death on contact
   - Water (river) — instant death if not on a log/turtle
   - Diving turtles — periodically submerge, taking the frog with them
   - Alligators — jaws at log ends can eat the frog
   - Snakes — appear on the median or on logs
   - Screen edges — riding a log off-screen = death

6. **Bonuses**:
   - Flies appear randomly on lily pads — extra points if you land on them
   - Female frog appears on a log — escort her home for bonus points
   - Time bonus — faster completion = more points

### Control Scheme
- **4-directional movement only**: Up, Down, Left, Right
- Each press = one grid hop
- No diagonal movement, no holding to move continuously
- No action button (no jump/shoot — movement IS the action)

### Difficulty Curve
- **Level 1**: Slow traffic, plenty of logs, generous time (60 seconds)
- **Progression**: Each level increases:
  - Vehicle speed
  - Fewer/shorter logs
  - More diving turtles
  - Alligators appear more often
  - Snakes on median/logs
  - Time stays at 60s but effective time shrinks due to longer routing
- **Key insight**: Difficulty is emergent from speed/density, not from new mechanics. The game never introduces new rules — just tighter windows.

### Scoring System
- Forward hop: 10 points
- Frog reaching home: 50 points
- Time bonus: 10 points per remaining half-second
- Fly eaten: 200 points
- Female frog escorted: 200 points
- All 5 homes filled: 1000 bonus points
- Extra life: every 10,000 points (configurable in original)

## Technical Approach

### Data Structures
- **Grid**: 13 rows × 15 columns (original resolution mapped to grid cells)
  - Row 0: Home slots (5 lily pads with gaps)
  - Rows 1-5: River lanes (logs, turtles, gators)
  - Row 6: Median / safe zone
  - Rows 7-11: Road lanes (cars, trucks)
  - Row 12: Starting area (safe)
- **Lane objects**: Array per lane, each entry = `{type, x, width, speed, direction}`
  - Logs: width 2-4 cells, move left or right
  - Turtles: groups of 2-3, have `diving` boolean + timer
  - Vehicles: width 1-2 cells, move left or right
- **Frog state**: `{gridX, gridY, alive, riding: laneObject|null}`
- **Home slots**: Array of 5: `{filled: boolean, hasFly: boolean}`
- **Game state**: `{lives, score, level, timeRemaining, frogsHome}`

### Game Loop Design
1. **Update phase**:
   - Move all lane objects by their speed × dt
   - Wrap objects at screen edges (respawn from opposite side)
   - Update turtle dive timers
   - If frog is on river: move frog with the object it's riding
   - Check if frog has been carried off-screen
   - Decrement timer
2. **Collision phase**:
   - Road: check frog position against vehicle positions → death
   - River: check if frog is on any log/turtle → if not, death (water)
   - Home: check if frog reached a home slot → score, reset frog
   - Alligator jaws: check if frog is on jaw end → death
3. **Render phase**:
   - Draw background (road=dark grey, river=blue, grass=green, median=purple)
   - Draw lane objects
   - Draw frog
   - Draw HUD (score, lives, time bar)

### Collision Detection
- Grid-based overlap: frog occupies one cell, objects occupy N cells
- Check: `frogGridX >= objectX && frogGridX < objectX + objectWidth`
- River riding: snap frog to the object's moving position each frame
- Simple and efficient — no pixel-perfect detection needed

### Rendering Approach
- Tile-based: divide 600×400 canvas into grid cells
  - Cell size: ~40×30 pixels (15 columns × 13 rows)
  - Or 600/14 ≈ 42px wide, 400/14 ≈ 28px tall
- Draw objects as colored rectangles with simple sprite details:
  - Frog: green circle with eyes
  - Cars: colored rectangles with wheels
  - Logs: brown rectangles with bark texture (lines)
  - Turtles: green ovals
  - Water: blue background
- Pixel-art style icons for frog, vehicles achievable with fillRect compositions

## Scope for Arcade Platform

### What to Include in v1
- Full 13-row playfield: 5 road lanes, median, 5 river lanes, start, home
- 5 home lily pad slots
- 3 vehicle types: car (1-cell), truck (2-cell), bus (2-cell fast)
- 2 river object types: logs (2-4 cells), turtles (2-3 cells, with diving)
- Discrete grid movement (authentic feel)
- 60-second timer with visual bar
- Score + lives + level display
- Progressive difficulty (speed increase per level)
- Time bonus scoring
- Extra life at 10,000 points

### What to Skip in v1
- Alligators in home slots (complex, not essential for fun)
- Snakes on median/logs
- Female frog escort bonus
- Fly bonus on lily pads (can add in v2)
- Sound effects
- Death animation (just reset position)

### Estimated Complexity
**Medium** — Simpler than Pac-Man (no pathfinding AI), more complex than Breakout (multiple lane types, riding mechanics, two-zone gameplay). The grid-based movement actually simplifies collision detection significantly. Main challenge is getting the "riding" mechanic to feel right and tuning lane speeds for fun difficulty.
