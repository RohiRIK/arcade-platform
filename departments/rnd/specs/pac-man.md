# Spec: Pac-Man

## Overview
Implement `startPacMan(canvas)` following the research and pitch docs. 28×31 tile maze, 4 ghosts with distinct AI, scatter/chase cycles, power pellets, fruit bonus, cornering input buffer.

## Constants
```
COLS = 28
ROWS = 31
TILE = 14                    // 28×14 = 392px wide, 31×14 = 434 → scale to fit 600×400
TILE_W = 14                  // tile pixel width  (28*14 = 392, centered in 600)
TILE_H = 12                  // tile pixel height (31*12 = 372, fits in 400 with HUD)
FIELD_X = 104                // (600 - 392) / 2 = 104 left margin
FIELD_Y = 28                 // top margin (leave room for score/lives HUD)
BG_COLOR = '#000'
WALL_COLOR = '#2121de'       // classic blue maze walls
DOT_COLOR = '#ffb8ae'        // classic pellet color
PACMAN_COLOR = '#ffff00'     // yellow
GHOST_COLORS = { blinky: '#ff0000', pinky: '#ffb8ff', inky: '#00ffff', clyde: '#ffb852' }
FRIGHTENED_COLOR = '#2121de'
FRIGHTENED_FLASH = '#ffffff'
EYES_COLOR = '#ffffff'
PUPIL_COLOR = '#2121de'
FRUIT_COLOR = '#ff0000'

PAC_SPEED = 2                // pixels per frame
GHOST_SPEED = 1.8            // slightly slower than pac
GHOST_FRIGHT_SPEED = 1.0     // frightened ghosts are slow
GHOST_TUNNEL_SPEED = 1.0     // ghosts slow in tunnel
GHOST_EATEN_SPEED = 3.0      // eyes rush back to house

SCATTER_TIME = 7000          // 7s scatter phase (ms)
CHASE_TIME = 20000           // 20s chase phase (ms)
FRIGHT_TIME = 6000           // 6s frightened mode (ms)
FRIGHT_FLASH_TIME = 2000     // last 2s of fright = flashing

DOTS_TOTAL = 240             // regular dots per level
POWER_PELLETS_TOTAL = 4
EXTRA_LIFE_SCORE = 10000
STARTING_LIVES = 3

DOT_SCORE = 10
POWER_SCORE = 50
GHOST_SCORES = [200, 400, 800, 1600]  // escalating per power pellet
FRUIT_SCORE = 100            // cherry (v1 only)

// Speed tiers (v1 simplified: 3 tiers instead of 21 levels)
SPEED_TIERS = [
  { level: 1,  pacSpeed: 2.0, ghostSpeed: 1.8 },
  { level: 5,  pacSpeed: 2.2, ghostSpeed: 2.1 },
  { level: 10, pacSpeed: 2.4, ghostSpeed: 2.4 }
]
```

## Maze Layout
28×31 grid encoded as a 2D array of integers:
```
0 = empty (passable, no dot)
1 = wall
2 = dot
3 = power pellet
4 = ghost house interior (impassable to pac-man)
5 = ghost house door (ghosts can pass, pac-man cannot)
6 = tunnel (passable, wraps horizontally)
```

Use the classic Pac-Man maze layout. Hardcode as a constant `MAZE_TEMPLATE` — a 31-element array of 28-char strings, then parse to 2D int array at game start.

