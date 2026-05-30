# Pac-Man — Creative Direction (Arcade Evolution)

**Author:** Creative Director
**Date:** 2026-05-30
**Phase:** 3 (Second Wave Migration)
**Status:** Concept + Prototype Spec

---

## Concept

Pac-Man becomes **"Phantom Maze"** — a haunted labyrinth where you're a wandering soul-light consuming spirit orbs in the dark. The maze is barely visible — only the area around the player is illuminated (fog of war). Ghosts are luminous phantoms with trailing wisps. Eating a power pellet turns you into a blazing beacon that terrifies the ghosts. The mood is eerie but playful — spooky ambient, satisfying munch sounds, and the joy of the chase reversal.

---

## Visual Identity

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#080810` | Near-black dungeon |
| Maze walls | `#1a237e` | Deep indigo, 2px glow when near player |
| Maze wall glow (player near) | `#3949ab` | Brightens within 3-tile radius of player |
| Player (Pac) | `#ffd600` | Bright gold soul-light, 6px glow radius |
| Dots | `#b0bec5` | Dim silver, 3px circles, subtle pulse (0.8–1.0 opacity, 2s cycle) |
| Power pellets | `#ffffff` | 8px circles, strong pulse (0.5–1.0, 800ms cycle), 4px glow |
| Ghost: Blinky | `#ff1744` | Red phantom, wispy trail |
| Ghost: Pinky | `#f48fb1` | Pink phantom |
| Ghost: Inky | `#00e5ff` | Cyan phantom |
| Ghost: Clyde | `#ff9100` | Orange phantom |
| Frightened ghosts | `#1565c0` | Deep blue, flickering outline, eyes become hollow |
| Eaten ghost (eyes) | `#ffffff` | Two white dots floating back to center |
| Score text | `#b0bec5` | 14px monospace |
| Fruit | `#ff1744` | Cherry/fruit icon, pulsing glow |

### Visual Effects (LittleJS particles)
| Event | Effect | Duration | Details |
|-------|--------|----------|---------|
| Dot eaten | Absorb | 150ms | Dot shrinks to 0 + 2 tiny particles (1px, silver) drift toward player |
| Power pellet eaten | Blaze activation | 400ms | Player glow radius expands 6→20px over 200ms, 8 white particles radial burst, all ghosts flash blue simultaneously |
| Ghost eaten | Spirit capture | 350ms | Ghost dissolves into 10 particles of ghost's color spiraling inward toward player position, score floats up (200/400/800/1600) in `#00e5ff` 18px |
| Player death | Soul shatter | 600ms | Player shrinks while spinning (2 rotations over 600ms), emits 12 gold particles outward, final flash |
| Fruit eaten | Sparkle grab | 250ms | 6 particles in `#ff1744`, starburst pattern |
| Power pellet ending | Flicker warning | 2000ms before end | Ghosts alternate blue/normal every 200ms for final 2s of frightened mode |
| Fog of war | Dynamic lighting | continuous | Radial gradient centered on player: full brightness at center, fades to 5% at 5-tile radius. During power pellet: radius expands to 8 tiles |

### Sprite Style
Procedural:
- Pac-Man: circle 20px diameter, animated mouth (45° open/close cycle, 200ms), direction-facing
- Ghosts: 20×22px — rounded top (semicircle) + wavy bottom edge (3 bumps), 2 white eye circles (4px) with colored pupils (2px) tracking player direction
- Frightened ghost: same shape but blue, zigzag mouth (4 segments), hollow eyes
- Dots: circles 3px radius
- Power pellets: circles 8px radius

---

## Sound Design

**Style:** Spooky-playful — minor key, reverb-heavy, retro

