# Space Invaders — Creative Direction (Arcade Evolution)

**Author:** Creative Director
**Date:** 2026-05-30
**Phase:** 3 (Second Wave Migration)
**Status:** Concept + Prototype Spec

---

## Concept

Space Invaders becomes **"Last Frequency"** — a retro-radio-signal defense game. You're a ground station intercepting alien transmissions that materialize as invaders. The invaders are glitchy holographic projections descending through static. Your cannon fires signal pulses that disrupt them. Destroyed invaders burst into scan-line fragments. The CRT aesthetic is strong — screen curvature, phosphor glow, interlaced scan lines.

---

## Visual Identity

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#020408` | CRT black with subtle blue phosphor |
| Scan lines | `#0a0a14` | Horizontal lines every 2px at 15% opacity |
| Player cannon | `#00ff88` | Phosphor green, 2px glow |
| Player bullet | `#00ff88` | Thin vertical line 2×8px, bright |
| Invader row 1 (top) | `#ff1744` | Red — 40pts, fastest |
| Invader row 2 | `#ff9100` | Orange — 30pts |
| Invader row 3 | `#ffea00` | Yellow — 20pts |
| Invader row 4-5 (bottom) | `#69f0ae` | Pale green — 10pts |
| UFO | `#e040fb` | Magenta, 3px glow, scan-line flicker |
| Invader bullet | `#ff1744` | Red zigzag 2×6px |
| Shields | `#00bfa5` | Teal, destructible pixel blocks |
| Score text | `#00ff88` | 14px monospace, top |
| Lives | `#00ff88` | Small cannon icons bottom-left |
| CRT vignette | `#000000` radial gradient | Darkens edges 20% |

### Visual Effects (LittleJS particles)
| Event | Effect | Duration | Details |
|-------|--------|----------|---------|
| Invader destroyed | Glitch shatter | 350ms | 8 particles in invader's color, rectangular shapes (scan-line fragments 4×1px), spray outward with slight gravity |
| Player destroyed | Static burst | 500ms | 16 particles white/green mix, rapid flicker (opacity toggles 0/1 every 50ms for 500ms), cannon outline remains as ghost 200ms |
| UFO destroyed | Magenta explosion | 600ms | 12 particles `#e040fb`, larger (6→0px), score value floats up from position in `#e040fb` 20px bold |
| Shield hit | Pixel erosion | instant | Affected 4×4px block removed, 2 tiny particles (2px) in shield color fall downward |
| Invader step | Row flash | 50ms | All invaders in moving row flash 20% brighter for one frame |
| Wave clear | Signal burst | 800ms | Horizontal scan-line sweep top→bottom in `#00ff88` at 10% opacity (like a CRT refresh), 400ms, then new wave materializes top→bottom |
| Invader descent | Tension pulse | 100ms | Bottom row pulses 30% brighter each time invaders shift down |

### Sprite Style
Procedural pixel art:
- Invaders: 11×8px pixel patterns (3 types), drawn at 2× scale (22×16px). Alternate between 2 animation frames on each step
- Player: 13×8px pixel shape at 2× (26×16px), flat-top cannon design
- UFO: 16×7px at 2× (32×14px), classic saucer
- Shields: 22×16px destructible pixel grids (each pixel = 4×4 actual px)

---

## Sound Design

**Style:** CRT/radio — static, beeps, analog interference

| Event | Sound | Duration | Description |
|-------|-------|----------|-------------|
| Player shoot | `pulse_fire` | 60ms | Short square wave burst 1kHz, 60ms, clean |
| Invader destroyed | `static_pop` | 100ms | White noise burst 100ms with sharp bandpass at 3kHz |
| UFO appears | `ufo_warble` | looping | Sine wave 300Hz with slow vibrato ±50Hz at 4Hz rate, volume 15%, loops while UFO visible |
| UFO destroyed | `signal_catch` | 250ms | Rising arpeggio 500→750→1000Hz, 80ms each, triangle wave |
| Player destroyed | `static_crash` | 400ms | White noise 400ms, descending lowpass filter 4kHz→200Hz |
| Invader step | `march_blip` | 40ms | Square wave, pitch starts 120Hz, increases 10Hz per row lost. Gets faster as invaders speed up |
| Shield hit | `shield_crunch` | 50ms | Very short noise burst, low volume, 50ms |
| Wave complete | `frequency_sweep` | 500ms | Ascending sine sweep 200Hz→2000Hz, 500ms, reverb |

All sounds via LittleJS `zzfx()`.

---

## Gameplay Enhancements

### Progression System
- **Wave system:** 5 waves per game. Each wave: 5 rows × 11 invaders = 55 targets
- **Speed escalation:** Invaders start at 500ms step interval, -30ms per invader destroyed in wave, minimum 80ms
- **UFO:** Random appearance every 20–30s, crosses top of screen in 6s, worth 50/100/150/300pts (random weighted)
- **Shields:** 4 shields, each a 22×16 pixel grid. Invader bullets + player bullets erode them
- **Bonus life:** Every 10,000 points
- **Wave bonuses:** Clear wave = 1000 × wave_number points

### Difficulty Curve
| Wave | Step start | Invader bullets/s | Feel |
|------|-----------|-------------------|------|
| 1 | 500ms | 0.5 | Learn to aim |
| 2 | 450ms | 0.8 | Pick up pace |
| 3 | 400ms | 1.2 | Dodging matters |
| 4 | 350ms | 1.5 | Intense |
| 5 | 300ms | 2.0 | Survival |

### "Wow" Moment
**The Last Frequency Catch:** Destroying the UFO triggers a special sequence — the screen briefly fills with horizontal static lines (100ms), then the UFO's point value appears in large `#e040fb` text (28px) that echoes 3 times (scale 1.0→0.8, opacity fading), each echo offset 10px upward. If the UFO was worth 300pts (1/8 chance), the entire screen border flashes magenta for 200ms and a deep bass hit plays.

---

## Transitions
| Transition | Animation | Duration |
|-----------|-----------|----------|
| Game start | CRT power-on: horizontal line expands from center vertically (like old TV), scan lines appear | 500ms |
| Wave clear | All positions flash → scan sweep → new wave materializes row-by-row 100ms/row | 1000ms |
| Player death | Static burst → screen flicker (3×100ms) → respawn cannon at center | 700ms |
| Game over | Invaders freeze → CRT power-off: screen collapses to horizontal line → line fades | 800ms |

---

## Assets Needed (for R&D)
All procedural:
- LittleJS particle system for glitch shatter/static effects
- LittleJS `zzfx()` for all sounds
- Canvas 2D for pixel-art invaders (3 types × 2 frames), cannon, UFO, shields
- CRT post-processing: scan lines overlay + vignette (simple canvas operations)
- localStorage for high score

---

## Quality Bar Checklist
- [x] Unique color palette: CRT phosphor greens + row-coded invader colors
- [x] 8 sound effects: shoot, destroy, UFO×2, player death, march, shield, wave
- [x] Particle effects: glitch shatter, static burst, pixel erosion, scan sweep
- [x] Smooth transitions: CRT power-on/off, wave sweep, death flicker
- [x] Difficulty progression: 5 waves with escalating speed + fire rate
- [x] "Wow" moment: Last Frequency Catch (300pt UFO spectacle)
