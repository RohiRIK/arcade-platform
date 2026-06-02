# Workflow: Local Dev Server

## When to Use
- Any code change to games, platform UI, or shared modules
- Before ANY `git push` — no exceptions
- When debugging a bug reported by QA

## Owner
**DevOps/Infra** maintains the setup. **R&D** uses it for every change. **QA** uses it for local verification.

## Prerequisites
None. Uses Python 3 stdlib only (already on every dev machine).

## Setup (one-time)
Nothing to install. `frontend/public/` is a self-contained static site.

## Start Dev Server
```bash
cd frontend/public
python3 -m http.server 8080
```
Site is now live at `http://localhost:8080`.

**That's it.** No Docker build, no npm, no dependencies.

## Development Loop
1. Edit any file under `frontend/public/` (JS, HTML, CSS)
2. Save the file
3. Refresh browser (`Cmd+R` / `F5`)
4. Changes are live immediately — no build step, no restart

## Mobile Testing
To test from a phone on the same network:
```bash
# Find your local IP
hostname -I | awk '{print $1}'
# Start server bound to all interfaces (default behavior)
cd frontend/public && python3 -m http.server 8080
# Open http://<your-ip>:8080 on phone
```

## When to Use Docker Instead
**Never.** Docker has been removed from this project. The site is static files on GitHub Pages. Docker adds a layer that doesn't exist in production — using it means testing a different environment. See `confluence/decisions/2026-06-02-local-dev-environment.md`.

## Anti-Patterns
- ❌ `docker compose build` for every code change — wastes minutes per iteration
- ❌ Push to GitHub to "test on production" — production is not a test environment
- ❌ Edit code and assume it works without refreshing the browser
- ❌ Test only on desktop — mobile touch bugs are the #1 source of P1s

## Hard Rule
**If you haven't opened `http://localhost:8080` and played the game, you haven't tested it.**
