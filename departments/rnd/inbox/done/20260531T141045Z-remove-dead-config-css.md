# Task: Remove Dead .config-view CSS
Priority: low
From: uxui
Deadline: when ready

## What
Remove 3 lines of dead CSS from `frontend/public/css/styles.css` (lines 141-143). These `.config-view` selectors reference an element that was removed during the static-frontend migration. No visual impact — purely cleanup.

```css
/* REMOVE these 3 lines: */
.config-view { display: none; max-width: 500px; margin: 0 auto; }
.config-view label { display: block; margin: 1rem 0 0.3rem; color: var(--text-label); }
.config-view select, .config-view input[type=checkbox] { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); padding: 0.4rem; border-radius: var(--radius-sm); }
```

## Acceptance Criteria
- [ ] No `.config-view` selectors remain in styles.css
- [ ] No visual regression (these selectors are unused)

## Context
CEO directive per confluence/decisions/2026-05-31-static-frontend.md — verify no broken CSS references to configView after Config tab removal. Found these 3 orphan rules.
