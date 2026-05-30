# 🕹️ Arcade Platform

Local-network arcade platform with self-improvement capabilities.

## Quick Start

```bash
docker compose up -d --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health**: http://localhost:3001/api/health

## Games
- 🐍 Snake — Arrow keys, R to restart
- 🏓 Pong — Arrow Up/Down vs CPU
- 🧱 Breakout — Arrow Left/Right, R to restart
- 🟦 Tetris — Arrow keys to move/rotate, Down to soft drop, R to restart
- 👾 Space Invaders — Arrow Left/Right to move, Space to shoot, R to restart
- 🟡 Pac-Man — Arrow keys to navigate maze, eat dots, avoid ghosts, R to restart
- 🐸 Frogger — Arrow keys to cross road and river, reach 5 homes, R to restart

## Architecture
- **Frontend**: Static HTML/JS served by nginx (port 3000)
- **Backend**: Node.js/Express API (port 3001) — game registry, health, logs, config
- **Self-improvement**: Hermes cron job runs every 2h, analyzes and improves the platform

## Config
Edit `backend/config.json` or use the web UI Config tab:
- `enabled`: toggle self-improvement
- `mode`: `apply` (make changes) or `analyze` (report only)
- `scope`: array of `games`, `ui`, `infra`, `docs`

## Department Structure
This platform is maintained by autonomous departments on a 2-hour cycle:

| Dept | Role | Artifacts |
|------|------|-----------|
| **Board** | Strategy, coordination, risk | `departments/board/minutes/` |
| **R&D** | Research, pitch, spec, build games | `departments/rnd/` |
| **Infra** | Docker, monitoring, ops | `departments/infra/` |
| **UX/UI** | Design system, UI improvements | `departments/uxui/` |
| **PM** | Docs, changelogs, standards | `departments/pm/` |
| **CEO** | Oversight, grading, directives | `departments/ceo/` |

Cross-department communication via inbox files. State coordination via `state.json`.

## Adding a Game
See `departments/pm/standards/game-submission.md` for the full checklist. Summary:
1. Complete the R&D pipeline: research → pitch → spec
2. Create `backend/src/games/<name>/meta.json`
3. Add game logic to `frontend/public/index.html` (or as separate JS)
4. Register in the ICONS map and launchGame switch
5. Rebuild: `docker compose up -d --build`
