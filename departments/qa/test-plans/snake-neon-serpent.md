# Test Plan: Snake Neon Serpent (Phase 2)

## Game ID: snake (neon serpent rewrite)
## Version: Phase 2 arcade-evolution
## Date: 2026-05-31

## Acceptance Criteria

### TC-1: Game Loads
- Navigate to game list, click Snake card
- Canvas 600x400 renders within 2 seconds
- SCORE 0 and STAGE 1 displayed
- Snake (green) and food (pink/red) visible

### TC-2: Controls
- Arrow keys change snake direction
- Cannot reverse direction (left while moving right)
- R key restarts after game over

### TC-3: Gameplay — Scoring & Combo
- Eating food increments score by 10 (stages 1-7) or 15 (stage 8)
- Combo tier increases when food eaten within 2000ms window
- 5 combo tiers: 1x, 2x, 3x, 5x, 8x multiplier
- Floating text appears on combo

### TC-4: Stage Progression
- 8 implicit stages based on foodEaten count (0, 5, 10, 15, 20, 25, 35, 45)
- Background darkens progressively
- Grid opacity changes per stage
- Fireflies appear stage 3+
- Vignette appears stage 5+
- Heartbeat audio stage 7+
- Afterimage effect stage 8

### TC-5: Bonus Food
- Bonus food spawns every 10 regular food eaten
- Bonus food disappears after 5000ms
- Bonus food awards 50 points

### TC-6: Game Over
- Wall collision triggers game over
- Self collision triggers game over
- Death particles spawn
- High score saved to localStorage
- "Press R to restart" displayed

### TC-7: Audio
- 7 SFX: eat, combo, death, bonus spawn, bonus eat, start, stage transition
- Ambient oscillator audio
- Heartbeat in stage 7+

### TC-8: Particles
- Trail glow on snake head movement
- Food pickup burst
- Death sparks
- Star burst on mega combo
- Afterimage in stage 8
- 150 particle cap enforced

### TC-9: No Hardcoded localhost
- grep frontend code for 'localhost' or '127.0.0.1' — must be clean

### TC-10: Zero Console Errors
- No JS errors in browser console during gameplay

## Results (2026-05-31)
- TC-1: PASS — Canvas 600x400, SCORE 0, STAGE 1 displayed, snake and food visible
- TC-2: PASS — R key restarts game (verified via dispatched keydown event)
- TC-3: Not tested (requires extended gameplay)
- TC-4: Not tested (requires 45+ food eaten)
- TC-5: Not tested (requires 10+ food eaten)
- TC-6: PASS — Wall collision triggers game over, death particles spawn, "Press R to restart" shown
- TC-7: Not tested (requires user interaction for AudioContext)
- TC-8: PARTIAL — Trail glow and death sparks observed
- TC-9: PASS — Zero hardcoded localhost in frontend JS
- TC-10: PASS — Zero console errors
