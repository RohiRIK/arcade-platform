# Design: Journey Log Toggle & Entry Styling

## Current State
```
┌──────────────────────────────────────────┐
│  [Games] [Changelog]                     │
├──────────────────────────────────────────┤
│ ┌────────────────────────────────────┐   │
│ │ 2026-06-01 — Phase 3 Complete      │   │
│ │ All 7 games migrated to neon...    │   │
│ └────────────────────────────────────┘   │
│ ┌────────────────────────────────────┐   │
│ │ 2026-05-31 — Static Migration      │   │
│ │ Moved to GitHub Pages...           │   │
│ └────────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

## Proposed State
```
┌──────────────────────────────────────────┐
│  [Games] [Changelog]                     │
├──────────────────────────────────────────┤
│  [📋 Changelog] [📖 Journey]            │
│                                          │
│  ── Journey View ──                      │
│                                          │
│  ┌─╴ 2026-05-29                          │
│  │                                       │
│  │  Day One                              │
│  │                                       │
│  │  We launched with 7 classic games     │
│  │  — bare bones, functional, ugly.      │
│  │  The kind of thing you ship at 2am    │
│  │  and immediately regret showing       │
│  │  anyone. But it worked.               │
│  │                                       │
│  ┌─╴ 2026-05-30                          │
│  │                                       │
│  │  The Pivot                            │
│  │                                       │
│  │  We looked at what we'd built and     │
│  │  decided it wasn't enough. Games      │
│  │  worked but they didn't feel like     │
│  │  anything...                          │
│  │                                       │
└──────────────────────────────────────────┘
```

## CSS/HTML Changes

### 1. Sub-Toggle Container (`.changelog-toggle`)
```css
.changelog-toggle {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0 1.5rem 0;
}

.changelog-toggle .toggle-btn {
  background: var(--bg-card, #1a1a2e);
  color: #ccc;
  border: 1px solid #333;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.changelog-toggle .toggle-btn:hover {
  border-color: var(--accent, #e94560);
  color: #fff;
}

.changelog-toggle .toggle-btn.active {
  background: var(--accent, #e94560);
  color: #fff;
  border-color: var(--accent, #e94560);
}
```

### 2. Journey Entry (`.journey-entry`)
```css
.journey-entry {
  background: #16213e;
  border-left: 3px solid var(--accent, #e94560);
  border-radius: 0 8px 8px 0;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  max-width: 680px;
}

.journey-entry .journey-date {
  font-size: 0.75rem;
  color: var(--text-muted, #555);
  font-family: monospace;
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
}

.journey-entry .journey-title {
  font-size: 1.3rem;
  color: var(--accent, #e94560);
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.journey-entry .journey-narrative {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-primary, #e0e0e0);
  white-space: pre-wrap;
}

.journey-entry .journey-narrative p {
  margin-bottom: 1rem;
}
```

### 3. View Switching
```css
.changelog-view,
.journey-view {
  transition: opacity 0.2s ease;
}

.changelog-view.hidden,
.journey-view.hidden {
  display: none;
}
```

### 4. Mobile Responsive
```css
@media (max-width: 768px) {
  .journey-entry {
    padding: 1rem 1.25rem;
    max-width: 100%;
  }
}
```

## HTML Structure
Inside the `changelogView` section, add before the log entries:

```html
<div class="changelog-toggle">
  <button class="toggle-btn active" onclick="showChangelog()">📋 Changelog</button>
  <button class="toggle-btn" onclick="showJourney()">📖 Journey</button>
</div>
<div class="changelog-view" id="changelogEntries">
  <!-- existing changelog entries -->
</div>
<div class="journey-view hidden" id="journeyEntries">
  <!-- journey entries loaded from journey.json -->
</div>
```

## Interaction Notes
- Toggle buttons use same active-state pattern as main nav (accent bg + white text)
- Only one view visible at a time — `hidden` class toggles `display: none`
- Journey entries have no hover effects — they're for reading, not clicking
- Reduced-motion: entrance animation already killed by existing media query; opacity transition is 0.2s (acceptable)
- The border-left accent line gives visual continuity — like a vertical timeline

## R&D Coordination
R&D needs to implement the JS toggle logic and journey.json loading. UX/UI provides the CSS and HTML structure. Per inbox `20260602-changelog-journey-toggle.md`, R&D already has this task.
