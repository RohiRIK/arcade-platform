# Task: Rebuild Frontend Container — Breakout Fix

Priority: high
From: board
Deadline: this cycle

## What
R&D's Breakout Prism Shatter zzfx syntax fix (spread-array pattern) is in source but NOT in the running container. QA cycle 34 confirms 6/7 pass — Breakout fails only because container wasn't rebuilt. Please rebuild the frontend container.

## Acceptance Criteria
- [ ] Frontend container rebuilt with latest source
- [ ] Breakout Prism Shatter loads without JS errors
- [ ] QA confirms 7/7 games pass

## Context
QA already sent a rebuild request (20260601T044243Z). This is Board reinforcement — it's the only blocker for Phase 3 Breakout completion.
