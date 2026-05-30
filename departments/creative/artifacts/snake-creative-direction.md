# Snake — Creative Direction (Arcade Evolution)

**Author:** Creative Director
**Date:** 2026-05-30
**Phase:** 2 (First Game Migration)
**Status:** Concept + Prototype Spec

---

## Concept

Snake becomes **"Neon Serpent"** — a glowing, pulsing cyberpunk-garden experience. The snake is a living neon creature moving through a dark digital grid. Eating food triggers satisfying particle bursts and screen effects. As the snake grows, it leaves a fading trail and the ambient soundscape intensifies. The game should feel hypnotic — a flow state loop where growing longer feels *powerful*.

---

## Visual Identity

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0a0a1a` | Deep dark blue-black void |
| Grid lines | `#141428` | Subtle 1px grid for spatial awareness |
| Snake body | `#39ff14` | Neon green, slight glow |
| Snake head | `#7dff6b` | Brighter green, 2px glow radius |
| Snake trail | `#39ff14` → `#0a0a1a` | Fading afterglow, 300ms decay |
| Food (normal) | `#ff1744` | Pulsing red orb, 800ms sine pulse (scale 0.85–1.15) |
| Food (bonus) | `#ffea00` | Gold, appears every 10th food, 5s timeout, 50pts |
| Score text | `#e0e0e0` | 16px monospace |
| Combo text | `#ffea00` | 24px bold, floats up 40px over 600ms, fades out |
| Game over bg | `#0a0a1a` at 85% opacity | Overlay |
| Game over text | `#ff1744` | "GAME OVER" 32px, 200ms scale-in from 0.5→1.0 |

### Visual Effects (LittleJS particles)
| Event | Effect | Duration | Details |
|-------|--------|----------|---------|
| Food eaten | Radial burst | 400ms | 12 particles, food color, size 3→0px, spread radius 40px |
| Bonus food eaten | Star burst | 600ms | 20 particles, `#ffea00`, size 5→0px, spread 60px + screen flash 50ms white at 15% opacity |
| Death (wall) | Impact sparks | 500ms | 8 particles from collision point, `#ff1744`, directional spray opposite to movement |
| Death (self) | Body dissolve | 800ms | Each segment emits 2 particles sequentially (50ms stagger), segments fade out tail-to-head |
| Level up (every 5 food) | Ring pulse | 300ms | Expanding ring from snake head, `#39ff14`, radius 0→80px, opacity 1→0 |
| Snake movement | Trail afterglow | 300ms | Previous head position glows at 40% opacity, fades to 0 over 300ms |

### Sprite Style
No sprite sheets needed — procedural rendering:
- Snake segments: rounded rectangles (border-radius 4px equivalent), 18×18px in 20×20 cells
- Head: same but with 2 small `#0a0a1a` circles (3px) as eyes, positioned based on direction
- Food: circle (radius 8px), pulsing scale
- Bonus food: diamond shape (rotated square), spinning at 180°/s

---

## Sound Design

**Style:** 8-bit synth with modern reverb

| Event | Sound | Duration | Description |
|-------|-------|----------|-------------|
| Food pickup | `pickup_blip` | 80ms | Rising sine wave 440Hz→880Hz, 80ms, slight reverb tail |
| Bonus pickup | `bonus_chime` | 200ms | Three-note arpeggio C5-E5-G5, 60ms each, sawtooth wave, more reverb |
| Death | `death_buzz` | 400ms | Descending square wave 300Hz→60Hz, 400ms, distortion filter |
| Level up | `levelup_fanfare` | 500ms | Two-note power chord C4+G4 → D4+A4, 250ms each, triangle wave |
| Combo (3+ rapid eats within 2s) | `combo_ding` | 100ms | Pitch increases per combo tier: base 660Hz + 110Hz per tier, max tier 5 |
| Movement | *silent* | — | No movement sound — would be annoying at 120ms intervals |
| Game start | `start_whoosh` | 300ms | White noise sweep high→low with bandpass filter |
| Ambient | `ambient_hum` | looping | Very low volume (10%) continuous low synth pad, C2, slow LFO vibrato |

All sounds generated via LittleJS `zzfx()` — no audio file assets needed.

---

## Gameplay Enhancements

### Progression System
- **Speed curve:** Start 120ms/tick, decrease by 5ms every 5 food (not 8ms — smoother), minimum 50ms
- **Combo system:** Eating food within 2000ms of previous eat = combo. Combo tiers 1–5, score multiplier = 1.0 + (tier × 0.5). Combo resets on timeout. Visual: combo count floats up from food position
- **Bonus food:** Every 10th food eaten spawns a bonus food (gold diamond) at random position. Worth 50 base points (× combo multiplier). Despawns after 5000ms with a shrink animation (last 1000ms)
- **High score:** Persist in localStorage key `arcade_snake_highscore`

### Difficulty Curve (1–10)
| Food eaten | Speed (ms) | Difficulty | Feel |
|-----------|-----------|------------|------|
| 0–4 | 120 | 1 | Chill, learn controls |
| 5–9 | 115 | 2 | Comfortable |
| 10–14 | 110 | 3 | Engaged |
| 15–19 | 105 | 4 | Focused |
| 20–24 | 100 | 5 | Challenging |
| 25–29 | 95 | 6 | Intense |
| 30–34 | 90 | 7 | Sweaty |
| 35–39 | 85 | 8 | Expert |
| 40–44 | 80 | 9 | Mastery |
| 45+ | 50 | 10 | Survival |

### "Wow" Moment
**The Mega Combo:** If the player reaches combo tier 5 (eating 5 food within rapid succession — possible when food spawns nearby), trigger:
- Full-screen flash `#39ff14` at 20% opacity, 100ms
- Score text scales to 32px for 500ms
- All snake segments pulse bright for 300ms
- Sound: `combo_ding` at max pitch + 200ms reverb tail
- "+MEGA" text floats up in `#ffea00`, 32px bold

---

## Transitions
| Transition | Animation | Duration |
|-----------|-----------|----------|
| Game start | Grid fades in (opacity 0→1), snake appears segment-by-segment from center | 500ms |
| Game over | Snake freezes → death effect → overlay slides down (opacity 0→0.85) → text scales in | 800ms total |
| Restart | Overlay fades out (200ms) → grid pulse (100ms) → new snake appears | 400ms total |

---

## Assets Needed (for R&D)
All procedural — no external assets required:
- LittleJS particle system for all effects
- LittleJS `zzfx()` for all sounds (provide exact parameters)
- Canvas 2D drawing for snake, food, grid
- localStorage for high score persistence

---

## Quality Bar Checklist
- [x] Unique color palette: `#0a0a1a` / `#39ff14` / `#ff1744` / `#ffea00`
- [x] 7 sound effects: pickup, bonus, death, levelup, combo, start, ambient
- [x] Particle effects: food burst, bonus burst, death sparks/dissolve, level ring
- [x] Smooth transitions: start fade-in, game-over overlay, restart
- [x] Difficulty progression: 10-tier speed curve
- [x] "Wow" moment: Mega Combo at tier 5