```
MAZE_TEMPLATE = [
  "1111111111111111111111111111",  // row 0
  "1222222222222112222222222221",  // row 1
  "1211112111112112111121111121",  // row 2
  "1311112111112112111121111131",  // row 3  (power pellets at col 1,26)
  "1211112111112112111121111121",  // row 4
  "1222222222222222222222222221",  // row 5
  "1211112112111111112112111121",  // row 6
  "1211112112111111112112111121",  // row 7
  "1222222112222112222112222221",  // row 8
  "1111112111110110111121111111",  // row 9
  "0000012111110110111121000000",  // row 10
  "0000012110000000001121000000",  // row 11
  "0000012110111551110121000000",  // row 12 (ghost house door)
  "6000012000144444410021000006",  // row 13 (tunnel + ghost house)
  "0000012110144444410121000000",  // row 14
  "0000012110111111110121000000",  // row 15
  "0000012110000000001121000000",  // row 16
  "1111112110111111112121111111",  // row 17
  "1222222222222112222222222221",  // row 18
  "1211112111112112111121111121",  // row 19
  "1311112111112112111121111131",  // row 20 (power pellets)
  "1222112222222002222222112221",  // row 21
  "1112112112111111112112112111",  // row 22
  "1112112112111111112112112111",  // row 23
  "1222222112222112222112222221",  // row 24
  "1211111111112112111111111121",  // row 25
  "1211111111112112111111111121",  // row 26
  "1222222222222222222222222221",  // row 27
  "1111111111111111111111111111",  // row 28
  "0000000000000000000000000000",  // row 29 (padding)
  "0000000000000000000000000000"   // row 30 (padding)
]
```

At init, parse to `maze[row][col]` int array. Track `dotsRemaining` count.

## Data Structures

### Entity
```
entity = {
  x, y,           // pixel position (center of entity)
  tileX, tileY,   // current tile coords (derived)
  dir,            // current direction: 'up'|'down'|'left'|'right'|null
  nextDir,        // buffered input direction (for cornering)
  speed,          // pixels per frame
  frame           // animation frame counter
}
```

### Ghost
```
ghost = {
  ...entity,
  name,           // 'blinky'|'pinky'|'inky'|'clyde'
  color,          // from GHOST_COLORS
  mode,           // 'scatter'|'chase'|'frightened'|'eaten'
  scatterTarget,  // fixed corner tile for scatter mode
  homeTarget,     // tile above ghost house door (for eaten return)
  active          // whether ghost has exited house
}
```

### Game State
```
state = {
  pacman: entity,
  ghosts: [blinky, pinky, inky, clyde],
  maze: 2D int array (mutated as dots are eaten → set to 0),
  score, lives, level,
  dotsRemaining,
  ghostsEatenThisPellet,  // 0-4, resets each power pellet
  modeTimer,              // ms remaining in current scatter/chase phase
  currentMode,            // 'scatter' or 'chase' (global for non-frightened ghosts)
  modePhase,              // which scatter/chase phase we're in (0-6)
  frightTimer,            // ms remaining in frightened mode (0 = not active)
  fruitActive, fruitTimer,
  paused, gameOver
}
```

## Tile/Pixel Conversion
```
tileToPixel(col, row) → { x: FIELD_X + col * TILE_W + TILE_W/2, y: FIELD_Y + row * TILE_H + TILE_H/2 }
pixelToTile(x, y) → { col: floor((x - FIELD_X) / TILE_W), row: floor((y - FIELD_Y) / TILE_H) }
```

Entity `tileX`/`tileY` updated every frame from pixel position.

## Game Loop (60fps via requestAnimationFrame)

```
function gameLoop(timestamp):
  dt = timestamp - lastTime
  lastTime = timestamp

  if paused or gameOver: draw(); return

  handleInput()        // buffer nextDir
  movePacMan(dt)
  checkDotCollection()
  checkFruitCollection()
  updateModeTimers(dt)
  moveGhosts(dt)
  checkGhostCollisions()
  draw()

  requestAnimationFrame(gameLoop)
```

## Movement & Cornering

