# Pitch: Breakout — Prism Shatter

## Elevator Pitch
Shatter a crystal wall with a ball of light — classic Breakout reimagined as a prismatic spectacle with 5 designed levels, combo multipliers, 3 power-up types, and a confetti explosion that makes every clear feel like cracking open a treasure vault.

## Gameplay

### Core Loop
1. Launch ball from paddle (spacebar/click)
2. Move paddle (arrow keys/mouse) to keep ball in play
3. Ball shatters crystal bricks on contact — each brick erupts in colored gem fragments
4. Chain consecutive hits without paddle touches to build combo multiplier (up to 3.0×)
5. Collect falling power-up gems (wide paddle, multi-ball, slow) to gain tactical advantages
6. Clear all destructible bricks to advance to the next level
7. 5 levels of escalating complexity: standard grid → indestructible deflectors → multi-hit bricks → zigzag labyrinth → fortress vault

### What Makes It Replayable
- **Combo mastery:** Skilled players aim for bank shots through tight gaps to maintain combo streaks — the difference between 1000pts and 3000pts on the same level
- **5 distinct level layouts** with indestructible and multi-hit bricks that demand different strategies
- **Power-up RNG:** 10% drop chance per brick means each run plays differently — multi-ball can trivialize a hard level or create chaos
- **Hard mode loop:** Clearing level 5 restarts at level 1 with +1.0px/frame speed — endless escalation for score chasers
- **High score persistence** via localStorage

## Technical Fit

### Canvas Complexity: Medium-High
- 600×400 canvas, procedural rendering (no sprites)
- Particle system: crystal shatter (6 particles per brick), prismatic explosion (50 particles on clear), power-up gems, light beams
- Ball trail effect (3 afterimages) starting level 4
- AABB collision detection for ball-brick, ball-paddle, power-up-paddle
- 5 level layout arrays with 3 brick types (standard, multi-hit, indestructible)

### Estimated Lines of Code: ~500-600
- Game state + constants: ~50
- Input handling (keys + mouse): ~30
- Game loop (update + render): ~150
- Collision detection (ball-brick, ball-paddle, walls): ~80
- Particle system + effects: ~80
- Level layouts + transitions: ~60
- Power-up system: ~50
- Sound (7 zzfx calls): ~30
- HUD + game over + restart: ~50

### Dependencies on Platform Features
- LittleJS engine (particle system, zzfx sound, game loop)
- Platform shared modules (platform-ui.js for game-over overlay)
- localStorage for high score
- Canvas 2D context

## Visual Identity
Deep purple-black void (`#0d0015`) with 5-color crystal palette: magenta (`#e040fb`), purple (`#7c4dff`), blue (`#448aff`), green (`#00e676`), yellow (`#ffea00`). Ball glows white normally, transitions to yellow at combo 3+, orange at combo 6+. Paddle is a silver mirror (`#c0c0c0`). Every brick hit sprays crystal fragments. Row clears fire vertical light beams. Level clears trigger a 50-particle prismatic confetti explosion.

## Sound Design
7 zzfx effects — crystalline/glass style:
1. `glass_clink` — brick hit (1800Hz sine, pitch varies by row: 2200Hz top → 1400Hz bottom)
2. `mirror_ping` — paddle hit (880Hz triangle, 80ms)
3. `drop_womp` — ball lost (400→100Hz descending sine, 300ms)
4. `chime_cascade` — row cleared (5-note descending arpeggio, 400ms)
5. `heat_sizzle` — combo 3+ (white noise burst, 120ms)
6. `victory_cascade` — all bricks cleared (C5-E5-G5-C6 ascending arpeggio, 800ms)
7. `gem_pickup` — power-up collected (660→990Hz two-tone, 150ms)

## Scope
### Include
- 5 level layouts (standard → pillars → fortress → labyrinth → vault)
- 3 brick types (standard, multi-hit with crack overlay, indestructible)
- Combo system (consecutive hits = multiplier up to 3.0×)
- 3 power-ups (wide paddle 15s, multi-ball ×3, slow ×0.6 10s)
- 7 zzfx sounds, crystal shatter particles, prismatic clear explosion
- 3 lives, high score, ball trail from level 4
- Hard mode loop after level 5

### Exclude
- Online leaderboards, level editor, boss encounters, ambient music

## Mockup
```
╔══════════════════════════════════════════╗
║  SCORE: 2450    LEVEL 3    COMBO ×2.25  ║
║                                          ║
║  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██  magenta ║
║  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██  purple  ║
║  ██ ██ ░░ ██ ██ ██ ██ ░░ ██ ██  blue    ║
║  ██ ██ ██ ██ ░░ ░░ ██ ██ ██ ██  green   ║
║  ▒▒ ██    ██ ██ ██ ██    ██ ▒▒  yellow  ║
║  ▒▒ ██ ██ ██ ██ ██ ██ ██ ██ ▒▒         ║
║            * * *                         ║
║             (o)  ← ball with trail       ║
║                                          ║
║                                          ║
║          ◇ ← power-up gem falling        ║
║                                          ║
║         ╔══════════╗ ← paddle            ║
║  ● ● ●                    LIVES          ║
╚══════════════════════════════════════════╝

░░ = indestructible brick (gray)
▒▒ = multi-hit brick (cracked)
██ = standard brick (colored by row)
◇  = falling power-up gem
```

## Risk Assessment
- **Complexity:** L — most complex build after Pac-Man due to 5 level layouts, 3 power-up types, multi-ball physics, and extensive particle effects
- **Mitigation:** Research is thorough, creative direction fully specified with exact values. Pong Volt Rally established the LittleJS build pattern. Follow spec mechanically.
