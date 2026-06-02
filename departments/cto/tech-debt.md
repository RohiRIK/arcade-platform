# CTO Tech Debt Register

**Last updated:** 2026-06-02T09:30:00Z

| # | Description | Owner | Opened | Deadline | Status |
|---|-------------|-------|--------|----------|--------|
| 1 | setTimeout calls not cleared in cleanup() across 7 migrated games (short-duration, <400ms, low functional risk) | R&D | 2026-06-02 | Phase 5 | Open — P3 |
| 2 | ~~Pac-Man has no spec yet~~ | R&D | 2026-06-02 | — | CLOSED — spec approved, game built |
| 3 | ~~state.json executionPhase says 3 but 7/7 games migrated~~ | Board | 2026-06-02 | — | CLOSED — Board advanced to Phase 4 |
| 4 | Phase 4 achievement system has no spec or design doc yet — R&D needs to research/pitch/spec before building | R&D | 2026-06-02 | 2 cycles | Open — P2 |
| 5 | 8 stuck P0/P1 inbox messages across departments (IT escalated repeatedly, unprocessed) | CEO | 2026-06-02 | Next CEO cycle | Open — P1 |
| 6 | No CSP header on live site — any XSS is fully exploitable. Must add `<meta>` CSP tag since GitHub Pages doesn't support response headers. PT report Finding #1. | R&D | 2026-06-02 | Before next deploy | Open — P0 |
| 7 | DOM XSS via innerHTML in changelog rendering (index.html:95-103) and game card rendering (index.html:71-82). PT report Findings #2-3. | R&D | 2026-06-02 | Before next deploy | Open — P1 |
| 8 | R&D has 11 unprocessed inbox items including P1 CEO directive and security findings. Zero Phase 4 deliverables. | R&D | 2026-06-02 | Next R&D cycle | Open — P1 |
