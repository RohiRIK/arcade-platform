# DECISION: Static-Only Frontend & GitHub Pages Deployment

**Date:** 2026-05-31
**Author:** CEO (Board directive)
**Status:** Active
**Priority:** High
**Affects:** R&D, DevOps, QA, Security, UX/UI, PM

## Context

The Arcade Platform is now deployed as a static site on GitHub Pages at https://arcade.rohi-lab.org. There is NO backend server — GitHub Pages serves static HTML/CSS/JS only.

The current frontend was built assuming a backend API (`/api/games`, `/api/health`, `/api/logs`, `/api/config`). This backend does not exist in production and will not exist. The site must work 100% without any backend.

## Problems to Fix

### 1. Remove Config Section (SECURITY — HIGH PRIORITY)
The "Config" tab exposes self-improvement configuration controls (enable/disable, mode, scope). This is an internal system concern and must NOT be visible to public visitors.

- Remove the "Config" button from the navigation bar
- Remove the entire `configView` div (the form with checkbox, select, text input)
- Remove all JS functions: `loadConfig()`, `saveConfig()`
- Remove the `config` case from `showSection()`

### 2. Remove Backend Dependency (FUNCTIONAL — HIGH PRIORITY)
The site shows "Backend offline" because `init()` tries to fetch `/api/games` and `/api/health` which don't exist.

- Replace the `init()` function: use a static `GAMES` array instead of fetching from `/api/games`
- Remove the `/api` constant entirely
- Health bar should show static status (e.g., "● Online" + game count), NOT try to reach a backend
- Changelog (`loadLogs()`) should load from a static `changelog.json` file instead of `/api/logs`
- Remove "Local Network" from the subtitle — this is a public site now

### 3. Create Static changelog.json
Create `frontend/public/changelog.json` — a JSON array of `{date, title, description}` entries that the Changelog tab reads. PM should populate this from their changelogs when they update.

### 4. End-to-End Smoke Test After Deploy
After every push that triggers a GitHub Pages deploy, QA must verify the live site works:
- https://arcade.rohi-lab.org loads without errors
- No "Backend offline" message
- No "Config" tab visible
- At least one game launches and renders
- No console errors related to failed API calls
- Changelog tab loads without error

DevOps should add this as a post-deploy verification step. This can be a simple curl + content check in the deploy pipeline or a QA checklist item.

## Files Affected
- `frontend/public/index.html` — main file (all changes are here)
- `frontend/public/changelog.json` — new file (static changelog data)

## Constraints
- NO backend, NO API calls, NO server-side anything
- Site must work as pure static files on GitHub Pages
- No sensitive configuration exposed to public visitors
- Games list is hardcoded until we have a build step that generates it

## Department Responsibilities

| Department | Task |
|------------|------|
| R&D | Implement all code changes in index.html (remove config, remove backend, static init) |
| UX/UI | Review that the UI is clean after config removal, no dead buttons or broken layout |
| DevOps | Add post-deploy smoke test to verify live site works |
| QA | Validate end-to-end: load site, check no config, check games work, check no API errors |
| Security | Verify no config/admin controls are exposed to public |
| PM | Create initial changelog.json content from existing changelogs, maintain it going forward |
