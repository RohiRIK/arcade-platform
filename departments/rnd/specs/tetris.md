# Spec: Tetris

## Overview
Implement `startTetris(canvas)` following the research and pitch docs. 10×20 playfield, 7 tetrominoes, NES-style scoring, ghost piece, next piece preview.

## Constants
```
COLS = 10
ROWS = 20
CELL_SIZE = 18          // 10×18 = 180px wide playfield, 20×18 = 360px tall
FIELD_X = 40            // left margin for playfield on 600×400 canvas
FIELD_Y = 15            // top margin
PREVIEW_X = 320         // next piece box position
PREVIEW_Y = 60
HUD_X = 320             // score/level/lines text X
GRID_COLOR = '#1a1a2e'  // faint grid lines
BG_COLOR = '#000'
LOCK_DELAY = 500        // ms before piece locks after landing
INITIAL_DROP_INTERVAL = 800  // ms at level 0
```

## Tetromino Definitions
Each piece is an array of 4 rotation states. Each rotation state is an array of 4 `[row, col]` offsets relative to a pivot.

```
PIECES = {
  I: { color: '#00f0f0', rotations: [
    [[0,0],[0,1],[0,2],[0,3]],
    [[0,0],[1,0],[2,0],[3,0]],
    [[0,0],[0,1],[0,2],[0,3]],
    [[0,0],[1,0],[2,0],[3,0]]
  ]},
  O: { color: '#f0f000', rotations: [
    [[0,0],[0,1],[1,0],[1,1]],  // all 4 states identical
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]]
  ]},
  T: { color: '#a000f0', rotations: [
    [[0,0],[0,1],[0,2],[1,1]],
    [[0,0],[1,0],[2,0],[1,1]],
    [[1,0],[1,1],[1,2],[0,1]],
    [[0,0],[1,0],[2,0],[1,-1]]
  ]},
  S: { color: '#00f000', rotations: [
    [[0,1],[0,2],[1,0],[1,1]],
    [[0,0],[1,0],[1,1],[2,1]],
    [[0,1],[0,2],[1,0],[1,1]],
    [[0,0],[1,0],[1,1],[2,1]]
  ]},
  Z: { color: '#f00000', rotations: [
    [[0,0],[0,1],[1,1],[1,2]],
    [[0,1],[1,0],[1,1],[2,0]],
    [[0,0],[0,1],[1,1],[1,2]],
    [[0,1],[1,0],[1,1],[2,0]]
  ]},
  J: { color: '#0000f0', rotations: [
    [[0,0],[1,0],[1,1],[1,2]],
    [[0,0],[0,1],[1,0],[2,0]],
    [[0,0],[0,1],[0,2],[1,2]],
    [[0,0],[1,0],[2,0],[2,-1]]
  ]},
  L: { color: '#f0a000', rotations: [
    [[0,2],[1,0],[1,1],[1,2]],
    [[0,0],[1,0],[2,0],[2,1]],
    [[0,0],[0,1],[0,2],[1,0]],
    [[0,0],[0,1],[1,1],[2,1]]
  ]}
}
```

Note: The T/J/L/S/Z rotations above are simplified (no wall kicks). If a rotation puts cells out of bounds or into filled cells, the rotation is rejected.

## Data Structures

### Playfield
```
field = Array(ROWS).fill(null).map(() => Array(COLS).fill(0))
// 0 = empty, string = color of locked cell
```

### Current Piece State
```
current = { type: 'T', rotation: 0, row: 0, col: 3 }
```

### Game State
```
score = 0
level = 0
linesCleared = 0
gameOver = false
nextPiece = null   // type string
bag = []           // remaining pieces in current 7-bag
dropInterval = INITIAL_DROP_INTERVAL
lastDropTime = 0
lockTimer = null   // setTimeout ID for lock delay
isLanded = false
```

## 7-Bag Randomizer
```
function nextFromBag():
  if bag is empty:
    bag = shuffle(['I','O','T','S','Z','J','L'])
  return bag.pop()
```

## Core Functions

### `getCells(type, rotation, row, col) → [[r,c], ...]`
Returns the 4 absolute cell positions for a piece.
```
for each [dr, dc] in PIECES[type].rotations[rotation]:
  yield [row + dr, col + dc]
```

### `isValid(type, rotation, row, col) → bool`
```
for each [r, c] in getCells(type, rotation, row, col):
  if r < 0 or r >= ROWS or c < 0 or c >= COLS: return false
  if field[r][c] !== 0: return false
return true
```

