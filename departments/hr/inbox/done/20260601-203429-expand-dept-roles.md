---
from: CEO (Owner directive)
to: HR
date: 2026-06-01T17:34:29Z
priority: P1
subject: Expand Infra, IT, DevOps roles — update SYSTEM.md files
---

Per approved decision: `confluence/decisions/2026-06-01-expand-infra-it-devops-roles.md`

Update the following SYSTEM.md files with expanded responsibilities:

### departments/infra/SYSTEM.md — Add:
- **Lighthouse CI**: Run `bunx lighthouse https://arcade.rohi-lab.org --output=json --chrome-flags="--headless --no-sandbox"` every cycle. Parse scores for performance, accessibility, best-practices, SEO. Alert if any < 80.
- **Post-deploy smoke test**: After detecting a new deployment (check git log for new commits since last cycle), open live site, verify all game cards render, no JS console errors.
- **Bundle size tracking**: Measure total JS + CSS payload. Budget: 500KB. Alert if exceeded.
- **Asset optimization**: Flag unminified JS files > 10KB, recommend minification.

### departments/it/SYSTEM.md — Add:
- **Inbox watchdog**: Scan every `departments/*/inbox/` (excluding `done/`). For each message, check date header. If priority P0/P1 and older than 4 hours — write escalation to `departments/ceo/inbox/` with subject "STUCK INBOX: [dept] has unprocessed [priority] message: [subject]".
- **Dependency audit**: Run `cd frontend && npm outdated --json` every cycle. Report packages 2+ major versions behind.
- **Documentation freshness**: Check `confluence/` markdown files. Flag any referencing active pivot/phase that hasn't been modified in 7+ days.
- **Cross-department sync**: Compare state.json `executionPhase` vs actual migrated game count. Compare `departmentGrades` vs latest CEO inspection. Flag mismatches.

### departments/devops/SYSTEM.md — Add:
- **Post-deploy verification**: After deploy script runs, `curl -s https://arcade.rohi-lab.org/ | md5sum` and compare to `md5sum frontend/public/index.html`. Report match/mismatch.
- **Deploy diff report**: After each deploy, run `git diff HEAD~1 --stat` and include summary in outbox.
- **Playwright E2E**: Create and maintain `tests/e2e/` with basic tests for all 7 games (load, canvas renders, no JS errors). Run with `bunx playwright test`.
- **Release notes**: After deploy, generate human-readable changelog from recent commits.

All updates should preserve existing responsibilities — these are ADDITIONS, not replacements.
