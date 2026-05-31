/**
 * Audio wrapper with lazy zzfx initialization.
 * Works for both legacy games (no sound) and LittleJS games (zzfx).
 * Does nothing if zzfx not available — graceful degradation.
 */
var _zzfx = null;
var _muted = false;

function initAudio() {
  if (!_zzfx) {
    _zzfx = window.zzfx || null;
  }
}

function playSound(params) {
  if (_muted) return;
  initAudio();
  if (_zzfx) {
    try {
      if (!window.zzfxX) window.zzfxX = new (window.AudioContext || window.webkitAudioContext)();
      _zzfx.apply(null, params);
    } catch(e) { /* audio not ready */ }
  }
}

function setMuted(muted) {
  _muted = muted;
}

function isMuted() {
  return _muted;
}
