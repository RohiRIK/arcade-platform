/**
 * Shared game-over overlay renderer.
 * Used by all games for consistent end-screen experience.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} opts
 * @param {string} [opts.title='GAME OVER'] - Title text
 * @param {number} [opts.score] - Final score
 * @param {number} [opts.highScore] - High score (omit to skip)
 * @param {boolean} [opts.isNewBest=false] - Show "NEW HIGH SCORE!" celebration
 * @param {boolean} [opts.isWin=false] - Show "YOU WIN!" styling
 * @param {string} [opts.accent='#e94560'] - Title color override (per-game identity)
 */
function drawGameOverOverlay(ctx, opts) {
  if (!opts) opts = {};
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const title = opts.title || 'GAME OVER';
  const isWin = opts.isWin || false;
  const score = opts.score;
  const highScore = opts.highScore;
  const isNewBest = opts.isNewBest || false;

  ctx.fillStyle = 'rgba(15, 15, 35, 0.85)';
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = 'center';
  var y = h * 0.35;

  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = isWin ? '#4ade80' : '#e94560';
  ctx.fillText(title, w / 2, y);
  y += 48;

  if (score !== undefined) {
    ctx.font = '18px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, w / 2, y);
    y += 28;
  }

  if (highScore !== undefined) {
    ctx.font = '14px monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('Best: ' + highScore, w / 2, y);
    y += 24;
  }

  if (isNewBest) {
    ctx.font = '16px monospace';
    ctx.fillStyle = '#facc15';
    ctx.fillText('\u2605 NEW HIGH SCORE! \u2605', w / 2, y);
    y += 28;
  }

  ctx.font = '14px monospace';
  ctx.fillStyle = '#888';
  ctx.fillText('Press R to restart', w / 2, y + 16);
}
