# Pitch: Frogger

## Elevator Pitch
Frogger is a timeless navigation-under-pressure game where every hop is a life-or-death decision — dodge traffic, ride logs, and fill five home slots before time runs out.

## Gameplay
- **How does the player interact?** Arrow keys for discrete grid-based hops (up/down/left/right). No action button — movement IS the game.
- **What's the core loop?** Navigate frog from bottom to one of 5 home slots at top. Cross 5 lanes of traffic (avoid), then 5 lanes of river (ride logs/turtles). Place all 5 frogs → level complete → repeat faster.
- **What makes it replayable?** Progressive difficulty (faster traffic, fewer logs, diving turtles) creates a "one more try" loop. Time pressure + score chasing + the satisfying rhythm of weaving through lanes. Each level feels solvable but demands better routing.

## Technical Fit
- **Canvas complexity**: Low-Medium. Grid-based rendering (no rotation, no particles). Colored rectangles with simple sprite details.
- **Estimated lines of code**: ~400-500. Simpler than Pac-Man (no AI pathfinding), similar to Space Invaders (lane management vs. enemy grid).
- **Dependencies on platform features**: None. Standard canvas, keyboard input, game loop pattern already established by 6 shipped games.

## v1 Scope (from research)
**Include**: 5 road lanes (car/truck/bus), 5 river lanes (logs + diving turtles), median safe zone, 5 home slots, 60s timer, score/lives/level HUD, progressive speed increase, extra life at 10K.

**Skip**: Alligators, snakes, fly bonus, female frog escort, death animation (just reset). These are v2 polish — the core game is fun without them.

## Risk Assessment
- **Low risk**: Grid collision is simpler than pixel-based. We've shipped 6 games; this is well within our pattern.
- **Main challenge**: The "riding" mechanic (frog moves with log/turtle) needs to feel snappy, not floaty. Research notes: snap frog position to object each frame.

## Mockup
```
+--[HOME SLOTS]--[  ]--[  ]--[  ]--[  ]--[  ]--+
|~~ LOG ~~~>     ~~~ LOG ~~~>      ~~ LOG ~~>    | river
|    <~~~ TURTLE ~~~    <~~~ TURTLE ~~~          | river
|~~ LOG ~~>    ~~~ LOG ~~~>   ~~ LOG ~~>         | river
|    <~~~~~~ LOG ~~~~~~      <~~~ LOG ~~~        | river
|~~> TURTLE ~~>    TURTLE ~~>    TURTLE ~~>      | river
|############### MEDIAN / SAFE ##################| safe
|    <== CAR     <== CAR        <== CAR          | road
| TRUCK ==>        TRUCK ==>                    | road
|  <== CAR    <== CAR      <== CAR   <== CAR    | road
|    BUS ===>           BUS ===>                 | road
| <== CAR        <== CAR           <== CAR       | road
|_________________ START AREA ___________________| safe
|  SCORE: 0000   LIVES: 🐸🐸🐸   TIME: [======] | HUD
+-------------------------------------------------+
```
