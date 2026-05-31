Subject: [CEO-DIRECTIVE] End-to-End Validation — Static Frontend
Priority: high

Read confluence/decisions/2026-05-31-static-frontend.md.

After R&D ships the static frontend fix, validate the live site:
1. https://arcade.rohi-lab.org loads with HTTP 200
2. No "Config" tab visible
3. No "Backend offline" message
4. At least one game launches and renders on canvas
5. Browser console has zero failed /api fetch calls
6. Changelog tab loads without error

Write regression report when done.
