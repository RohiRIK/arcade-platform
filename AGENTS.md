# AGENTS.md — Arcade Platform

## Rule 1: No Direct Code Changes (HARD RULE)

**You do NOT write, edit, or patch any code in this project. Ever.**

All work is done by the autonomous departments through the corporate pipeline:
- Write a **confluence decision** at `confluence/decisions/`
- Send **inbox messages** to the relevant departments
- Update **CEO directives** in `state.json`
- The departments pick it up on their cron cycles and execute

This applies to: frontend code, backend code, game code, CSS, HTML, JS, config files, build scripts, CI/CD workflows, and any other artifact owned by a department.

### What you CAN do:
- Edit `state.json` (directives, grades, pivot state)
- Write to `confluence/decisions/` and `confluence/` docs
- Send inbox messages to any department (`departments/<dept>/inbox/`)
- Edit `departments/CORPORATE.md` (corporate-level governance)
- Edit department `SYSTEM.md` files (prompt engineering)
- Run validation/status checks (read-only)
- Push to GitHub (the deploy pipeline)

### What you CANNOT do:
- Edit `frontend/public/` files (R&D, UX/UI own these)
- Edit game source code (R&D owns this)
- Edit CI/CD workflows (DevOps owns this)
- Edit test files (QA owns this)
- Write any code that departments should produce

### Emergency Exception:
If there is a P1-CRITICAL security issue (e.g., secrets exposed, admin panel public) AND no department cycle will run in time, you may make a direct fix. But:
1. Document it as an incident in `confluence/decisions/`
2. Notify the CEO with an explanation
3. File a directive to the owning department to properly own the fix going forward

This is a one-time exception pattern, not a workflow.

## Project Structure

| Path | Owner | Purpose |
|------|-------|---------|
| `departments/*/SYSTEM.md` | CEO/CTO | Department prompts |
| `departments/*/inbox/` | CEO/Board | Directives and tasks |
| `departments/*/outbox/` | Department | Reports and deliverables |
| `confluence/decisions/` | CEO/Board | Architectural decisions |
| `state.json` | CEO | Corporate state, grades, directives |
| `frontend/public/` | R&D, UX/UI | Static site (GitHub Pages) |
| `departments/CORPORATE.md` | Board | Corporate governance rules |

## Deployment

- GitHub Pages at https://arcade.rohi-lab.org
- Auto-deploy cron pushes to GitHub every 2h at :45
- Push to `main` triggers `.github/workflows/deploy-pages.yml`
- No backend — pure static site

## How to Get Work Done

1. Write a confluence decision describing WHAT needs to change and WHY
2. Send inbox messages to the departments that need to act
3. Update CEO directives in state.json
4. Wait for department cron cycles to pick up and execute
5. QA validates, CEO inspects
