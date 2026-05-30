# Code Style Conventions

**Audience**: R&D, UX/UI, anyone writing frontend or backend code.

## JavaScript (Frontend Games)
- **Canvas**: all games render to the shared `gameCanvas` element
- **Game loop**: use `requestAnimationFrame`, not `setInterval`
- **Input**: `addEventListener('keydown', ...)` on `document`; always `e.preventDefault()` for arrow keys to avoid page scroll
- **Restart**: bind `R` key to reset game state
- **Naming**: `camelCase` for variables/functions, `UPPER_SNAKE` for constants
- **No globals**: wrap game state in an object or closure; clean up on game exit

## JavaScript (Backend)
- **Framework**: Express.js
- **Route files**: one file per resource in `backend/src/routes/`
- **Config**: read from `backend/config.json`, never hardcode ports or paths
- **Error handling**: always return `{ error: "message" }` with appropriate HTTP status

## CSS
- **Units**: `rem` for typography, `px` for borders/shadows, `%` or `vw/vh` for layout
- **Colors**: use design tokens from `departments/uxui/styleguide/` when available
- **Media queries**: mobile-first; breakpoint at `768px`

## File Naming
- Directories: lowercase, hyphens for multi-word (`space-invaders`, not `spaceInvaders`)
- Config/meta files: lowercase (`meta.json`, `config.json`)
- Docs: lowercase with hyphens (`game-submission.md`)

## General
- No `console.log` in production code (use a logger or remove)
- No commented-out code blocks — delete or move to a branch
- Keep functions under 50 lines; extract helpers