### Pac-Man Movement
```
function movePacMan():
  // Try nextDir first (buffered input)
  if nextDir != null:
    nextTile = tileInDirection(pacman.tileX, pacman.tileY, nextDir)
    if not isWall(nextTile) and not isGhostHouse(nextTile):
      // Snap to tile center on axis perpendicular to new direction, then move
      if atTileCenterish(pacman, threshold=2):
        pacman.dir = nextDir
        pacman.nextDir = null

  // Move in current direction
  if pacman.dir != null:
    nextTile = tileInDirection(pacman.tileX, pacman.tileY, pacman.dir)
    if isWall(nextTile) or isGhostHouse(nextTile):
      // Stop at tile center
      snapToTileCenter(pacman)
    else:
      advancePixels(pacman, pacman.speed)

  // Tunnel wrap
  if pacman.x < FIELD_X: pacman.x = FIELD_X + COLS * TILE_W
  if pacman.x > FIELD_X + COLS * TILE_W: pacman.x = FIELD_X

  updateTileCoords(pacman)
```

### `atTileCenterish(entity, threshold)`
Check if entity pixel position is within `threshold` pixels of current tile center. Used for cornering — allow direction change only near tile centers.

### Ghost Movement
Ghosts always move forward, choosing direction at each intersection:
```
function moveGhost(ghost):
  if ghost is at tile center (within 1px):
    targetTile = getGhostTarget(ghost)
    // Choose direction that minimizes distance to target
    // Ghosts cannot reverse direction (except when mode changes)
    candidates = [up, left, down, right]  // priority order for ties
    remove opposite of ghost.dir
    remove directions where next tile is wall
    ghost.dir = candidate with minimum euclideanDistance(nextTile, targetTile)

  advancePixels(ghost, ghost.speed)

  // Tunnel wrap (same as pacman)
  // Tunnel speed reduction
  if isTunnel(ghost.tileX, ghost.tileY): ghost.speed = GHOST_TUNNEL_SPEED
  else: restore normal speed for mode
```

## Ghost AI Targeting (v1)

### Blinky (Chase)
Target = Pac-Man's current tile.

### Pinky (Chase)
Target = 4 tiles ahead of Pac-Man in Pac-Man's facing direction.

### Inky (Chase) — Simplified for v1
Target = midpoint between Blinky's position and 2 tiles ahead of Pac-Man.
```
inkyTarget.x = (blinky.tileX + pacAhead2.x) / 2  // integer division is fine
inkyTarget.y = (blinky.tileY + pacAhead2.y) / 2
```

### Clyde (Chase)
If distance to Pac-Man > 8 tiles: target = Pac-Man's tile (chase).
If distance ≤ 8 tiles: target = scatter corner (retreat).

### Scatter Targets (all ghosts)
```
blinky.scatterTarget = { col: 25, row: 0 }   // top-right
pinky.scatterTarget  = { col: 2,  row: 0 }   // top-left
inky.scatterTarget   = { col: 27, row: 30 }  // bottom-right
clyde.scatterTarget  = { col: 0,  row: 30 }  // bottom-left
```

### Frightened Mode
Random valid direction at each intersection (still no reversals except at mode switch).

### Eaten Mode (Eyes)
Target = tile above ghost house door. On arrival, enter house, reset to normal mode, re-exit.

## Mode Timer System
```
MODE_SEQUENCE = [
  { mode: 'scatter', duration: 7000 },
  { mode: 'chase',   duration: 20000 },
  { mode: 'scatter', duration: 7000 },
  { mode: 'chase',   duration: 20000 },
  { mode: 'scatter', duration: 5000 },
  { mode: 'chase',   duration: 20000 },
  { mode: 'scatter', duration: 5000 },
  { mode: 'chase',   duration: Infinity }  // permanent chase
]

function updateModeTimers(dt):
  if frightTimer > 0:
    frightTimer -= dt
    if frightTimer <= 0:
      // End frightened: restore all ghosts to currentMode
      for ghost in ghosts: if ghost.mode == 'frightened': ghost.mode = currentMode
    return  // freeze scatter/chase timer during fright

  modeTimer -= dt
  if modeTimer <= 0:
    advance modePhase
    currentMode = MODE_SEQUENCE[modePhase].mode
    modeTimer = MODE_SEQUENCE[modePhase].duration
    // Force all non-eaten ghosts to reverse direction
    for ghost in ghosts:
      if ghost.mode != 'eaten': ghost.dir = oppositeDir(ghost.dir)
      ghost.mode = currentMode
```

