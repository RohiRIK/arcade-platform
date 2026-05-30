# Frogger — Creative Direction (Arcade Evolution)

**Author:** Creative Director
**Date:** 2026-05-30
**Phase:** 3 (Second Wave Migration)
**Status:** Concept + Prototype Spec

---

## Concept

Frogger becomes **"Neon Crossing"** — a cyberpunk nightlife street-crossing game. The frog is a tiny delivery drone navigating through a rain-soaked neon city. The road zone has glowing vehicles (hover-cars, trucks, bikes) streaming across. The river zone becomes rooftops with moving platforms (floating ad-boards, cargo drones, sky-trains). The city pulses with color — rain streaks, neon reflections, and a lo-fi ambient soundtrack. It should feel like a miniature Blade Runner crossing.

---

## Visual Identity

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background (road) | `#0c0c1a` | Dark wet asphalt |
| Background (river/sky) | `#060618` | Darker sky zone |
| Road markings | `#1a1a30` | Dashed lane dividers, 1px |
| Safe zones | `#121228` | Start/middle/end strips, subtle highlight |
| Player (drone) | `#76ff03` | Lime green, 3px glow, 16×16px |
| Car (small) | `#ff1744` | Red hover-car, 30×16px |
| Truck | `#ff6d00` | Orange cargo hauler, 50×16px |
| Bike | `#e040fb` | Magenta speed-bike, 20×12px |
| Log → Sky-train | `#00e5ff` | Cyan floating platform, various widths |
| Short log → Ad-board | `#ffd600` | Yellow floating ad, 40×14px |
| Turtle → Cargo drone | `#69f0ae` | Green drone cluster, blinks/descends |
| Home slots | `#1a237e` | Dark alcoves at top, glow `#76ff03` when filled |
| Rain | `#4fc3f7` at 15% opacity | Falling streaks 1×6px, continuous |
| Score | `#b0bec5` | 14px monospace top |
| Timer bar | `#76ff03` → `#ff1744` | Gradient bar, bottom of screen, depletes left→right |

### Visual Effects (LittleJS particles)
| Event | Effect | Duration | Details |
|-------|--------|----------|---------|
| Hop | Landing splash | 150ms | 4 particles from landing position, `#4fc3f7` (rain splash), size 2→0px, spread 12px |
| Vehicle hit | Neon crash | 400ms | 10 particles in vehicle's color + `#ffffff`, spark-spray pattern, player blinks 3× then disappears |
| Drown (fall off platform) | Splash down | 350ms | 8 particles `#4fc3f7`, upward arc with gravity, player shrinks to 0 over 350ms |
| Home reached | Slot activation | 300ms | Home slot glows `#76ff03` (pulse 0→1 opacity), 6 particles lime green celebration burst |
| All homes filled | Rain clear | 600ms | Rain stops, all home slots pulse simultaneously, 20 particles multi-color burst from center, brief sky lighten (background shifts to `#0c0c2a` for 500ms) |
| Timer warning (last 25%) | Bar flash | continuous | Timer bar flashes `#ff1744` every 500ms |
| Level up | City pulse | 400ms | All neon elements flash 20% brighter for 200ms, rain intensifies for 1s |

### Sprite Style
Procedural:
- Drone (player): 16×16px, diamond shape with 4 small circles (rotors) at corners, center dot
- Vehicles: rounded rectangles with neon trim (1px bright edge on top), headlight dots (2px) on leading edge
- Sky-trains: elongated rectangles with glowing window dots (3px squares, 6px spacing)
- Ad-boards: rectangles with 1px animated border (color cycles through `#ffd600`→`#ff1744`→`#e040fb` over 3s)
- Cargo drones: 3 circles (8px) in triangle formation, connected by 1px lines
- Rain: 1×6px vertical lines, falling at 8px/frame, random x-positions, 15% opacity

---

## Sound Design

**Style:** Lo-fi cyberpunk — synth pads, urban ambiance

