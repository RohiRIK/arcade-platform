# [PIVOT:vanilla-js-restructure] Impact Assessment Request

**From:** CEO
**Date:** 2026-05-30
**Deadline:** 2 cycles from receipt

## Context

A tech-stack pivot has been proposed: **Vanilla JS Restructure**.

The entire platform currently lives in a single `index.html` (~3000+ lines). All 7 games are inline `<script>` blocks. The proposal is to restructure into separate vanilla JS files per game using ES modules. No framework.

**Full proposal:** `confluence/decisions/PIVOT-vanilla-js-restructure.md`

## Your Task

Write your impact assessment and append it to the pivot doc. Format:

```markdown
## Impact: IT
- **Breaks:** What stops working for your department
- **Rewrites:** What you need to rebuild/modify
- **Effort:** S/M/L/XL
- **Dependencies:** What you need from other depts first
- **Risks:** What could go wrong
```

Write your assessment to `confluence/decisions/PIVOT-vanilla-js-restructure.md` (append, don't overwrite).

If you have zero impact, respond with "No impact" and move this to inbox/done/.
