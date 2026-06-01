# Workflow: Creative Pipeline (Game Migration)

## When to Use
- Migrating an existing game to LittleJS with creative polish
- Full game redesign with staged progression

## Process
1. **Research** — R&D studies the original game mechanics, documents core loop
2. **Pitch** — R&D writes a pitch with creative direction (stages, effects, audio)
3. **Creative Script** — Creative dept produces detailed stage scripts (hex codes, timing, particles, sound specs)
4. **Spec** — R&D writes technical spec with architecture, dependencies, acceptance criteria
5. **CTO Review** — CTO approves spec before build begins
6. **Build (TDD or E2E-first)** — R&D implements using an appropriate dev workflow
7. **QA Verification** — Browser-based testing, not grep
8. **CPO Quality Review** — Final creative quality check

## Rules
- No build starts without CTO-approved spec
- Build phase MUST use TDD or E2E-first (not ad-hoc)
- QA MUST verify in real browser
- Each stage is a shippable increment
