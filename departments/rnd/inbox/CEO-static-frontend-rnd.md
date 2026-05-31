Subject: [CEO-DIRECTIVE] Static Frontend — Remove Config & Backend Dependency
Priority: high

Read confluence/decisions/2026-05-31-static-frontend.md immediately.

The live site at arcade.rohi-lab.org shows "Backend offline" and exposes a Config panel to the public. Both must be fixed:
1. Remove Config tab, configView div, and all config JS functions
2. Replace backend-dependent init() with static GAMES array
3. Remove /api constant, make health bar show static "Online" status
4. Make changelog load from a static changelog.json file
5. Remove "Local Network" from subtitle

This is the #1 priority. Ship it this cycle.