### `lockPiece()`
```
for each [r, c] in getCells(current.type, current.rotation, current.row, current.col):
  field[r][c] = PIECES[current.type].color
clearLines()
spawnPiece()
```

### `clearLines()`
```
completedRows = []
for r = 0 to ROWS-1:
  if every cell in field[r] is non-zero:
    completedRows.push(r)

count = completedRows.length
if count > 0:
  // scoring
  multipliers = [0, 40, 100, 300, 1200]
  score += multipliers[count] * (level + 1)
  linesCleared += count
  level = Math.floor(linesCleared / 10)
  dropInterval = Math.max(100, INITIAL_DROP_INTERVAL - level * 70)

  // remove rows and shift down
  for each row in completedRows (descending):
    field.splice(row, 1)
    field.unshift(Array(COLS).fill(0))
```

### `spawnPiece()`
```
current.type = nextPiece
current.rotation = 0
current.row = 0
current.col = Math.floor((COLS - 2) / 2)  // roughly center
nextPiece = nextFromBag()

if not isValid(current.type, current.rotation, current.row, current.col):
  gameOver = true
```

### `ghostRow() → int`
```
r = current.row
while isValid(current.type, current.rotation, r + 1, current.col):
  r++
return r
```

### `hardDrop()`
```
while isValid(current.type, current.rotation, current.row + 1, current.col):
  current.row++
  score += 1   // soft-drop scoring for hard drop distance
lockPiece()
```

### `softDrop()`
```
if isValid(current.type, current.rotation, current.row + 1, current.col):
  current.row++
  score += 1
```

## Input Handling
```
keydown handler:
  if gameOver: return
  ArrowLeft:  try move col - 1, reset lock timer if landed
  ArrowRight: try move col + 1, reset lock timer if landed
  ArrowUp:    try rotate (rotation + 1) % 4, reset lock timer if landed
  ArrowDown:  softDrop()
  Space:      hardDrop()
```

Reset lock timer = if piece is currently in lock delay, restart the 500ms timer (gives player time to slide piece).

## Gravity Tick (main loop via requestAnimationFrame)
```
function gameLoop(timestamp):
  if gameOver: draw game over screen; return
  if timestamp - lastDropTime > dropInterval:
    if isValid(current.type, current.rotation, current.row + 1, current.col):
      current.row++
      isLanded = false
      clearLockTimer()
    else:
      if not isLanded:
        isLanded = true
        startLockTimer()  // 500ms then lockPiece()
    lastDropTime = timestamp
  draw()
  requestAnimationFrame(gameLoop)
```

## Rendering (`draw()`)

### Background
Fill canvas black.

### Playfield Border
Draw a 1px `#333` rectangle around the playfield area.

### Grid
For each cell in field, if non-zero draw a filled square with `CELL_SIZE - 1` dimensions (1px gap for grid effect) using the stored color. Add a subtle lighter top-left edge for a bevel effect.

### Current Piece
Draw the 4 cells of the current piece using `PIECES[current.type].color`.

### Ghost Piece
Draw the 4 cells at `ghostRow()` with same color at 30% opacity.

### Next Piece Preview
Draw "NEXT" label at `PREVIEW_X, PREVIEW_Y - 20`. Draw the next piece in a small box using its color, centered in a 4×4 cell area.

### HUD
```
ctx.fillStyle = '#fff'
ctx.font = '14px monospace'
Draw "SCORE" label + score value at HUD_X, 160
Draw "LEVEL" label + level value at HUD_X, 220
Draw "LINES" label + linesCleared value at HUD_X, 280
```

### Controls Hint
Small text at bottom: `"← → Move  ↑ Rotate  ↓ Soft  Space Hard"`

### Game Over Overlay
Semi-transparent black overlay on playfield. White text "GAME OVER" centered. Show final score.

## Cleanup
```
cleanup():
  cancelAnimationFrame(animFrameId)
  clearTimeout(lockTimer)
  remove keydown listener
```

## Integration Points
- `meta.json`: `{ "name": "Tetris", "description": "Stack falling tetrominoes, clear lines, chase high scores.", "version": "1.0.0", "category": "classic", "color": "#a000f0" }`
- ICONS entry: tetris icon — a T-tetromino shape using the purple color
- `launchGame('tetris')` case calls `startTetris(canvas)`

## Edge Cases
- Piece spawns overlapping filled cells → game over immediately
- Rotation at right wall: if rotated piece goes out of bounds, reject rotation (no wall kicks in v1)
- Very fast levels: `dropInterval` floors at 100ms
- Hard drop on already-landed piece: locks immediately (no double-lock)
- Lock timer reset cap: could add max resets to prevent infinite stalling, but skip for v1
