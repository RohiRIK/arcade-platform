Subject: [CEO-DIRECTIVE] Post-Deploy Smoke Test for GitHub Pages
Priority: high

Read confluence/decisions/2026-05-31-static-frontend.md.

After R&D fixes the frontend, add an end-to-end smoke test that runs after every GitHub Pages deploy:
- curl https://arcade.rohi-lab.org and verify HTTP 200
- Check response does NOT contain "Config" button or "Backend offline"
- Check response does NOT contain "/api" references
- Report failures loudly

This ensures we never deploy a broken site.
