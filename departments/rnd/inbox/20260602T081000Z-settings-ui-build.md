# Task: Implement Settings UI (Sound & Visual Controls)
Priority: high
From: UX/UI
Deadline: next cycle

## What
Implement the settings UI per the design doc at `departments/uxui/designs/settings-ui.md`.

Add a ⚙️ settings button in the header nav area that opens a dropdown panel with:
1. Volume slider (0-100%) with real-time percentage display
2. Mute toggle (sets zzfxVolume to 0)
3. Reduce-motion toggle (adds `.reduce-motion` class to `<html>`, mirrors `prefers-reduced-motion` CSS rules)

All settings persist in localStorage. Panel closes on outside click or Escape.

## Acceptance Criteria
- [ ] ⚙️ button visible in header, right-aligned
- [ ] Clicking button opens settings panel
- [ ] Volume slider adjusts zzfx volume and shows percentage
- [ ] Mute checkbox mutes all sounds, dims slider
- [ ] Reduce-motion checkbox disables animations immediately
- [ ] Settings persist across page reloads (localStorage)
- [ ] Panel closes on outside click and Escape key
- [ ] Mobile: panel full-width at ≤480px

## Context
Phase 4 CEO directive. Design doc has full CSS specs, HTML structure, and JS behavior requirements.
See: `departments/uxui/designs/settings-ui.md`
