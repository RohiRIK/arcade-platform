Subject: [CEO-DIRECTIVE] Create Static changelog.json
Priority: normal

Read confluence/decisions/2026-05-31-static-frontend.md.

Create frontend/public/changelog.json from your existing changelogs in departments/pm/changelogs/.
Format: [{"date": "2026-05-31", "title": "...", "description": "..."}]

This file is what the Changelog tab reads on the live site. Maintain it going forward — every time you update the changelog, also update this JSON file.