| Event | Sound | Duration | Description |
|-------|-------|----------|-------------|
| Dot eaten | `munch` | 40ms | Alternating two tones: 260Hz/300Hz, square wave, 40ms, sounds like "waka-waka" |
| Power pellet | `power_surge` | 300ms | Deep bass swell 60Hz→120Hz 150ms + high shimmer 2kHz triangle 150ms |
| Ghost eaten | `spirit_capture` | 200ms | Descending glissando 1000Hz→400Hz, sawtooth, 200ms, slight reverb |
| Player death | `soul_shatter` | 500ms | Descending spiral: 800Hz→100Hz with vibrato, 500ms, sine wave, heavy reverb |
| Fruit appear | `fruit_chime` | 120ms | Two-note: 880Hz→1100Hz, 60ms each, triangle wave |
| Siren (ghosts normal) | `siren_low` | looping | Sine wave oscillating 200Hz↔300Hz at 1Hz rate, volume 12% |
| Siren (ghosts frightened) | `siren_high` | looping | Sine wave oscillating 400Hz↔600Hz at 2Hz rate, volume 15%, replaces normal siren |
| Level complete | `maze_clear` | 600ms | Ascending major arpeggio G4-B4-D5-G5, 150ms each, sine + reverb |

All sounds via LittleJS `zzfx()`.

---

## Gameplay Enhancements

### Progression System
- **Levels:** Each level uses same maze layout but changes speed/behavior
- **Ghost speed:** Level 1: 75% of player speed. +5% per level, max 105% at level 7
- **Frightened duration:** Level 1: 8s, -1s per level, minimum 2s at level 7+
- **Fruit schedule:** Cherry(100) L1, Strawberry(300) L2, Orange(500) L3-4, Apple(700) L5-6, Melon(1000) L7+
- **Ghost AI:** Blinky chases directly, Pinky targets 4 tiles ahead, Inky mirrors Blinky offset, Clyde retreats when close (<8 tiles switches to scatter)

### Difficulty Curve
| Level | Ghost speed | Fright time | Dots | Feel |
|-------|-----------|------------|------|------|
| 1 | 75% | 8s | 240 | Learn maze, eat everything |
| 2 | 80% | 7s | 240 | Ghosts closing in |
| 3 | 85% | 6s | 240 | Route planning matters |
| 4 | 90% | 5s | 240 | Tight escapes |
| 5 | 95% | 4s | 240 | Expert navigation |
| 6 | 100% | 3s | 240 | Equal speed — pure strategy |
| 7+ | 105% | 2s | 240 | Ghosts faster — survival |

### "Wow" Moment
**The Ghost Train:** Eating all 4 ghosts during a single power pellet triggers the Ghost Train — all 4 sets of eyes stream back to the center box in a line, and the score cascade (200→400→800→1600 = 3000 total) stacks vertically where the last ghost was eaten, each number in the eaten ghost's color, with a final "×4 COMBO" text in `#ffd600` at 24px that pulses once. A unique deep bass chord plays (C2+G2, 400ms).

---

## Transitions
| Transition | Animation | Duration |
|-----------|-----------|----------|
| Game start | Maze walls draw in segment-by-segment (like a pen tracing), dots appear all at once, ghosts emerge from center box | 800ms |
| Level clear | All dots gone → maze walls flash 3× (swap `#1a237e`↔`#3949ab`, 200ms each) → brief black → new level | 1200ms |
| Player death | Pac-Man spin+shrink → ghost freeze 300ms → respawn | 900ms |
| Game over | Fog of war closes in (illumination radius shrinks to 0 over 800ms) → overlay in darkness | 1000ms |

---

## Assets Needed (for R&D)
All procedural:
- LittleJS for particles, fog-of-war lighting (radial gradient overlay)
- LittleJS `zzfx()` for all sounds including looping sirens
- Canvas 2D for Pac-Man, ghosts, maze, dots
- Maze data as tile array (28×31 standard layout)
- Ghost AI state machine (chase/scatter/frightened/eaten)
- localStorage for high score

---

## Quality Bar Checklist
- [x] Unique color palette: dark dungeon + gold player + 4 distinct ghost colors
- [x] 8 sound effects: munch, power, ghost eat, death, fruit, siren×2, level clear
- [x] Particle effects: dot absorb, blaze activation, spirit capture, soul shatter
- [x] Smooth transitions: maze trace-in, wall flash, fog-close game over
- [x] Difficulty progression: 7-level ghost speed/fright curve
- [x] "Wow" moment: Ghost Train (4-ghost combo spectacle)
