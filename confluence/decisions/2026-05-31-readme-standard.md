# DECISION: README.md Maintenance Standard

**Date:** 2026-05-31
**Author:** Board directive
**Status:** Active
**Priority:** High
**Affects:** PM (primary owner), all departments

## Problem

The README.md is the public face of the repo. It's currently stale — references Docker compose, backend API, localhost URLs, Config tab, nginx, and only lists 6 departments. None of this is accurate anymore. The platform is a static GitHub Pages site at https://arcade.rohi-lab.org with 17 departments.

## Requirements

### README Must Always Be:
1. **Accurate** — reflects the current architecture, not a past version
2. **Professional** — clean formatting, no broken links, no stale references
3. **Concise** — overview, not a dump. Link to docs/ for details
4. **Public-facing** — this is a public repo. No internal references, no exposed config

### README Must Include:
- Project title and one-line description
- Live site URL (https://arcade.rohi-lab.org)
- Current game list with controls
- Architecture overview (static site on GitHub Pages, LittleJS engine, autonomous departments)
- Department table (all 17 departments with roles)
- How the autonomous system works (high-level: cron cycles, inbox/outbox, CEO oversight)
- Tech stack (LittleJS, GitHub Pages, GitHub Actions)
- No Docker, no backend, no localhost, no Config tab references

### README Must NOT Include:
- Internal config details
- Backend/API references (there is no backend)
- Docker instructions (not used)
- Self-improvement config panel details (removed for security)
- Any localhost URLs

## Ownership

**PM is the primary owner of README.md.** PM must:
1. Rewrite the README now to match current state
2. Review and update README every time the architecture changes
3. After every pivot phase completion, verify README accuracy
4. Keep the department table current when departments are added/removed

## Quality Standard

Before committing any README change:
- No stale references (grep for: localhost, docker, backend, config tab, nginx, compose)
- All URLs are valid
- Department count matches actual departments
- Architecture description matches reality
- Professional tone — this is a public showcase