## Dot & Pellet Collection
```
function checkDotCollection():
  tile = maze[pacman.tileY][pacman.tileX]
  if tile == 2:  // dot
    maze[pacman.tileY][pacman.tileX] = 0
    score += DOT_SCORE
    dotsRemaining--
  if tile == 3:  // power pellet
    maze[pacman.tileY][pacman.tileX] = 0
    score += POWER_SCORE
    dotsRemaining--
    ghostsEatenThisPellet = 0
    frightTimer = FRIGHT_TIME
    for ghost in ghosts:
      if ghost.mode != 'eaten':
        ghost.mode = 'frightened'
        ghost.dir = oppositeDir(ghost.dir)  // reverse on fright

  if dotsRemaining == 0: nextLevel()

  // Fruit spawn: when dotsRemaining == 170 or 70
  if (dotsRemaining == 170 or dotsRemaining == 70) and not fruitActive:
    fruitActive = true
    fruitTimer = 10000  // 10s visible
```

## Ghost-Pac-Man Collision
```
function checkGhostCollisions():
  for ghost in ghosts:
    if ghost.tileX == pacman.tileX and ghost.tileY == pacman.tileY:
      if ghost.mode == 'frightened':
        // Eat ghost
        score += GHOST_SCORES[ghostsEatenThisPellet]
        ghostsEatenThisPellet = min(ghostsEatenThisPellet + 1, 3)
        ghost.mode = 'eaten'
        ghost.speed = GHOST_EATEN_SPEED
      elif ghost.mode == 'eaten':
        pass  // eyes don't kill
      else:
        // Pac-Man dies
        lives--
        if lives <= 0: gameOver = true
        else: resetPositions()  // keep maze state, reset entity positions

  // Extra life
  if score >= EXTRA_LIFE_SCORE and not extraLifeAwarded:
    lives++
    extraLifeAwarded = true
```

## Level Progression
```
function nextLevel():
  level++
  resetMaze()         // restore all dots
  resetPositions()    // reset entity positions
  // Apply speed tier
  tier = SPEED_TIERS.findLast(t => level >= t.level)
  PAC_SPEED = tier.pacSpeed
  GHOST_SPEED = tier.ghostSpeed
```

## Rendering

### Draw Order
1. Black background fill
2. Maze walls (iterate grid, draw wall segments)
3. Dots and power pellets (power pellets blink: toggle visibility every 200ms)
4. Fruit (if active, at tile 14,17 — center below ghost house)
5. Ghosts (body + eyes)
6. Pac-Man (circle with animated mouth wedge)
7. HUD: score top-left, lives (pac icons) bottom-left, level bottom-right

### Wall Rendering
For each wall tile, check neighbors to draw connected wall segments:
```
for each tile where maze value == 1:
  draw rounded rect or line segments connecting to adjacent walls
  color: WALL_COLOR
```
Simplified approach: draw each wall tile as a filled rect with 1px gaps for the "corridor" feel. Use WALL_COLOR with slightly lighter border for depth.

### Pac-Man Rendering
```
draw arc with mouth:
  mouthAngle = 0.2 * PI * sin(frame * 0.3)  // oscillate open/close
  startAngle = direction_angle + mouthAngle
  endAngle = direction_angle - mouthAngle + 2*PI
  ctx.arc(x, y, radius, startAngle, endAngle)
  fill PACMAN_COLOR
```

Direction angles: right=0, down=PI/2, left=PI, up=3*PI/2

### Ghost Rendering
```
draw ghost body:
  // Semicircle top
  ctx.arc(x, y - 2, radius, PI, 0)
  // Rectangle body
  ctx.rect(x - radius, y - 2, radius*2, radius)
  // Wavy bottom (3 bumps)
  3 small arcs along bottom edge
  fill with ghost.color (or FRIGHTENED_COLOR/FRIGHTENED_FLASH)

draw eyes:
  // White circles for eye whites
  // Small colored circles for pupils, offset toward ghost.dir
  if ghost.mode == 'eaten': draw eyes only (no body)
  if ghost.mode == 'frightened': draw simple white eyes + squiggle mouth
```

