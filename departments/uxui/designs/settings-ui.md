# Design: Sound & Visual Settings UI

## Current State
```
┌──────────────────────────────────────────────────┐
│  ✨ ARCADE PLATFORM ✨                           │
│  Arcade Platform                                 │
│  ● Online — 7 games                              │
│  [Games] [Changelog]                             │
└──────────────────────────────────────────────────┘
No settings control exists. No way to mute sound or toggle motion.
```

## Proposed State
```
┌──────────────────────────────────────────────────┐
│  ✨ ARCADE PLATFORM ✨                           │
│  Arcade Platform                                 │
│  ● Online — 7 games                              │
│  [Games] [Changelog]                    [⚙️]     │
└──────────────────────────────────────────────────┘

Clicking ⚙️ opens a dropdown panel anchored to the button:

         ┌─────────────────────────────┐
         │  SETTINGS                   │
         ├─────────────────────────────┤
         │  🔊 Sound                   │
         │  ┌──────────────────────┐   │
         │  │ ████████░░░░  70%    │   │
         │  └──────────────────────┘   │
         │  [ ] Mute all sounds        │
         ├─────────────────────────────┤
         │  👁 Visual                   │
         │  [ ] Reduce motion          │
         │    (disables animations)    │
         └─────────────────────────────┘
```

## CSS/HTML Changes

### HTML Structure
Add settings button in the header, after the nav buttons:
```html
<button id="settingsBtn" class="settings-btn" aria-label="Settings" title="Settings">⚙️</button>
```

Add settings panel (hidden by default):
```html
<div id="settingsPanel" class="settings-panel hidden">
  <h3 class="settings-title">SETTINGS</h3>
  <div class="settings-section">
    <label class="settings-label">🔊 Sound</label>
    <div class="settings-slider-row">
      <input type="range" id="volumeSlider" min="0" max="100" value="70" class="settings-slider">
      <span id="volumeValue" class="settings-value">70%</span>
    </div>
    <label class="settings-checkbox">
      <input type="checkbox" id="muteToggle">
      <span>Mute all sounds</span>
    </label>
  </div>
  <div class="settings-divider"></div>
  <div class="settings-section">
    <label class="settings-label">👁 Visual</label>
    <label class="settings-checkbox">
      <input type="checkbox" id="reduceMotionToggle">
      <span>Reduce motion</span>
    </label>
    <span class="settings-hint">Disables animations and transitions</span>
  </div>
</div>
```

### CSS Selectors and Properties

```css
/* Settings button — positioned in header nav area */
.settings-btn {
  background: var(--bg-card, #1a1a2e);
  border: 1px solid var(--border, #333);
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-secondary, #888);
  transition: border-color 0.2s ease, color 0.2s ease;
  margin-left: auto; /* push to right side of nav */
}
.settings-btn:hover,
.settings-btn:focus {
  border-color: var(--accent, #e94560);
  color: var(--text-primary, #e0e0e0);
}

/* Settings panel — dropdown anchored to button */
.settings-panel {
  position: absolute;
  right: 1rem;
  top: calc(100% + 0.5rem); /* below header */
  width: 280px;
  background: var(--bg-card, #1a1a2e);
  border: 1px solid var(--border, #333);
  border-radius: 8px;
  padding: 1rem;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.settings-panel.hidden {
  display: none;
}

/* Title */
.settings-title {
  font-size: 0.85rem;
  color: var(--text-secondary, #888);
  letter-spacing: 0.1em;
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

/* Section labels */
.settings-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-primary, #e0e0e0);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

/* Volume slider row */
.settings-slider-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Range slider — accent-colored track */
.settings-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: var(--border, #333);
  border-radius: 2px;
  outline: none;
}
.settings-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent, #e94560);
  cursor: pointer;
}
.settings-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent, #e94560);
  border: none;
  cursor: pointer;
}

/* Volume percentage text */
.settings-value {
  font-size: 0.8rem;
  color: var(--text-secondary, #888);
  font-family: monospace;
  min-width: 3ch;
  text-align: right;
}

/* Checkbox labels */
.settings-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-primary, #e0e0e0);
  cursor: pointer;
  margin-bottom: 0.25rem;
}
.settings-checkbox input[type="checkbox"] {
  accent-color: var(--accent, #e94560);
  width: 16px;
  height: 16px;
}

/* Section divider */
.settings-divider {
  height: 1px;
  background: var(--border, #333);
  margin: 0.75rem 0;
}

/* Hint text */
.settings-hint {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted, #555);
  margin-top: 0.25rem;
  padding-left: 1.5rem; /* align with checkbox text */
}
```

### JavaScript Behavior (for R&D to implement)
```
- settingsBtn click: toggle .hidden on settingsPanel
- Click outside panel: close it
- volumeSlider input: update volumeValue text, save to localStorage('arcade-volume')
- muteToggle change: save to localStorage('arcade-mute'), set zzfxVolume = 0 or restored value
- reduceMotionToggle change: save to localStorage('arcade-reduce-motion'),
  add/remove class 'reduce-motion' on <html> element
- On page load: read localStorage, apply saved values
- CSS class .reduce-motion on html: same rules as prefers-reduced-motion media query
```

## Interaction Notes

- **Open/close**: Click gear toggles panel. Click anywhere outside closes it. Escape key closes it.
- **Slider feedback**: Volume percentage updates in real-time as slider moves.
- **Mute override**: When muted, slider is visually dimmed (opacity: 0.4) but retains position so unmuting restores previous volume.
- **Reduce motion**: Immediately takes effect — all CSS transitions/animations stop. Persists across sessions.
- **Mobile**: Panel becomes full-width at viewports ≤480px, anchored to bottom of header. Same content, just wider.
- **Responsive rule**:
  ```css
  @media (max-width: 480px) {
    .settings-panel {
      width: calc(100% - 2rem);
      right: 1rem;
      left: 1rem;
    }
  }
  ```
- **No transition on panel open/close** — instant show/hide. Settings are utilitarian, not decorative.

## Accessibility
- Settings button has `aria-label="Settings"` and `title="Settings"`
- Panel should have `role="dialog"` and `aria-labelledby` pointing to the title
- Focus trapped inside panel while open
- Escape closes panel and returns focus to settings button
- All controls are native HTML inputs (range, checkbox) — keyboard accessible by default
- Contrast: all text meets WCAG AA on #1a1a2e background
