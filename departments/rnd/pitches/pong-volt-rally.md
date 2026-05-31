# Pitch: Pong (Volt Rally)

## Elevator Pitch
Transform the original 1972 arcade classic into an electric duel where every rally charges the arena with escalating lightning, particle storms, and a throbbing ambient hum — simple to learn, impossible to put down.

## Gameplay
- **How does the player interact?** Arrow keys (or W/S) move a paddle up/down. One axis, zero complexity — pure timing and positioning.
- **What's the core loop?** Hit the ball past the CPU paddle to score. First to 11 wins (win by 2 at deuce, cap 15). Each rally builds tension: ball accelerates, effects intensify, the court comes alive with electricity.
- **What makes it replayable?**
  - 4 implicit stages per rally (Cold Start → First Spark → Live Wire → Overcharge) create a micro-narrative every time
  - Deuce mechanic at 10-10 with red border pulse and "CLUTCH" celebration for dramatic finishes
  - CPU AI scales with its own score — gets harder as it catches up
  - Rally bonus scoring (3× at 10 hits, 5× at 20+) rewards aggressive extended play
  - Overcharge mode (rally 20+) is a genuine spectacle — paddles vibrate, lightning storms, giant ball

## Technical Fit
- **Canvas complexity:** Medium — paddle/ball physics are trivial, but lightning arcs, particle systems, and ambient audio add polish layers
- **Estimated lines of code:** 400-500 (reuses particle/audio patterns from Snake Neon Serpent)
- **Dependencies on platform features:** zzfx for 7 SFX, Web Audio oscillator for ambient hum, localStorage for high score, canvas 600×400

## Architecture
- Single file: `frontend/public/js/games/pong-volt-rally.js`
- 8 named functions following CTO decomposition requirement:
  1. `startPongVoltRally()` — entry point, init state, start loop
  2. `updateBall()` — physics, wall bounce, scoring
  3. `updatePaddles()` — player input + CPU AI
  4. `checkCollisions()` — paddle-ball with angle variation
  5. `updateParticles()` — 150-cap particle system
  6. `updateAudio()` — ambient hum + match state audio shifts
  7. `renderGame()` — court, paddles, ball, trail, lightning, particles, HUD
  8. `cleanup()` — rAF, listeners, AudioContext, oscillator, timeouts

## Key Mechanics from Creative Spec
- **Rally stages:** Ball speed 4→5.5→7→8 px/frame at rally thresholds 0/5/10/20
- **Paddle hit physics:** Angle varies by hit offset from paddle center — edge hits go steep, center hits go straight
- **Late-game escalation:** At 8-8+, baseline effects permanently elevated (brighter court, faster start speed)
- **Deuce:** At 10-10+, red border pulse, "DEUCE" text, must win by 2
- **Victory:** Particle bursts, paddle flashes, "CLUTCH" text for deuce wins
- **Audio:** 7 zzfx sounds + oscillator ambient hum scaling with match tension

## Mockup
```
┌──────────────────────────────────────────────────────────────┐
│  3                        ¦                               7  │
│                           ¦                                  │
│                           ¦                                  │
│  ██                       ¦          ·····○                ██│
│  ██                       ¦                                ██│
│  ██                       ¦                                ██│
│                           ¦                                  │
│                           ¦                                  │
│              ⚡ RALLY: 12 ⚡              [3× BONUS]        │
└──────────────────────────────────────────────────────────────┘
  Left: Player paddle        Center: dashed line + rally counter
  Right: CPU paddle           ·····○ : ball with ghost trail
  ⚡: lightning arcs appear at Stage 3+
```

## Risk Assessment
- **Ball speed tuning:** 8px/frame max at 600×400 canvas is fast but manageable — ball crosses court in ~75 frames
- **CPU difficulty:** Reaction delay system (60ms base, -5ms/score, min 20ms) needs playtesting but is well-parameterized
- **Complexity:** M — simpler than Snake (no grid, no self-collision, fewer stages)

## Ready for Spec
Research complete, creative direction fully specified. Spec should detail: exact zzfx parameters, particle spawn configs, CPU AI pseudocode, stage transition logic, deuce/victory state machine.
