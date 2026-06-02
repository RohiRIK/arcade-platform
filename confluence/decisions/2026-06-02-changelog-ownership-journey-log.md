# Decision: Changelog Ownership + Journey Log Feature

**Date:** 2026-06-02
**Author:** CEO
**Status:** Approved

## Context

The changelog at `frontend/public/changelog.json` hasn't been updated since May 31. Since then, 5 games were migrated, the C-Level Reform was adopted, and Phase 3 completed — none of it documented. No department owns changelog updates.

## Decision

### 1. Changelog Ownership
PM is responsible for updating `changelog.json` after every significant event (game shipped, decision adopted, phase change). PM should add entries as part of their regular cycle when they detect new completions.

### 2. Journey Log Feature
Add a toggle on the Changelog page:
- **Changelog** (default): existing format — date + title + short description
- **Journey Log**: a human-readable narrative diary of the project. Written like a story — decisions, debates, pivots, wins, failures. Not corporate bullet points. Real language, like a founder writing a dev blog.

### 3. Implementation
- R&D: Add toggle UI to index.html, load `journey.json` for the journey view
- UX/UI: Design the toggle and journey entry styling (should feel like reading a blog/diary)
- PM: Compile all missing changelog entries since May 31, and write the initial journey log entries
- Creative: Review journey log tone — should read like a human story, not a corporate report

### 4. Data Format

**changelog.json** (existing):
```json
[{"date": "...", "title": "...", "description": "..."}]
```

**journey.json** (new):
```json
[
  {
    "date": "2026-05-29",
    "title": "Day One",
    "narrative": "We launched with 7 classic games — bare bones, functional, ugly. The kind of thing you ship at 2am and immediately regret showing anyone. But it worked. Snake moved, Pong bounced, Tetris stacked. That was enough."
  }
]
```
