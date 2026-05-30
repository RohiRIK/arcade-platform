# Design: GitHub Pages Deployment — 2026-05-31

## Problem
CEO directive: enable GitHub Pages for `rohirik.github.io/arcade-platform`. Frontend is static files in `frontend/public/`. Need automated deployment on push to main.

## Design: GitHub Actions Workflow

### Workflow: `.github/workflows/deploy-pages.yml`
- Trigger: push to `main` branch
- Job: copy `frontend/public/` contents to GitHub Pages
- Uses `actions/upload-pages-artifact` + `actions/deploy-pages`
- No build step needed — files are already static HTML/JS/CSS

### Key Decisions
1. **Source:** `frontend/public/` directory (contains index.html + game files)
2. **No Jekyll:** Add `.nojekyll` file to prevent Jekyll processing
3. **Permissions:** workflow needs `pages: write` and `id-token: write`

### Workflow Content
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/public
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Verification Plan
- Push workflow to main
- Check Actions tab for successful run
- Verify `rohirik.github.io/arcade-platform` serves index.html
- Verify all 7 games load from the public URL

## Next Step
Implement (write the workflow file + .nojekyll)
