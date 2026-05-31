/**
 * Dual-mode game loader.
 * Handles both legacy inline games and future LittleJS module games.
 * During Phase 1, delegates to existing launchGame().
 * Phase 2+ adds LittleJS game routing.
 */

var LITTLEJS_GAMES = []; /* Populated as games migrate: ['snake', 'pong', ...] */
var littlejsActive = false;
var currentModuleGame = null;

function loadGame(name) {
  /* If a LittleJS module game was active, tear down engine */
  if (littlejsActive && currentModuleGame && currentModuleGame.stop) {
    currentModuleGame.stop();
    resetLittleJS();
    littlejsActive = false;
    currentModuleGame = null;
  }

  if (LITTLEJS_GAMES.indexOf(name) !== -1) {
    /* Future: load LittleJS game module */
    console.warn("[main.js] LittleJS game '" + name + "' not yet migrated, falling through to legacy");
  }

  /* Delegate to legacy launcher (existing inline function) */
  if (typeof launchGame === 'function') {
    launchGame(name);
  }
}
