# Frogger (Neon Crossing) — Stage/Scenario Script

## Overview
Neon Crossing is a cyberpunk street-crossing game where the player guides a tiny delivery drone through a rain-soaked neon city. The road zone has glowing hover-cars, trucks, and bikes. The sky zone (river equivalent) has floating ad-boards, cargo drones, and sky-trains. Each level increases traffic speed and shrinks the timer. The goal: dock the drone in all 5 home slots, survive the crossing, chase the Perfect Crossing bonus.

## Stages

### Level 1: First Delivery
- **Setting:** Rain falls gently — 20 particles, `#4fc3f7` at 15% opacity, 1×6px, falling 8px/frame. Road background `#0c0c1a` (wet asphalt). Sky background `#060618`. Lane dividers `#1a1a30` dashed. Safe zones `#121228`. Neon signs shimmer on buildings (static decorative elements — colored rectangles at screen edges, `#ff1744` and `#00e5ff` at 10% opacity).
- **Objective:** Guide the drone (`#76ff03`, 16×16px, 3px glow) across 5 road lanes and 5 sky lanes. Dock in all 5 home slots.
- **Enemies/Obstacles:** Road: small cars (`#ff1744`, 30×16px) at 1.5px/frame, trucks (`#ff6d00`, 50×16px) at 1.2px/frame, bikes (`#e040fb`, 20×12px) at 2.0px/frame. Sky: sky-trains (`#00e5ff`, 80×16px) at 1.0px/frame, ad-boards (`#ffd600`, 40×14px) at 0.8px/frame, cargo drones (`#69f0ae`, 24×16px) at 1.0px/frame — cargo drones submerge (blink out) every 4s for 1.5s.
- **New mechanic introduced:** Hop movement (grid-based, `hop_blip` 500Hz 50ms), timer bar (bottom, `#76ff03`→`#ff1744` gradient, 30s), landing splash (4 particles `#4fc3f7`, 150ms). Falling off a platform = splash down (8 particles, 350ms). Vehicle hit = neon crash (10 particles, 400ms).
- **Difficulty:** 2/10
- **Duration:** ~25 seconds per life
- **Boss:** None
- **Reward:** Home reached: 200pts + `dock_chime` (660→880Hz, 200ms). Slot glows `#76ff03` (0→1 opacity pulse, 6 lime particles). All 5 homes: 1000pts bonus, `level_clear` arpeggio (C5-E5-G5-C6, 500ms), rain clears 600ms, 20 multi-color particles burst.
- **Visual cue:** `city_hum` ambient loops (C2+G2 synth pad 8% + rain noise high-pass 6kHz 3%). Timer bar is generous. Wide platform gaps. Forgiving.

### Level 2: Rush Hour
- **Setting:** Rain intensifies slightly — 30 particles. Vehicle headlights more prominent (2px bright dots on leading edge of each vehicle, their color at 80% opacity). Road surface has faint reflections (vehicles mirrored below at 5% opacity, stretched vertically 50%).
- **Objective:** Cross and dock all 5 slots. Traffic is faster.
- **Enemies/Obstacles:** Vehicle speed +10% (cars 1.65px, trucks 1.32px, bikes 2.2px). Timer: 27s. Platform gaps narrow slightly — sky-trains and ad-boards spaced closer together. Cargo drones still submerge every 4s for 1.5s.
- **New mechanic introduced:** **Forward bonus** — each forward hop without retreating or lateral movement scores 10pts. Encourages decisive play. "FORWARD ×N" shows at player position in `#76ff03` 12px, fades 300ms.
- **Difficulty:** 3/10
- **Duration:** ~22 seconds per life
- **Boss:** None
- **Reward:** Home reached: 400pts (200×level). Timer remaining bonus: remaining seconds × 10pts per home dock.

### Level 3: Neon District
- **Setting:** Neon signs at screen edges brighten to 20% opacity and start cycling colors (shift hue through `#ff1744`→`#ffd600`→`#00e5ff`→`#e040fb` over 8s). Rain: 40 particles. A new ambient layer: occasional lightning flash — entire background flashes to `#1a1a30` for 80ms every 15–20s (random), briefly revealing all lane contents clearly.
- **Objective:** Cross and dock. Timing windows are tighter.
- **Enemies/Obstacles:** Vehicle speed +20% from base (cars 1.8px, trucks 1.44px, bikes 2.4px). Timer: 24s. New obstacle: **hover-bus** (`#ffab00`, 70×16px) appears in one road lane — slow (1.0px) but very long, hard to find gaps. Platform gaps medium.
- **New mechanic introduced:** **Fly-by bonus** — narrowly avoiding a vehicle (passing within 4px without collision) scores 25pts + "CLOSE!" in `#ffd600` 14px, 200ms. Rewards bold play.
- **Difficulty:** 5/10
- **Duration:** ~20 seconds per life
- **Boss:** None
- **Reward:** Home: 600pts. Lightning flashes are both beautiful and tactical — use them to scout ahead.

