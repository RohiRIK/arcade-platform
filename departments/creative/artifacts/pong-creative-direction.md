# Pong — Creative Direction (Arcade Evolution)

**Author:** Creative Director
**Date:** 2026-05-30
**Phase:** 3 (Second Wave Migration)
**Status:** Concept + Prototype Spec

---

## Concept

Pong becomes **"Volt Rally"** — a high-voltage electric duel. Two paddles are Tesla coils generating arcing electricity. The ball is a crackling plasma orb that leaves ionized trails across a dark field. Hits produce electric discharge effects. The longer a rally goes, the more the field charges up — lightning arcs between walls, the ball accelerates, and the ambient hum intensifies. It should feel like barely-contained energy.

---

## Visual Identity

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#050510` | Near-black with faint blue tint |
| Court line (center) | `#1a1a3a` | Dashed, subtle, 2px wide |
| Paddle (left) | `#00e5ff` | Cyan Tesla coil, 3px glow |
| Paddle (right) | `#ff6d00` | Orange Tesla coil, 3px glow |
| Ball | `#ffffff` | White-hot plasma core, 4px glow radius |
| Ball trail | `#ffffff` → `#050510` | Ionized trail, 200ms decay, 5 ghost positions |
| Score text | `#e0e0e0` | 20px monospace, top center |
| Rally counter | `#ffab00` | 14px, appears after 5-hit rallies, pulses |
| Court border | `#1a1a3a` | 1px, barely visible |
| Win text | winner's color | 36px bold, electric flicker effect (toggle opacity 0.7–1.0 every 100ms) |

### Visual Effects (LittleJS particles)
| Event | Effect | Duration | Details |
|-------|--------|----------|---------|
| Paddle hit | Electric discharge | 300ms | 8 particles from contact point, paddle's color, size 2→0px, spread 30px arc shape |
| Wall bounce | Spark shower | 200ms | 6 particles downward from bounce point, `#ffffff`, size 1→0px |
| Score point | Flash + shatter | 500ms | Ball shatters into 16 fragments (white), losing side border flashes red `#ff1744` 100ms. Winning paddle glows bright 200ms |
| Rally 10+ | Field charge | continuous | Faint lightning arcs (2px lines) randomly between top/bottom walls, `#1a1a3a` → `#3a3a6a`, 1 arc per 500ms |
| Rally 20+ | Overcharge | continuous | Ball grows from 8→12px radius, trail lengthens to 8 ghosts, ambient hum pitch rises |
| Game start | Power-up sequence | 600ms | Both paddles glow from dim→full brightness (300ms), ball materializes at center with expanding ring |
| Game win | Victory discharge | 800ms | 30 particles in winner's color burst from center, loser's paddle dims to 20% opacity |

### Sprite Style
Procedural rendering:
- Paddles: rounded rectangles 12×80px, border-radius 6px, with 3px outer glow (blur)
- Ball: circle radius 8px, white core with 4px glow
- Center line: dashed (8px dash, 8px gap), 2px wide
- Court: 600×400px playing field, 1px border

---

## Sound Design

**Style:** Industrial synth, electric/static textures

| Event | Sound | Duration | Description |
|-------|-------|----------|-------------|
| Paddle hit | `hit_zap` | 60ms | White noise burst with bandpass at 2kHz, 60ms, sharp attack |
| Wall bounce | `wall_tick` | 40ms | Short click, square wave 1200Hz, 40ms, no reverb |
| Score point | `score_boom` | 300ms | Low bass hit 80Hz + high crack 3kHz, 50ms attack, 250ms decay |
| Rally 10+ | `rally_charge` | 150ms | Rising sine sweep 200Hz→800Hz, plays once when rally hits 10 |
| Rally 20+ | `rally_overcharge` | 200ms | Distorted chord C3+E3, sawtooth, 200ms, signals danger zone |
| Game win | `win_fanfare` | 600ms | Three ascending power chords, 200ms each, triangle wave + slight distortion |
| Ambient | `electric_hum` | looping | 60Hz hum at 8% volume, subtle LFO modulation, pitch rises with rally count |

All sounds via LittleJS `zzfx()`.

---

## Gameplay Enhancements

### Progression System
- **Ball speed curve:** Start at 4px/frame, +0.3px/frame every 5 rallies in a round, max 8px/frame
- **Rally bonus:** After 10-hit rally, next score worth 3 points instead of 1. After 20-hit, worth 5 points
- **AI difficulty (single player):** AI paddle tracks ball with 60ms reaction delay at game start, decreasing by 5ms per AI score (min 20ms). AI paddle speed = ball speed × 0.85
- **Win condition:** First to 11 points, must win by 2 (max 15 cap)

### Difficulty Curve
| Rally length | Ball speed | Feel |
|-------------|-----------|------|
| 0–4 | 4px/frame | Warmup, easy returns |
| 5–9 | 5.5px/frame | Engaged |
| 10–14 | 7px/frame | Fast, rewarding |
| 15–19 | 8px/frame | Frantic |
| 20+ | 8px/frame + larger ball | Overcharge chaos |

### "Wow" Moment
**The Overcharge Rally:** At 20+ hits in a single rally, the entire court pulses with energy — lightning arcs between walls every 300ms, the ball doubles its glow radius, both paddles vibrate (±1px random offset per frame), and the ambient hum swells to 25% volume. Scoring during overcharge triggers a massive 30-particle explosion in both player colors simultaneously.

---

## Transitions
| Transition | Animation | Duration |
|-----------|-----------|----------|
| Game start | Court lines draw in from edges, paddles slide in from off-screen, ball materializes | 600ms |
| Score point | Ball shatters → 500ms pause → ball reforms at center → 300ms countdown flash | 1000ms total |
| Game over | Final score flashes winner's color 3× (150ms each) → overlay fades in → "PLAYER X WINS" scales in | 900ms total |
| Restart | Overlay dissolves → paddles reset → new ball materialization | 500ms |

---

## Assets Needed (for R&D)
All procedural:
- LittleJS particle system for discharge/spark/shatter effects
- LittleJS `zzfx()` for all sounds
- Canvas 2D for paddles, ball, court, lightning arcs
- Simple AI paddle tracking with configurable delay

---

## Quality Bar Checklist
- [x] Unique color palette: `#050510` / `#00e5ff` / `#ff6d00` / `#ffffff`
- [x] 7 sound effects: hit, wall, score, rally×2, win, ambient
- [x] Particle effects: discharge, sparks, shatter, field charge, overcharge
- [x] Smooth transitions: power-up start, score pause, game over
- [x] Difficulty progression: ball speed curve + rally mechanics
- [x] "Wow" moment: Overcharge Rally at 20+ hits