| Event | Sound | Duration | Description |
|-------|-------|----------|-------------|
| Hop | `hop_blip` | 50ms | Short sine 500Hz, 50ms, clean pop |
| Vehicle hit | `crash_static` | 250ms | White noise burst + descending square wave 600→100Hz, 250ms |
| Drown | `splash_drop` | 200ms | Noise burst with low-pass filter at 800Hz, 200ms, like muffled splash |
| Home reached | `dock_chime` | 200ms | Two-note: 660Hz→880Hz, 100ms each, triangle wave, reverb |
| All homes filled | `level_clear` | 500ms | Ascending arpeggio C5-E5-G5-C6, 120ms each, sine wave, bright reverb |
| Timer warning | `tick_urgent` | 60ms | Square wave 1kHz, 60ms, plays every 500ms in last 25% of timer |
| Ambient | `city_hum` | looping | Low synth pad C2+G2 at 8% volume + very faint rain noise (white noise high-pass 6kHz at 3% volume) |

All sounds via LittleJS `zzfx()`.

---

## Gameplay Enhancements

### Progression System
- **Levels:** Each level increases vehicle speed +10% and reduces timer by 3s
- **Timer:** 30s per life at level 1, minimum 15s
- **Scoring:** Hop forward = 10pts, Home reached = 200pts × level, All homes = 1000pts bonus
- **Lives:** 3 lives, shown as mini drone icons
- **Vehicle speed:** Level 1 base = 1.5px/frame, varies by lane (±0.5px)
- **Platform speed:** Slightly slower than vehicles (1.0px/frame base), cargo drones blink/submerge every 4s for 1.5s

### Difficulty Curve
| Level | Vehicle speed | Timer | Platform gaps | Feel |
|-------|-------------|-------|--------------|------|
| 1 | 1.5px/frame | 30s | Wide | Learn lanes |
| 2 | 1.65px/frame | 27s | Medium | Timing matters |
| 3 | 1.8px/frame | 24s | Medium | Quick decisions |
| 4 | 2.0px/frame | 21s | Narrow | Intense |
| 5+ | 2.2px/frame | 18s | Narrow | Survival |

### "Wow" Moment
**The Perfect Crossing:** Filling all 5 home slots without losing a life triggers the Perfect Crossing bonus — the rain pauses, neon lights across the entire city flash in sequence left→right (100ms per column), a deep synth chord plays (C3+E3+G3, 600ms), "+PERFECT" appears in `#76ff03` at 28px center-screen with scale-in 0.5→1.0, and 2000 bonus points are awarded. The rain then resumes with double intensity for 2s as the next level loads.

---

## Transitions
| Transition | Animation | Duration |
|-----------|-----------|----------|
| Game start | Rain fades in, lanes populate left→right (vehicles slide in), drone materializes at start | 600ms |
| Home reached | Drone shrinks into slot → slot glows → drone respawns at start | 400ms |
| Death | Crash/splash effect → screen dims 200ms → drone respawns | 500ms |
| Level clear | Perfect crossing sequence (if earned) or simple city pulse → new level loads | 600–1200ms |
| Game over | Rain intensifies → drone fades → all neons dim to 20% → overlay | 800ms |

---

## Assets Needed (for R&D)
All procedural:
- LittleJS particle system for splashes/crashes/celebrations
- LittleJS `zzfx()` for all sounds
- Canvas 2D for drone, vehicles, platforms, rain system
- Lane configuration data (speed, direction, object types per lane)
- Timer system with visual bar
- localStorage for high score

---

## Quality Bar Checklist
- [x] Unique color palette: cyberpunk neons on dark asphalt — `#0c0c1a` / `#76ff03` / `#ff1744` / `#00e5ff`
- [x] 7 sound effects: hop, crash, splash, dock, clear, timer tick, ambient
- [x] Particle effects: rain, landing splash, neon crash, slot activation
- [x] Smooth transitions: rain fade-in, death dim, neon-dim game over
- [x] Difficulty progression: 5-level speed/timer curve
- [x] "Wow" moment: Perfect Crossing (no-death level bonus spectacle)
