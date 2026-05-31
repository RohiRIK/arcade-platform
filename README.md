# 🕹️ Arcade Platform

A browser-based arcade with 7 classic games, built and maintained by 17 autonomous AI departments.

**▶ Play now:** [arcade.rohi-lab.org](https://arcade.rohi-lab.org)

## Games

| Game | Controls |
|------|----------|
| 🐍 Snake (Neon Serpent) | Arrow keys, R to restart |
| 🏓 Pong | Arrow Up/Down vs CPU, R to restart |
| 🧱 Breakout | Arrow Left/Right, R to restart |
| 🟦 Tetris | Arrow keys to move/rotate, Down to soft drop, R to restart |
| 👾 Space Invaders | Arrow Left/Right to move, Space to shoot, R to restart |
| 🟡 Pac-Man | Arrow keys to navigate maze, R to restart |
| 🐸 Frogger | Arrow keys to cross road and river, R to restart |

## Architecture

- **Static site** hosted on GitHub Pages — no server, no API
- **LittleJS** game engine (migration in progress — Snake complete, Pong next)
- **GitHub Actions** for CI/CD (auto-deploy on push to `main`)
- Games are vanilla JS on HTML5 Canvas (600×400)

## How It Works

This platform is built and evolved by **17 autonomous AI departments** running on staggered 2-hour cron cycles. Each department has a defined role, pipeline, and communication protocol. The CEO inspects output and sets direction. Departments coordinate through inbox messages and shared state.

| Dept | Role |
|------|------|
| **CEO** | Oversight, grading, directives |
| **CTO** | Architecture review, technical standards |
| **CPO** | Product quality enforcement |
| **CFO** | Budget tracking, resource allocation |
| **CISO** | Security policy, compliance |
| **Board** | Strategy, coordination, risk synthesis |
| **R&D** | Research, pitch, spec, build games |
| **UX/UI** | Design system, UI, CSS, accessibility |
| **QA** | Testing, regression, quality bar |
| **DevOps** | CI/CD pipelines, deployment |
| **Infra** | Monitoring, container health |
| **Security** | Vulnerability scanning, audits |
| **IT** | File structure, naming compliance, scans |
| **PM** | Documentation, changelogs, standards |
| **Analytics** | Metrics, artifact tracking, reports |
| **Creative** | Game feel, sound design, visual identity |
| **HR** | (Provisioned) |

## Current Pivot: Arcade Evolution

Migrating all 7 games from a monolith to modular LittleJS-powered rewrites with creative polish (sound, particles, progression, unique identity per game). Phase 2 (Snake) complete. Phase 3 (Pong) in progress.

## Tech Stack

- [LittleJS](https://github.com/KilledByAPixel/LittleJS) — 15KB game engine
- GitHub Pages — static hosting
- GitHub Actions — CI/CD
- zzfx — procedural sound effects

## Project Structure

| Path | Purpose |
|------|---------|
| `frontend/public/` | Static site (HTML, CSS, JS, games) |
| `departments/*/` | Department workspaces (SYSTEM.md, inbox, logs) |
| `confluence/` | Decisions, technical docs, runbooks |
| `state.json` | Shared coordination state |

## Adding a Game

See `departments/pm/standards/game-submission.md` for the full checklist. Games go through the R&D pipeline: research → pitch → spec → build → QA regression.

## License

MIT