### Level 4: Blackout Boulevard
- **Setting:** Rain: 50 particles, heavier. Neon signs flicker (random 100ms blink-offs every 3–5s). New visual: wet road reflections intensify to 8% opacity. Sky zone gets thin cloud wisps (horizontal streaks `#1a1a30` at 5% opacity drifting left at 0.3px/frame). Timer bar starts flashing `#ff1744` at 500ms intervals in last 25% (as per creative direction).
- **Objective:** Intense crossing. Every second counts.
- **Enemies/Obstacles:** Vehicle speed +33% from base (cars 2.0px, trucks 1.6px, bikes 2.66px). Timer: 21s. Two hover-buses now, different lanes. Cargo drones submerge more frequently (every 3s for 1.5s). New: **speed-bike lane** — one lane has bikes at 3.5px/frame, extremely fast, spaced widely but lethal.
- **New mechanic introduced:** **Emergency boost** — pressing Space during a hop makes the drone dash 2 tiles forward instead of 1, with a bright trail (3 afterimage frames, `#76ff03` at 50%→25%→10%). Usable once every 8s. Cooldown shown as small dot below drone.
- **Difficulty:** 7/10
- **Duration:** ~18 seconds per life
- **Boss:** None
- **Reward:** Home: 800pts. Emergency boost adds a risk-reward layer — dash through danger or save it for the sky zone.

### Level 5+: Neon Storm (repeating, escalating)
- **Setting:** Full storm. Rain: 70 particles, thicker drops (1×8px). Lightning every 8–12s. Neon signs at 30% opacity, cycling rapidly (4s full cycle). Wet reflections at 12% opacity. Cloud wisps thicker (`#1a1a30` 8%). Screen edges have a subtle cyan vignette (`#00e5ff` at 3% opacity). The city feels alive and dangerous.
- **Objective:** Pure survival. Can you keep delivering?
- **Enemies/Obstacles:** Vehicle speed +47% from base (cars 2.2px, trucks 1.76px, bikes 2.93px). Timer: 18s (minimum). Three hover-buses. Speed-bike lanes: 2 of them. Cargo drones submerge every 2.5s for 2s (more time underwater than above). Platform gaps narrow — requires pixel-perfect timing. Speed increases another 5% each level past 5.
- **New mechanic introduced:** **Storm surge** — every 10s, all vehicles briefly accelerate 50% for 2s (a pulse of traffic). Warning: road lanes flash `#ff1744` at 3% opacity for 500ms before surge. During surge, `tick_urgent` sound plays rapidly (every 200ms instead of 500ms).
- **Difficulty:** 9/10 (escalating to 10)
- **Duration:** Until death
- **Boss:** The traffic itself. Every lane is a gauntlet.
- **Reward:** Home: 200×level pts. Perfect Crossing (all 5 homes, no deaths) triggers the full spectacle: rain pauses, city neons flash left→right (100ms/column), synth chord (C3+E3+G3, 600ms), "+PERFECT" in `#76ff03` 28px scale-in, 2000 bonus pts, rain resumes double intensity 2s. At Level 5+, Perfect Crossing is a supreme achievement.

## Progression
Levels increase traffic density, speed, and timer pressure:
- **L1:** Tutorial — gentle rain, generous timer, wide gaps
- **L2:** Rhythm — forward bonus encourages decisiveness
- **L3:** Neon district — fly-by bonus rewards boldness, hover-buses appear
- **L4:** Intensity — emergency boost unlocks, speed-bikes, tight timer
- **L5+:** Storm — surge mechanic, maximum density, survival

### Narrative Thread
You're a delivery drone in a cyberpunk city that never sleeps. Each level is a new district, deeper into the neon sprawl. The rain gets heavier, the traffic faster, the platforms less reliable. Level 1 is the quiet outskirts. Level 5+ is the storm-battered city core. Your job is simple: cross the road, reach the dock, deliver. But the city doesn't care about you — it's a machine of light and steel, and you're just a tiny green dot trying to survive.

### The Perfect Crossing
The signature moment. Filling all 5 home slots without a single death. At Level 1, it's expected. At Level 3, it's impressive. At Level 5+, it's heroic. The rain stops, the city acknowledges you — every neon sign flashes in sequence, a warm chord fills the silence, and "+PERFECT" burns green on screen. Then the rain returns, harder than before.

## Assets Needed
All procedural:
- **Sprites:** Drone (16×16px diamond shape with 4 rotor circles at corners), cars (30×16px rounded rect with headlight dots), trucks (50×16px with neon trim), bikes (20×12px thin), hover-buses (70×16px), sky-trains (80×16px with window dots), ad-boards (40×14px with cycling border), cargo drones (3×8px circles in triangle formation)
- **Particles:** LittleJS system for rain (continuous), landing splash (4 particles), neon crash (10 particles), splash down (8 particles), slot activation (6 particles), level clear burst (20 particles), emergency boost trail (3 afterimages)
- **Audio:** LittleJS `zzfx()` for 7 sounds: `hop_blip`, `crash_static`, `splash_drop`, `dock_chime`, `level_clear`, `tick_urgent`, `city_hum` (looping). Web Audio oscillator for `city_hum` pad.
- **Rain System:** Continuous particle emitter — random x, fixed downward velocity, variable opacity. Intensifies per level.
- **Timer:** Horizontal bar bottom of screen, gradient `#76ff03`→`#ff1744`, depletes left→right, flashes in last 25%.
- **Storage:** localStorage for high score
- **HUD:** Score top-left (`#b0bec5` 14px monospace), high score top-center, lives bottom-left (mini drone icons), level bottom-right, timer bar bottom