### HUD
```
Top line: "SCORE: {score}" left-aligned, "HIGH: {highScore}" right-aligned
Bottom line: Pac-Man icons × lives (left), "LV {level}" (right)
Font: '14px monospace', color: '#fff'
```

## Input Handling
```
keydown handler:
  ArrowUp    → pacman.nextDir = 'up'
  ArrowDown  → pacman.nextDir = 'down'
  ArrowLeft  → pacman.nextDir = 'left'
  ArrowRight → pacman.nextDir = 'right'

// No keyup tracking needed — Pac-Man keeps moving in current dir until wall
```

## Init & Reset
```
function startPacMan(canvas):
  ctx = canvas.getContext('2d')
  canvas.width = 600
  canvas.height = 400

  parseMaze()           // MAZE_TEMPLATE → maze[][]
  countDots()           // set dotsRemaining
  initPacMan()          // position at tile (14, 23), dir='left'
  initGhosts()          // blinky at (14,11), pinky at (12,14), inky at (14,14), clyde at (16,14)
  score = 0; lives = 3; level = 1; gameOver = false
  modePhase = 0; currentMode = 'scatter'; modeTimer = SCATTER_TIME
  frightTimer = 0; ghostsEatenThisPellet = 0
  extraLifeAwarded = false
  highScore = parseInt(localStorage.getItem('pacmanHigh') || '0')

  document.addEventListener('keydown', handleKeyDown)
  lastTime = performance.now()
  requestAnimationFrame(gameLoop)

  // cleanup function
  return function cleanup():
    document.removeEventListener('keydown', handleKeyDown)
    cancelAnimationFrame(rafId)
```

## Game Over / Restart
```
if gameOver:
  draw "GAME OVER" centered on canvas
  draw "Press ENTER to restart"
  if score > highScore: localStorage.setItem('pacmanHigh', score)
  on Enter key: re-init everything
```

## Edge Cases
- Tunnel wrap: entities crossing col 0 or col 27 on tunnel rows teleport to opposite side
- Ghost house: pac-man cannot enter (tiles 4 and 5 are walls for pac-man)
- Eaten ghost re-entering house: when eyes reach home tile, teleport inside, wait briefly, re-exit as normal ghost
- Mode switch reversal: all active ghosts reverse direction when scatter↔chase switches
- Frightened mode freezes scatter/chase timer
- Power pellet during existing fright: reset fright timer, but ghostsEatenThisPellet resets to 0
- Multiple ghosts on same tile: each collision checked independently

## Acceptance Criteria
- [ ] Game loads in browser without JS errors
- [ ] Canvas renders at 600×400
- [ ] Arrow key controls respond with cornering feel
- [ ] Maze renders with walls, dots, power pellets visible
- [ ] All 4 ghosts move with distinct AI behaviors
- [ ] Scatter/chase mode cycling works (observe ghosts retreating to corners)
- [ ] Power pellets turn ghosts blue/frightened
- [ ] Eating frightened ghosts scores 200/400/800/1600
- [ ] Eaten ghosts return as eyes to ghost house
- [ ] Score displays and increments correctly
- [ ] Lives decrement on ghost collision, game over at 0
- [ ] Eating all dots advances to next level
- [ ] Fruit appears and is collectible
- [ ] Restart works without page reload
- [ ] No hardcoded localhost in any URL
- [ ] Works from LAN IP (not just localhost)

## meta.json
```json
{
  "name": "Pac-Man",
  "description": "Navigate the maze, eat all dots, and outsmart four ghosts with unique personalities.",
  "version": "1.0.0",
  "category": "classic",
  "color": "#ffff00"
}
```
