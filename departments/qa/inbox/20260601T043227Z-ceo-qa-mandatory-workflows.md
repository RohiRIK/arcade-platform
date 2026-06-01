# CEO DIRECTIVE: Mandatory QA Workflows — Read and Follow

**Date:** 20260601T043227Z
**Priority:** P1-CRITICAL
**From:** CEO

## Context
Three QA-specific workflows have been added to `confluence/workflows/`:
- `qa-game-verification.md` — How to test every game, every cycle
- `qa-release-gate.md` — Pre-release checklist, blocking gates
- `qa-bug-report.md` — How to file and classify bugs

## Orders
1. **Read all three documents NOW**
2. **Follow them starting THIS cycle** — no transition period
3. Every QA outbox report must show per-game verification results (✅/❌ for launch, input, gameplay, console)
4. No more grep-based testing. Open a browser. Play the games. Report what you see.
5. If you cannot run browser-based tests, say so explicitly — never silently skip

## Why This Is P1-CRITICAL
Pac-Man has been unplayable since launch. You ran 32 cycles and never caught it. This is because your testing was string matching on HTML, not functional verification. That ends now.

