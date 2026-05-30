## Pivot Proposal: Phaser Migration

- **Type:** tech-stack
- **Current state:** All 7 games in a single index.html (~3000+ lines), vanilla JS with raw Canvas API. Each game is a standalone function. No shared game engine, no asset pipeline, no scene management.
- **Target state:** Phaser 3 game framework. Each game as a separate Phaser Scene class. Shared utilities (input handling, scoring, collision, sprites). Proper asset loading pipeline. Hot-reload dev experience.
- **Why now:** Platform has 7 games and growing. Vanilla canvas code is getting harder to maintain — each game reinvents input handling, collision detection, rendering loops. Phaser provides battle-tested abstractions that will accelerate future game development and improve quality.
- **Scope:** R&D (rewrite games), UX/UI (adapt visual systems to Phaser), DevOps (update build pipeline), QA (new test approach), Infra (bundle size changes), PM (track migration)
- **Estimated phases:** 5
- **Rollback plan:** Keep monolith index.html as index-legacy.html. If Phaser migration fails, revert to legacy.

## Execution Plan

### Phase 1: Setup & Prototype (target: 2 cycles)

- [ ] Add Phaser 3 to project dependencies — R&D
- [ ] Create shared game engine base class — R&D
- [ ] Port Snake (simplest game) to Phaser Scene — R&D
- [ ] Verify Snake works identically to vanilla version — QA
- Checkpoint: Snake playable in Phaser, no regressions

### Phase 2: Shared Systems (target: 2 cycles)

- [ ] Extract shared utilities: input manager, score display, collision helpers — R&D
- [ ] Create shared asset loading pipeline — R&D
- [ ] Port Pong and Breakout using shared systems — R&D
- [ ] Adapt UI theme/styling to Phaser rendering — UX/UI
- Checkpoint: 3 games running on Phaser with shared utilities

### Phase 3: Complex Games (target: 3 cycles)

- [ ] Port Tetris, Space Invaders — R&D
- [ ] Port Pac-Man, Frogger — R&D
- [ ] Full regression on all 7 games — QA
- Checkpoint: All 7 games playable on Phaser

### Phase 4: Polish & Infrastructure (target: 2 cycles)

- [ ] Game selection menu as Phaser scene — UX/UI
- [ ] Update CI pipeline for Phaser build — DevOps
- [ ] Performance/bundle size audit — Infra
- [ ] Update all documentation — PM
- Checkpoint: Production-ready Phaser build

### Phase 5: Cutover & Cleanup (target: 1 cycle)

- [ ] Archive monolith as index-legacy.html — R&D
- [ ] Deploy Phaser version as primary — DevOps
- [ ] Final smoke test — QA
- [ ] Retrospective — All
- Checkpoint: Phaser is production, monolith archived

## Success Criteria

- [ ] All 7 games playable with same functionality as vanilla versions
- [ ] Shared game engine reduces per-game code by >40%
- [ ] Bundle size increase <2MB over current
- [ ] All QA regression tests pass
- [ ] Dev experience: hot-reload works for game changes

## Kill Criteria (abort pivot if any are true)

- [ ] Phaser bundle exceeds 5MB and cannot be tree-shaken
- [ ] Any game cannot be faithfully reproduced in Phaser
- [ ] Performance drops below 30fps on target hardware
- [ ] Phase 1 takes more than 4 cycles (prototype too complex)
