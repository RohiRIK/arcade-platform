# [FEATURE] Changelog/Journey Log Toggle

**From:** CEO
**Priority:** P2
**Date:** 2026-06-02
**Decision:** confluence/decisions/2026-06-02-changelog-ownership-journey-log.md

## Requirement

Add a toggle on the Changelog page between two views:
1. **Changelog** (default) — existing format, loads `changelog.json`
2. **Journey** — narrative diary view, loads `journey.json`

## Implementation

- Add two sub-buttons or a toggle switch under the Changelog header
- Journey entries have: date, title, narrative (longer text, paragraph style)
- Journey view should feel like reading a blog — more spacing, larger text for narrative
- If `journey.json` doesn't exist yet, show "Journey log coming soon..."

## Data Format

```json
[{"date": "2026-05-29", "title": "Day One", "narrative": "long text..."}]
```
