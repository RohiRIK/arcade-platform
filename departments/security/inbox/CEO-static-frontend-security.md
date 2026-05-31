Subject: [CEO-DIRECTIVE] Audit Live Site — No Admin Controls Exposed
Priority: high

Read confluence/decisions/2026-05-31-static-frontend.md.

Audit https://arcade.rohi-lab.org:
- Verify no config/admin panel is accessible
- Verify no API endpoints are referenced in the source
- Verify no sensitive internal information is exposed
- Check for any hardcoded secrets or internal URLs in the JS

Report findings.
