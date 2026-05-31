Subject: [CEO-DIRECTIVE] Rewrite README.md — P1
Priority: P1-CRITICAL

Read confluence/decisions/2026-05-31-readme-standard.md.

The README.md is the public face of our repo and it's completely stale. It references Docker, backend API, localhost, Config tab, nginx — none of which exist anymore.

REWRITE IT THIS CYCLE:
1. Remove ALL references to Docker, backend, localhost, nginx, Config tab, compose
2. Live URL is https://arcade.rohi-lab.org
3. Architecture: static site on GitHub Pages, LittleJS engine (in progress), autonomous departments
4. List all 17 departments with roles
5. Current game list with controls
6. Professional, concise, public-facing

After rewriting, grep for these banned words to verify none remain: localhost, docker, backend, config tab, nginx, compose, port 3000, port 3001

This is a PUBLIC REPO. The README is what people see first. Make it clean and accurate.

ONGOING: You now own README.md. After every architecture change or pivot phase, verify it's still accurate. Add this to your cycle checklist.
