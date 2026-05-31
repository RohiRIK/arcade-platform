/**
 * Tears down LittleJS engine state between game switches.
 * Must be called AFTER game's own stop() and BEFORE next game init.
 * Safe to call when engine is not initialized (all checks are guarded).
 */
function resetLittleJS() {
  /* Clear all engine objects */
  if (typeof engineObjects !== 'undefined' && engineObjects) {
    engineObjects.length = 0;
  }

  /* Reset camera */
  if (typeof setCameraPos === 'function') {
    setCameraPos(vec2());
    setCameraScale(1);
  }

  /* Reset frame counter */
  if (typeof frame !== 'undefined') {
    frame = 0;
  }

  /* Clear input state */
  if (typeof clearInput === 'function') {
    clearInput();
  }

  /* Destroy WebGL overlay if present */
  if (typeof glCanvas !== 'undefined' && glCanvas) {
    glCanvas.remove();
    glContext = null;
    glCanvas = null;
  }

  /* Cancel engine's own rAF */
  if (typeof engineFrameId !== 'undefined' && engineFrameId) {
    cancelAnimationFrame(engineFrameId);
    engineFrameId = null;
  }
}
