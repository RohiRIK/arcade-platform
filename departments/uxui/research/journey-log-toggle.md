# Research: Journey Log Toggle & Entry Styling

## Problem
The Changelog section currently shows a single view (date + title + description entries). A new "Journey Log" view is being added — a personal narrative diary of the project's evolution. The toggle between Changelog and Journey views needs to feel native to the arcade aesthetic, and journey entries need distinct styling that signals a shift in tone from technical changelog to personal storytelling.

## Inspiration

### Reference 1: Hades II Dev Blog (Supergiant Games)
Supergiant uses a simple pill-toggle between "Updates" and "Dev Notes." The dev notes have wider line-width, more breathing room, and a slightly warmer background. The tone shift is signaled through typography — serif for narrative, sans-serif for technical. Effective because the UI change is minimal but the reading experience feels distinctly different.

### Reference 2: Celeste Developer Commentary
In-game commentary entries use a subtle background shift (darker, slightly blue-tinted) with a handwritten-style font. Entries have generous paragraph spacing (1.5em+) and max-width constrained to ~60ch for readability. Feels intimate and personal.

### Reference 3: Arcade Cabinet "Story Mode" Screens
Classic arcade story screens (Metal Slug mission briefings, Neo Geo intros) use monospace text on a slightly different background shade, with text appearing line-by-line. The key design element: a border or frame that differentiates "gameplay" from "narrative" without leaving the arcade context.

## Current State
- Changelog tab shows `.log-entry` divs with accent-colored headings and monospace pre content
- Navigation uses pill-style buttons (`nav-btn`) with active state (accent bg, white text)
- No toggle mechanism exists within a section — only top-level nav (Games / Changelog)

## Proposed Approach

### Toggle Design
- Sub-navigation within the Changelog section: two small pill buttons ("📋 Changelog" / "📖 Journey")
- Same visual language as main nav but smaller scale (0.7rem text, tighter padding)
- Active state matches main nav (accent bg + white text)
- Position: below main nav, left-aligned, with 1rem top margin

### Journey Entry Styling
- Background: `#16213e` (slightly lighter than card bg `#1a1a2e`) — signals "different context"
- Max-width: `680px` (narrower than changelog for comfortable reading, ~65ch)
- Typography: keep system-ui but bump to `1rem` line-height `1.7` for readability
- Paragraph spacing: `1rem` between paragraphs in narrative text
- Title styling: larger (1.3rem), accent color, with date as subtle muted text above
- Border-left: 3px solid accent (`#e94560`) — visual anchor, like a pull-quote or blog post marker
- No monospace — this is prose, not code

### Transition
- Simple opacity fade (0.2s) when toggling between views
- Content swap, not scroll — one view visible at a time
