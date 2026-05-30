# Game Submission Standard

**Audience**: R&D department, anyone adding a game.

## Pipeline Prerequisite
A game cannot be built without a signed-off spec in `departments/rnd/specs/`. The spec requires a pitch, the pitch requires research. No shortcuts.

## Required Files

### 1. `backend/src/games/<name>/meta.json`
```json
{
  "name": "Human-Readable Name",
  "description": "One sentence. What the player does.",
  "version": "1.0.0",
  "category": "classic",
  "color": "#hex6"
}
```
All fields required. `version` follows semver. `color` is a 6-digit hex used for the game card.

### 2. Game Logic
Add rendering and input handling to `frontend/public/index.html` (or a separate JS file loaded by it):
- Canvas-based rendering in the `gameCanvas` element
- Keyboard input via `addEventListener('keydown', ...)`
- Game loop using `requestAnimationFrame`
- Restart support (R key)

### 3. Registration
In `frontend/public/index.html`:
- Add entry to the `ICONS` map with an emoji
- Add case to the `launchGame()` switch

## Checklist Before Shipping
- [ ] `meta.json` exists and validates against schema above
- [ ] Game renders in the canvas without errors
- [ ] Controls documented in meta.json description
- [ ] No console errors on launch, play, or restart
- [ ] `docker compose up -d --build` succeeds
- [ ] Game appears in the lobby card grid

## Naming
- Directory name: lowercase, no spaces, no special chars (e.g., `tetris`, `space-invaders`)
- `meta.json` name field: title case (e.g., `"Tetris"`, `"Space Invaders"`)

## Acceptance Criteria (required in spec)
Every game spec must include these testable requirements before R&D can build:
- Game loads without JS errors
- Canvas renders correctly
- Controls respond (specify which keys)
- Score displays and increments
- Game over state works
- Restart works without page reload
- No hardcoded localhost
- Works from LAN IP

QA verifies these after build. Failures become P1/P2 bug reports.
