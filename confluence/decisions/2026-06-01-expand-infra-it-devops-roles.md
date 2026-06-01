# Decision: Expand Infra, IT, and DevOps Roles

**Date:** 2026-06-01T17:33:15Z
**Author:** CEO (Owner directive)
**Status:** APPROVED
**Affects:** Infra, IT, DevOps departments

## Context

Infra, IT, and DevOps are underutilized. The platform is a static GitHub Pages site with minimal infrastructure needs. These departments run every 2 hours but mostly report "all nominal" — burning tokens on repetitive checks with no actionable output.

Meanwhile, critical gaps exist: no performance monitoring, no post-deploy verification, no inbox watchdog (HR inbox was stuck for a week unnoticed), no dependency tracking, no documentation freshness checks.

## Decision

Expand each department's charter with new responsibilities that fill real gaps:

### Infra → Infra & Performance
New responsibilities (in addition to existing health/monitoring):
1. **Lighthouse CI** — Run Lighthouse audit on https://arcade.rohi-lab.org every cycle. Track performance, accessibility, best-practices, SEO scores. Alert if any score drops below 80.
2. **Post-deploy smoke test** — After any deploy is detected (new commit on main), open the live site and verify all 7 games load (canvas renders, no JS errors). Report any regression immediately as P1.
3. **Bundle size tracking** — Measure total JS/CSS payload size. Set budget (e.g., 500KB total). Alert if exceeded.
4. **Asset optimization recommendations** — Flag unminified JS, uncompressed assets, unused CSS.

### IT → IT & Operations Intelligence
New responsibilities (in addition to existing repo structure scans):
1. **Inbox watchdog** — Every cycle, scan ALL department inboxes. If any message with priority P0 or P1 has been sitting unprocessed for 2+ cycles (4+ hours), escalate to CEO via inbox with the stuck message details.
2. **Dependency audit** — Run `npm outdated` on frontend. Report packages that are 2+ major versions behind. Flag any with known CVEs (cross-reference with `npm audit`).
3. **Documentation freshness** — Scan confluence/ docs. Flag any document not updated in 7+ days that references active work (e.g., pivot phases, current sprint).
4. **Cross-department sync validation** — Compare state.json fields (executionPhase, grades, directives) against actual repo state. Flag discrepancies (e.g., state says Phase 2 but 5 games are migrated).

### DevOps → DevOps & Release Engineering
New responsibilities (in addition to existing CI/CD):
1. **Post-deploy verification** — After every git push, verify the GitHub Pages deployment succeeded by checking the live site within 10 minutes. Compare deployed index.html hash against local.
2. **Deploy diff report** — After each deploy, report what changed (files modified, lines added/removed, which games affected).
3. **Playwright E2E foundation** — Build and maintain a basic Playwright test suite that tests all 7 games load and respond to input. Run after every deploy.
4. **Release notes** — After each deploy, generate a human-readable changelog of what shipped.

## Implementation

HR will update each department's SYSTEM.md with the new responsibilities. Departments pick up the changes on their next cycle.

## Success Criteria
- Infra reports Lighthouse scores every cycle
- IT catches stuck inbox messages within 4 hours
- DevOps verifies every deploy within 10 minutes
- Zero "all nominal, nothing to do" cycles — every cycle produces actionable data
