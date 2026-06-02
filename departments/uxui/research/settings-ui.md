# Research: Sound & Visual Settings UI

## Problem
The platform has no user-facing settings. Games have zzfx sound effects and animations, but users cannot:
- Mute or adjust volume
- Toggle reduced-motion preference (beyond OS-level `prefers-reduced-motion`)
- These are basic accessibility and comfort controls expected in any game platform

## Inspiration

### Reference 1: itch.io Game Pages
Simple gear icon that opens a small dropdown. Volume slider + fullscreen toggle. Minimal, doesn't leave the game context. Clean dark UI.

### Reference 2: RetroArch Quick Menu
Overlay settings panel that slides in from the right. Grouped sections (Audio, Video, Controls). Toggle switches and sliders. Dark background with subtle section dividers.

### Reference 3: Steam Deck Quick Access Menu
Floating panel with icon-labeled controls. Brightness slider, volume slider, performance toggle. Uses system accent color for active states. Compact, doesn't obstruct content.

## Current State
- No settings UI exists
- `prefers-reduced-motion` CSS media query is already implemented (kills animations)
- zzfx sounds play at default volume with no user control
- No localStorage persistence for preferences

## Proposed Approach
- Add a ⚙️ settings button to the header area (near nav)
- Opens a small settings panel (not a full page — modal or dropdown)
- Two sections:
  1. **Sound**: Volume slider (0-100%), mute toggle
  2. **Visual**: Reduced-motion toggle (overrides OS preference)
- Settings persist in localStorage
- Panel uses existing design language (card bg, accent colors, 8px radius)
- Compact: max-width 320px, positioned relative to the gear button
