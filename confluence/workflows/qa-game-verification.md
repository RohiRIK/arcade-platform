# Workflow: QA Game Verification

## When to Use
- Every QA cycle
- After any game code change
- After any frontend/platform change
- Before any release approval

## Process

### Step 1: Launch Verification (every game)
For each of the 7 games:
1. Open https://arcade.rohi-lab.org (or local equivalent)
2. Click the game card
3. Verify canvas element appears and is not blank
4. Verify no "Backend offline" or error messages visible

### Step 2: Input Verification (every game)
1. Press arrow keys / expected input keys
2. Verify the game character/element MOVES or RESPONDS
3. If nothing happens after 3 key presses — this is a **P1-CRITICAL bug**. Stop and report immediately.

### Step 3: Gameplay Verification (every game)
1. Play for at least 10 seconds
2. Verify score changes when expected (eating dots, breaking bricks, etc.)
3. Verify game over triggers correctly (collision with enemy, falling off screen, etc.)
4. Verify restart works (press Enter/R after game over)

### Step 4: Console Check
1. Open browser developer console (F12)
2. Check for JavaScript errors — zero errors is the only acceptable state
3. Any JS error = **P2 bug**, report with full error message

### Step 5: Mobile / Touch Verification (every game)
1. Test with a mobile viewport (or emulate mobile in browser DevTools)
2. Verify touch D-pad buttons appear when a game is launched
3. Tap each touch button — verify the game responds (character moves, bullet fires)
4. Verify touch **hold** works for continuous movement games (Pong, Breakout, Space Invaders)
5. Verify touch buttons dispatch both `keydown` (on touchstart) AND `keyup` (on touchend)
6. If any touch button does nothing — this is a **P1-CRITICAL bug**. Stop and report immediately.

Common mobile pitfalls:
- Game listens on `window` but touch dispatches to `document` → no response
- First touch sets direction AND starts game → instant death
- No `keyup` on touchend → continuous movement never stops

### Step 6: Regression
- If ANY game was changed, test ALL 7 games (not just the changed one)
- A change to shared modules (platform-ui, audio, engine-reset) = mandatory full regression
- Touch controls are shared code — if changed, test ALL games on mobile

## Output
QA outbox report MUST include for each game:
- ✅ or ❌ Launch
- ✅ or ❌ Input response (desktop keyboard)
- ✅ or ❌ Input response (mobile touch)
- ✅ or ❌ Gameplay (score, game over, restart)
- ✅ or ❌ Console clean
- Screenshot if any failure

## Anti-Patterns
- ❌ "launchGame function exists in HTML" — this proves NOTHING about playability
- ❌ "HTTP 200 from site" — the site can load and every game can be broken
- ❌ "No console errors in static HTML" — you must LAUNCH the game first
- ❌ "Tested 1 game, rest assumed working" — test ALL or report gap explicitly

## Hard Rule
**If you cannot open a browser and play the game, you cannot approve it.**
Report the gap. Never silently skip functional testing.
