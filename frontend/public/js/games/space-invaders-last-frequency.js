/**
 * Space Invaders — Last Frequency (Phase 3: arcade-evolution)
 * Controls: Arrow Left/Right to move cannon, Space to fire, R to restart.
 * Mechanics: 5 waves, CRT post-processing, 3 invader types with 2 animation frames,
 * 4 destructible shields, UFO with variable points, score multiplier, signal boost,
 * 8 zzfx sounds, glitch shatter particles, ghost afterimages.
 * 600x400 canvas, all procedural rendering.
 */
function startSpaceInvadersLastFrequency(canvas, ctx) {
  // === CONSTANTS ===
  const W = 600, H = 400;
  const BG_COLOR = '#020408';
  const SCAN_LINE_COLOR = '#0a0a14';

  const PLAYER_W = 26, PLAYER_H = 16;
  const PLAYER_SPEED = 4;
  const PLAYER_Y = H - 40;
  const PLAYER_COLOR = '#00ff88';

  const BULLET_W = 2, BULLET_H = 8, BULLET_SPEED = 7;
  const BULLET_COLOR = '#00ff88';
  const FIRE_COOLDOWN_BASE = 300;

  const ALIEN_ROWS = 5, ALIEN_COLS = 11;
  const ALIEN_W = 22, ALIEN_H = 16;
  const ALIEN_PAD_X = 14, ALIEN_PAD_Y = 12;
  const TOTAL_INVADERS = 55;

  const ROW_COLORS = ['#ff1744', '#ff9100', '#ffea00', '#69f0ae', '#69f0ae'];
  const ROW_POINTS = [40, 30, 20, 10, 10];

  const ALIEN_STEP_X = 10;
  const ALIEN_STEP_Y = 16;

  const WAVE_CONFIG = [
    { stepMs: 500, fireRate: 0.5, startYOffset: 0 },
    { stepMs: 450, fireRate: 0.8, startYOffset: 0 },
    { stepMs: 400, fireRate: 1.2, startYOffset: 16 },
    { stepMs: 350, fireRate: 1.5, startYOffset: 16 },
    { stepMs: 300, fireRate: 2.0, startYOffset: 32 },
  ];
  const WAVE_BONUS_PER = 1000;

  const BOMB_W = 2, BOMB_H = 6, BOMB_SPEED_BASE = 4;
  const MAX_BOMBS = 5;

  const SHIELD_COUNT = 4;
  const SHIELD_COLS = 22, SHIELD_ROWS = 16;
  const SHIELD_PX = 4;
  const SHIELD_COLOR = '#00bfa5';
  const SHIELD_Y = H - 90;

  const UFO_W = 32, UFO_H = 14;
  const UFO_SPEED = 2;
  const UFO_COLOR = '#e040fb';
  const UFO_POINTS = [50, 100, 150, 300];
  const UFO_WEIGHTS = [4, 3, 2, 1];
  const UFO_SPAWN_MIN = 20000, UFO_SPAWN_MAX = 30000;

  const SUPER_UFO_W = 48, SUPER_UFO_H = 20;
  const SUPER_UFO_HP = 3;
  const SUPER_UFO_POINTS = 500;

  const STARTING_LIVES = 3;
  const BONUS_LIFE_SCORE = 10000;
  const INVINCIBLE_MS = 2000;
  const PARTICLE_CAP = 200;
  const MAX_MULTIPLIER = 5;

  // === SOUND EFFECTS ===
  const SFX = {
    pulse_fire:    () => { try { zzfx(...[.3,,1000,.01,.06,.05,1,2,,,,,,,,,,,.01]); } catch(e){} },
    static_pop:    () => { try { zzfx(...[.4,,3000,.01,.1,.05,4,1,,,,,,,,,,,.01]); } catch(e){} },
    signal_catch:  () => { try { zzfx(...[.4,,500,.02,.08,.08,1,1,,,,,,,,,,,.05]); } catch(e){} },
    static_crash:  () => { try { zzfx(...[.5,,4000,.01,.4,.2,4,2,,-50,,,,,,,,,.01]); } catch(e){} },
    march_blip:    (p) => { try { zzfx(...[.2,,p||120,.01,.04,.02,1,2,,,,,,,,,,,.01]); } catch(e){} },
    shield_crunch: () => { try { zzfx(...[.15,,200,.01,.05,.03,4,1,,,,,,,,,,,.01]); } catch(e){} },
    freq_sweep:    () => { try { zzfx(...[.4,,200,.02,.5,.2,1,1,,,,,,,,,,,.05]); } catch(e){} },
    bass_hit:      () => { try { zzfx(...[.6,,80,.02,.2,.15,2,3,,,,,,,,,,,.02]); } catch(e){} },
  };

  // === SPRITE DATA (11x8 px, mirrored) ===
  // Type 0 (squid, bottom 2 rows): simplified rect-based
  function drawAlien(x, y, type, frame, color, scale) {
    ctx.fillStyle = color;
    const s = scale || 2;
    const sprites = ALIEN_SPRITES[type][frame];
    for (let i = 0; i < sprites.length; i++) {
      ctx.fillRect(x + sprites[i][0] * s, y + sprites[i][1] * s, sprites[i][2] * s, sprites[i][3] * s);
    }
  }

  // Sprite definitions: [dx, dy, w, h] at 1x scale
  const ALIEN_SPRITES = [
    // Type 0 (squid) - 2 frames
    [
      [[4,0,3,1],[3,1,5,1],[2,2,7,1],[1,3,2,1],[4,3,3,1],[8,3,2,1],[0,4,11,1],[0,5,1,1],[2,5,2,1],[7,5,2,1],[10,5,1,1],[1,6,2,1],[8,6,2,1]],
      [[4,0,3,1],[3,1,5,1],[2,2,7,1],[1,3,2,1],[4,3,3,1],[8,3,2,1],[0,4,11,1],[0,5,1,1],[2,5,2,1],[7,5,2,1],[10,5,1,1],[0,6,2,1],[3,6,1,1],[7,6,1,1],[9,6,2,1]]
    ],
    // Type 1 (crab) - 2 frames
    [
      [[2,0,1,1],[8,0,1,1],[3,1,1,1],[7,1,1,1],[2,2,7,1],[1,3,2,1],[4,3,3,1],[8,3,2,1],[0,4,11,1],[0,5,1,1],[10,5,1,1],[1,6,1,1],[9,6,1,1]],
      [[2,0,1,1],[8,0,1,1],[3,1,1,1],[7,1,1,1],[2,2,7,1],[1,3,2,1],[4,3,3,1],[8,3,2,1],[0,4,11,1],[2,5,1,1],[8,5,1,1],[3,6,1,1],[7,6,1,1]]
    ],
    // Type 2 (octopus, top row) - 2 frames
    [
      [[5,0,1,1],[4,1,3,1],[3,2,5,1],[2,3,2,1],[5,3,1,1],[8,3,2,1],[1,4,9,1],[0,5,1,1],[1,5,1,1],[9,5,1,1],[10,5,1,1],[1,6,1,1],[3,6,1,1],[7,6,1,1],[9,6,1,1]],
      [[5,0,1,1],[4,1,3,1],[3,2,5,1],[2,3,2,1],[5,3,1,1],[8,3,2,1],[1,4,9,1],[0,5,1,1],[1,5,1,1],[9,5,1,1],[10,5,1,1],[0,6,1,1],[2,6,1,1],[8,6,1,1],[10,6,1,1]]
    ]
  ];

  // Row to type mapping
  const ROW_TYPE = [2, 1, 1, 0, 0];

  // === STATE ===
  let player, fleet, playerBullets, bombs, ufo, particles, shields;
  let wave, gameState, lastTime, animId;
  let keys = {};
  let nextBonusLife, lastFireTime, ufoTimer, ufoSpawnAt;
  let ghostImages, transitionTimer, dyingTimer;
  let signalBoost, signalBoostPickup;
  let crt;

  // Placeholder - continued in next section via patch

  function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  function saveHiScore() {
    if (player.score > player.hiScore) {
      player.hiScore = player.score;
      localStorage.setItem('spaceInvadersLastFrequency_hiScore', player.hiScore);
    }
  }

  function spawnParticle(x, y, color, count, grav) {
    for (let i = 0; i < count && particles.length < PARTICLE_CAP; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 1,
        life: 350, maxLife: 350,
        color, w: 4, h: 1,
        gravity: grav || 0.02
      });
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function spawnBombs(dt, cfg) {
    if (bombs.length >= MAX_BOMBS) return;
    const chance = cfg.fireRate / 60; // per-frame probability
    for (let c = 0; c < ALIEN_COLS; c++) {
      // Find lowest alive in column
      for (let r = ALIEN_ROWS - 1; r >= 0; r--) {
        if (!fleet.grid[r][c].alive) continue;
        if (Math.random() < chance) {
          const ax = fleet.x + c * (ALIEN_W + ALIEN_PAD_X) + ALIEN_W / 2;
          const ay = fleet.y + r * (ALIEN_H + ALIEN_PAD_Y) + ALIEN_H;
          const isGreen = wave >= 2 && r >= 3;
          const speed = isGreen ? 6 : BOMB_SPEED_BASE;
          bombs.push({ x: ax, y: ay, speed, type: isGreen ? 'green' : 'red', zigzag: 0 });

          // Wave 4+: top row double-shot
          if (wave >= 3 && r === 0 && Math.random() < 0.3) {
            bombs.push({ x: ax + 8, y: ay, speed: BOMB_SPEED_BASE, type: 'red', zigzag: 0 });
          }
        }
        break;
      }
    }
  }

  function updateUFO(dt) {
    ufoTimer += dt;
    if (!ufo.active && ufo.showScore <= 0 && ufoTimer >= ufoSpawnAt) {
      ufoTimer = 0;
      ufoSpawnAt = randRange(UFO_SPAWN_MIN, UFO_SPAWN_MAX);
      ufo.active = true;
      ufo.dx = Math.random() < 0.5 ? UFO_SPEED : -UFO_SPEED;
      ufo.x = ufo.dx > 0 ? -UFO_W : W;
      ufo.y = 30;

      // Wave 5 second UFO is Super
      if (wave === 4 && Math.random() < 0.5) {
        ufo.isSuper = true;
        ufo.hp = SUPER_UFO_HP;
        ufo.points = SUPER_UFO_POINTS;
      } else {
        ufo.isSuper = false;
        ufo.hp = 1;
        // Weighted random points
        const total = UFO_WEIGHTS.reduce((a, b) => a + b);
        let r = Math.random() * total;
        for (let i = 0; i < UFO_POINTS.length; i++) {
          r -= UFO_WEIGHTS[i];
          if (r <= 0) { ufo.points = UFO_POINTS[i]; break; }
        }
      }
    }
    if (ufo.active) {
      ufo.x += ufo.dx;
      const uw = ufo.isSuper ? SUPER_UFO_W : UFO_W;
      if (ufo.x > W + uw || ufo.x < -uw) ufo.active = false;

      // Wave 3+: UFO drops bomb above player
      if (wave >= 2 && Math.abs(ufo.x + uw / 2 - player.x - PLAYER_W / 2) < 20 && Math.random() < 0.02) {
        bombs.push({ x: ufo.x + uw / 2, y: ufo.y + (ufo.isSuper ? SUPER_UFO_H : UFO_H), speed: 5, type: 'red', zigzag: 0 });
      }
    }
    if (ufo.showScore > 0) ufo.showScore -= dt;
  }

  function erodeShieldsFromInvaders() {
    for (let s = 0; s < shields.length; s++) {
      const sh = shields[s];
      for (let r = 0; r < ALIEN_ROWS; r++) {
        for (let c = 0; c < ALIEN_COLS; c++) {
          if (!fleet.grid[r][c].alive) continue;
          const ax = fleet.x + c * (ALIEN_W + ALIEN_PAD_X);
          const ay = fleet.y + r * (ALIEN_H + ALIEN_PAD_Y);
          if (rectsOverlap(ax, ay, ALIEN_W, ALIEN_H, sh.x, sh.y, SHIELD_COLS * SHIELD_PX, SHIELD_ROWS * SHIELD_PX)) {
            // Erode overlapping pixels
            for (let sr = 0; sr < SHIELD_ROWS; sr++) {
              for (let sc = 0; sc < SHIELD_COLS; sc++) {
                if (!sh.grid[sr][sc]) continue;
                const px = sh.x + sc * SHIELD_PX;
                const py = sh.y + sr * SHIELD_PX;
                if (rectsOverlap(ax, ay, ALIEN_W, ALIEN_H, px, py, SHIELD_PX, SHIELD_PX)) {
                  sh.grid[sr][sc] = false;
                }
              }
            }
          }
        }
      }
    }
  }

  function erodeShield(sh, bx, by, bw, bh) {
    for (let r = 0; r < SHIELD_ROWS; r++) {
      for (let c = 0; c < SHIELD_COLS; c++) {
        if (!sh.grid[r][c]) continue;
        const px = sh.x + c * SHIELD_PX;
        const py = sh.y + r * SHIELD_PX;
        if (rectsOverlap(bx, by, bw, bh, px, py, SHIELD_PX, SHIELD_PX)) {
          sh.grid[r][c] = false;
          spawnParticle(px, py, SHIELD_COLOR, 2, 0.05);
          return true;
        }
      }
    }
    return false;
  }

  function checkCollisions() {
    // Player bullets vs invaders
    for (let bi = playerBullets.length - 1; bi >= 0; bi--) {
      const b = playerBullets[bi];
      let hit = false;
      for (let r = 0; r < ALIEN_ROWS; r++) {
        for (let c = 0; c < ALIEN_COLS; c++) {
          if (!fleet.grid[r][c].alive) continue;
          const ax = fleet.x + c * (ALIEN_W + ALIEN_PAD_X);
          const ay = fleet.y + r * (ALIEN_H + ALIEN_PAD_Y);
          if (rectsOverlap(b.x, b.y, BULLET_W, BULLET_H, ax, ay, ALIEN_W, ALIEN_H)) {
            fleet.grid[r][c].alive = false;
            fleet.aliveCount--;
            const pts = ROW_POINTS[r] * player.multiplier;
            player.score += pts;
            player.multiplier = Math.min(MAX_MULTIPLIER, player.multiplier + 1);
            playerBullets.splice(bi, 1);
            SFX.static_pop();
            spawnParticle(ax + ALIEN_W / 2, ay + ALIEN_H / 2, ROW_COLORS[r], 8, 0.03);
            // Ghost afterimage (wave 1+)
            ghostImages.push({ x: ax, y: ay, r, c, life: 200, maxLife: 200, color: ROW_COLORS[r] });
            // Signal boost spawn (wave 5, once)
            if (wave === 4 && !signalBoostPickup && signalBoost <= 0 && Math.random() < 0.03) {
              signalBoostPickup = { x: ax + ALIEN_W / 2, y: ay + ALIEN_H / 2, timer: 10000, pulse: 0 };
            }
            hit = true;
            break;
          }
        }
        if (hit) break;
      }
      if (hit) continue;

      // Player bullets vs UFO
      if (ufo.active) {
        const uw = ufo.isSuper ? SUPER_UFO_W : UFO_W;
        const uh = ufo.isSuper ? SUPER_UFO_H : UFO_H;
        if (rectsOverlap(b.x, b.y, BULLET_W, BULLET_H, ufo.x, ufo.y, uw, uh)) {
          playerBullets.splice(bi, 1);
          ufo.hp--;
          spawnParticle(ufo.x + uw / 2, ufo.y + uh / 2, UFO_COLOR, 8, 0.02);
          if (ufo.hp <= 0) {
            player.score += ufo.points;
            ufo.active = false;
            ufo.showScore = 1500;
            ufo.showX = ufo.x + uw / 2;
            SFX.signal_catch();
            spawnParticle(ufo.x + uw / 2, ufo.y + uh / 2, UFO_COLOR, 12, 0.02);
            if (ufo.points >= 300) SFX.bass_hit();
          }
          continue;
        }
      }

      // Player bullets vs shields
      for (let s = 0; s < shields.length; s++) {
        if (erodeShield(shields[s], b.x, b.y, BULLET_W, BULLET_H)) {
          playerBullets.splice(bi, 1);
          SFX.shield_crunch();
          break;
        }
      }
    }

    // Bombs vs player
    const now = performance.now();
    if (now > player.invincibleUntil) {
      for (let i = bombs.length - 1; i >= 0; i--) {
        const bx = bombs[i].type === 'red' ? bombs[i].x + Math.sin(bombs[i].zigzag * 5) * 3 : bombs[i].x;
        if (rectsOverlap(bx - BOMB_W / 2, bombs[i].y, BOMB_W, BOMB_H, player.x, PLAYER_Y, PLAYER_W, PLAYER_H)) {
          bombs.splice(i, 1);
          player.lives--;
          SFX.static_crash();
          spawnParticle(player.x + PLAYER_W / 2, PLAYER_Y + PLAYER_H / 2, '#ffffff', 16, 0.03);
          gameState = 'dying';
          dyingTimer = 700;
          return;
        }
      }
    }

    // Bombs vs shields
    for (let i = bombs.length - 1; i >= 0; i--) {
      const bx = bombs[i].type === 'red' ? bombs[i].x + Math.sin((bombs[i].zigzag || 0) * 5) * 3 : bombs[i].x;
      for (let s = 0; s < shields.length; s++) {
        if (erodeShield(shields[s], bx - BOMB_W / 2, bombs[i].y, BOMB_W, BOMB_H)) {
          bombs.splice(i, 1);
          SFX.shield_crunch();
          break;
        }
      }
    }
  }

  function updateCRT(dt) {
    // Static flicker
    crt.staticTimer += dt;
    if (crt.staticTimer >= crt.staticInterval) {
      crt.staticTimer = 0;
      crt.staticInterval = randRange(
        wave >= 4 ? 2000 : wave >= 3 ? 3000 : wave >= 2 ? 5000 : wave >= 1 ? 8000 : 99999,
        wave >= 4 ? 3000 : wave >= 3 ? 5000 : wave >= 2 ? 8000 : wave >= 1 ? 12000 : 999999
      );
    }

    // Horizontal tear (wave 3+)
    if (wave >= 2) {
      crt.tearTimer += dt;
      const tearInt = wave >= 4 ? 4000 : wave >= 3 ? 6000 : 10000;
      if (crt.tearTimer >= tearInt && !crt.tearActive) {
        crt.tearActive = true;
        crt.tearY = Math.random() * H;
        crt.tearShift = (wave >= 3 ? 6 : 3) * (Math.random() < 0.5 ? 1 : -1);
        crt.tearTimer = 0;
        setTimeout(() => { crt.tearActive = false; }, wave >= 3 ? 200 : 150);
      }
    }

    // Vertical roll (wave 5)
    if (wave >= 4) {
      crt.rollTimer += dt;
      if (crt.rollTimer >= 8000) {
        crt.rollActive = true;
        crt.rollTimer = 0;
        setTimeout(() => { crt.rollActive = false; }, 100);
      }
    }
  }

  function init() {
    wave = 0;
    gameState = 'playing';
    lastTime = 0;
    transitionTimer = 0;
    dyingTimer = 0;

    player = {
      x: W / 2 - PLAYER_W / 2,
      lives: STARTING_LIVES,
      score: 0,
      hiScore: parseInt(localStorage.getItem('spaceInvadersLastFrequency_hiScore') || '0'),
      invincibleUntil: 0,
      maxBullets: 1,
      fireCooldown: FIRE_COOLDOWN_BASE,
      multiplier: 1,
      missStreak: 0,
    };

    playerBullets = [];
    bombs = [];
    particles = [];
    ghostImages = [];
    signalBoost = 0;
    signalBoostPickup = null;
    lastFireTime = 0;

    crt = {
      scanOpacity: 0.15,
      staticTimer: 0, staticInterval: randRange(8000, 12000),
      tearTimer: 0, tearActive: false, tearY: 0, tearShift: 0,
      rollTimer: 0, rollActive: false,
      tremor: 0,
    };

    ufo = { x: 0, y: 30, active: false, dx: 0, points: 0, showScore: 0, showX: 0, hp: 1, isSuper: false };
    ufoTimer = 0;
    ufoSpawnAt = randRange(UFO_SPAWN_MIN, UFO_SPAWN_MAX);

    nextBonusLife = BONUS_LIFE_SCORE;
    initWave();
  }

  function randRange(min, max) { return min + Math.random() * (max - min); }

  function initWave() {
    const cfg = WAVE_CONFIG[wave];
    const yOff = cfg.startYOffset;
    fleet = {
      x: 60, y: 50 + yOff,
      dx: 1, stepTimer: 0, animFrame: 0, aliveCount: TOTAL_INVADERS,
      grid: []
    };
    for (let r = 0; r < ALIEN_ROWS; r++) {
      fleet.grid[r] = [];
      for (let c = 0; c < ALIEN_COLS; c++) {
        fleet.grid[r][c] = { alive: true, type: ROW_TYPE[r] };
      }
    }
    playerBullets = [];
    bombs = [];
    signalBoostPickup = null;

    // Shields
    if (wave === 4) {
      // Wave 5: only 2 shields (middle two)
      shields = [];
      for (let i = 1; i <= 2; i++) {
        shields.push(createShield(i));
      }
    } else if (wave === 0) {
      shields = [];
      for (let i = 0; i < SHIELD_COUNT; i++) shields.push(createShield(i));
    }
    // else keep existing shields (with damage)

    // Wave 2+: partial shield regen
    if (wave > 0 && wave < 4) {
      for (let s = 0; s < shields.length; s++) {
        for (let r = 0; r < SHIELD_ROWS; r++) {
          for (let c = 0; c < SHIELD_COLS; c++) {
            if (!shields[s].grid[r][c] && shields[s].template[r][c] && Math.random() < 0.5) {
              shields[s].grid[r][c] = true;
            }
          }
        }
      }
    }

    // Wave 4: rapid fire
    player.maxBullets = wave >= 3 ? 2 : 1;
    player.fireCooldown = wave >= 3 ? 150 : FIRE_COOLDOWN_BASE;

    // CRT intensity per wave
    crt.scanOpacity = 0.15 + wave * 0.04;
  }

  function createShield(index) {
    const totalW = SHIELD_COUNT * SHIELD_COLS * SHIELD_PX + (SHIELD_COUNT - 1) * 30;
    const startX = (W - totalW) / 2;
    const sx = startX + index * (SHIELD_COLS * SHIELD_PX + 30);
    const grid = [];
    const template = [];
    for (let r = 0; r < SHIELD_ROWS; r++) {
      grid[r] = [];
      template[r] = [];
      for (let c = 0; c < SHIELD_COLS; c++) {
        // Arch shape: top rounded, bottom center cutout
        let on = true;
        // Top corners rounded
        if (r < 3 && (c < 3 - r || c >= SHIELD_COLS - 3 + r)) on = false;
        // Bottom arch cutout
        if (r >= SHIELD_ROWS - 5 && c >= 7 && c < 15) on = false;
        grid[r][c] = on;
        template[r][c] = on;
      }
    }
    return { x: sx, y: SHIELD_Y, grid, template };
  }

  // KEY HANDLERS
  function onKeyDown(e) {
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
    if (e.key === 'r' || e.key === 'R') {
      if (gameState === 'gameOver' || gameState === 'victory') {
        init();
        if (!animId) gameLoop(performance.now());
      }
    }
  }
  function onKeyUp(e) { keys[e.key] = false; }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  function gameLoop(ts) {
    const dt = lastTime ? ts - lastTime : 16;
    lastTime = ts;
    update(dt);
    render();
    animId = requestAnimationFrame(gameLoop);
  }

  function render() {
    ctx.save();
    if (crt.tremor) ctx.translate(crt.tremor, 0);
    if (crt.rollActive) ctx.translate(0, -2);

    // Background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    // CRT scan lines
    ctx.fillStyle = SCAN_LINE_COLOR;
    ctx.globalAlpha = crt.scanOpacity;
    for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1);
    ctx.globalAlpha = 1;

    // Static flicker
    if (crt.staticTimer < 100) {
      const lines = wave >= 4 ? 8 : wave >= 3 ? 5 : 3;
      ctx.fillStyle = SCAN_LINE_COLOR;
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < lines; i++) {
        ctx.fillRect(0, Math.random() * H, W, 1);
      }
      ctx.globalAlpha = 1;
    }

    // Shields
    ctx.fillStyle = SHIELD_COLOR;
    for (let s = 0; s < shields.length; s++) {
      const sh = shields[s];
      for (let r = 0; r < SHIELD_ROWS; r++) {
        for (let c = 0; c < SHIELD_COLS; c++) {
          if (sh.grid[r][c]) ctx.fillRect(sh.x + c * SHIELD_PX, sh.y + r * SHIELD_PX, SHIELD_PX, SHIELD_PX);
        }
      }
    }

    // Invaders
    for (let r = 0; r < ALIEN_ROWS; r++) {
      for (let c = 0; c < ALIEN_COLS; c++) {
        if (!fleet.grid[r][c].alive) continue;
        const ax = fleet.x + c * (ALIEN_W + ALIEN_PAD_X);
        const ay = fleet.y + r * (ALIEN_H + ALIEN_PAD_Y);
        drawAlien(ax, ay, fleet.grid[r][c].type, fleet.animFrame, ROW_COLORS[r], 2);
      }
    }

    // Ghost afterimages
    for (let i = 0; i < ghostImages.length; i++) {
      const g = ghostImages[i];
      ctx.globalAlpha = 0.15 * (g.life / g.maxLife);
      drawAlien(g.x, g.y, ROW_TYPE[g.r], fleet.animFrame, g.color, 2);
      ctx.globalAlpha = 1;
    }

    // Player cannon
    if (gameState !== 'dying') {
      const blink = performance.now() < player.invincibleUntil && Math.floor(performance.now() / 100) % 2 === 0;
      if (!blink) {
        const glowPx = signalBoost > 0 ? 4 : 2;
        ctx.shadowColor = PLAYER_COLOR;
        ctx.shadowBlur = glowPx;
        ctx.fillStyle = PLAYER_COLOR;
        // Cannon shape: base + barrel
        ctx.fillRect(player.x, PLAYER_Y + 6, PLAYER_W, 10);
        ctx.fillRect(player.x + 4, PLAYER_Y + 2, PLAYER_W - 8, 6);
        ctx.fillRect(player.x + PLAYER_W / 2 - 2, PLAYER_Y, 4, 4);
        ctx.shadowBlur = 0;
      }
    }

    // Player bullets
    ctx.fillStyle = BULLET_COLOR;
    ctx.shadowColor = BULLET_COLOR;
    ctx.shadowBlur = 3;
    for (let i = 0; i < playerBullets.length; i++) {
      ctx.fillRect(playerBullets[i].x, playerBullets[i].y, BULLET_W, BULLET_H);
    }
    ctx.shadowBlur = 0;

    // Bombs
    for (let i = 0; i < bombs.length; i++) {
      const bomb = bombs[i];
      const bx = bomb.type === 'red' ? bomb.x + Math.sin((bomb.zigzag || 0) * 5) * 3 : bomb.x;
      ctx.fillStyle = bomb.type === 'red' ? '#ff1744' : '#69f0ae';
      ctx.fillRect(bx - BOMB_W / 2, bomb.y, BOMB_W, BOMB_H);
    }

    // UFO
    if (ufo.active) {
      const uw = ufo.isSuper ? SUPER_UFO_W : UFO_W;
      const uh = ufo.isSuper ? SUPER_UFO_H : UFO_H;
      ctx.shadowColor = UFO_COLOR;
      ctx.shadowBlur = 3;
      ctx.fillStyle = UFO_COLOR;
      // Saucer shape
      ctx.fillRect(ufo.x + uw * 0.2, ufo.y, uw * 0.6, uh * 0.4);
      ctx.fillRect(ufo.x, ufo.y + uh * 0.3, uw, uh * 0.4);
      ctx.fillRect(ufo.x + uw * 0.1, ufo.y + uh * 0.6, uw * 0.8, uh * 0.3);
      if (ufo.isSuper) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ufo.x + uw * 0.3, ufo.y + uh * 0.35, 2, uh * 0.3);
        ctx.fillRect(ufo.x + uw * 0.5, ufo.y + uh * 0.35, 2, uh * 0.3);
        ctx.fillRect(ufo.x + uw * 0.7, ufo.y + uh * 0.35, 2, uh * 0.3);
      }
      ctx.shadowBlur = 0;
    }
    // UFO score popup
    if (ufo.showScore > 0) {
      ctx.fillStyle = UFO_COLOR;
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      const alpha = Math.min(1, ufo.showScore / 500);
      ctx.globalAlpha = alpha;
      ctx.fillText(ufo.points, ufo.showX, 50 - (1500 - ufo.showScore) * 0.01);
      ctx.globalAlpha = 1;
    }

    // Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }
    ctx.globalAlpha = 1;

    // Signal boost pickup
    if (signalBoostPickup) {
      ctx.fillStyle = PLAYER_COLOR;
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(signalBoostPickup.pulse);
      const sx = signalBoostPickup.x, sy = signalBoostPickup.y;
      ctx.beginPath();
      ctx.moveTo(sx, sy - 6); ctx.lineTo(sx + 6, sy); ctx.lineTo(sx, sy + 6); ctx.lineTo(sx - 6, sy);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // HUD
    ctx.fillStyle = PLAYER_COLOR;
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE ' + player.score, 10, 20);
    if (player.multiplier > 1) {
      ctx.fillText('×' + player.multiplier, 130, 20);
    }
    ctx.textAlign = 'center';
    ctx.fillText('HI ' + player.hiScore, W / 2, 20);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#78909c';
    ctx.font = '12px monospace';
    ctx.fillText('WAVE ' + (wave + 1) + '/5', W - 10, 20);

    // Lives (cannon icons bottom-left)
    ctx.fillStyle = PLAYER_COLOR;
    for (let i = 0; i < player.lives; i++) {
      ctx.fillRect(10 + i * 20, H - 15, 12, 6);
      ctx.fillRect(14 + i * 20, H - 18, 4, 3);
    }

    // Panic zone border (wave 3+)
    if (wave >= 2) {
      for (let r = ALIEN_ROWS - 1; r >= 0; r--) {
        for (let c = 0; c < ALIEN_COLS; c++) {
          if (!fleet.grid[r][c].alive) continue;
          const ay = fleet.y + r * (ALIEN_H + ALIEN_PAD_Y);
          if (ay + ALIEN_H > PLAYER_Y - 80) {
            ctx.strokeStyle = '#ff1744';
            ctx.globalAlpha = 0.08 * (0.5 + 0.5 * Math.sin(performance.now() / 500));
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, W, H);
            ctx.globalAlpha = 1;
          }
          break;
        }
        break;
      }
    }

    // CRT vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.7);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // CRT horizontal tear
    if (crt.tearActive) {
      const imgData = ctx.getImageData(0, crt.tearY, W, 4);
      ctx.putImageData(imgData, crt.tearShift, crt.tearY);
    }

    // Game state overlays
    if (gameState === 'waveTransition') {
      // Scan line sweep
      const progress = 1 - transitionTimer / 1000;
      ctx.fillStyle = PLAYER_COLOR;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(0, 0, W, H * progress);
      ctx.globalAlpha = 1;
      ctx.fillStyle = PLAYER_COLOR;
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('WAVE ' + (wave + 2) + ' INCOMING', W / 2, H / 2);
    }

    if (gameState === 'dying') {
      // Screen flicker
      if (Math.floor(dyingTimer / 100) % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.15;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    }

    if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ff1744';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SIGNAL LOST', W / 2, H / 2 - 20);
      ctx.fillStyle = PLAYER_COLOR;
      ctx.font = '16px monospace';
      ctx.fillText('Score: ' + player.score, W / 2, H / 2 + 15);
      ctx.fillText('Press R to retry', W / 2, H / 2 + 45);
    }

    if (gameState === 'victory') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PLAYER_COLOR;
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TRANSMISSION TERMINATED', W / 2, H / 2 - 20);
      ctx.font = '16px monospace';
      ctx.fillText('Score: ' + player.score, W / 2, H / 2 + 15);
      if (player.score >= player.hiScore) {
        ctx.fillStyle = UFO_COLOR;
        ctx.font = 'bold 20px monospace';
        ctx.fillText('NEW RECORD!', W / 2, H / 2 + 45);
      }
      ctx.fillStyle = PLAYER_COLOR;
      ctx.font = '14px monospace';
      ctx.fillText('Press R to play again', W / 2, H / 2 + 75);
    }

    ctx.restore();
  }

  function update(dt) {
    if (gameState === 'gameOver' || gameState === 'victory') return;

    if (gameState === 'waveTransition') {
      transitionTimer -= dt;
      if (transitionTimer <= 0) {
        wave++;
        if (wave >= 5) { gameState = 'victory'; saveHiScore(); return; }
        initWave();
        gameState = 'playing';
      }
      return;
    }

    if (gameState === 'dying') {
      dyingTimer -= dt;
      if (dyingTimer <= 0) {
        if (player.lives <= 0) { gameState = 'gameOver'; saveHiScore(); return; }
        player.x = W / 2 - PLAYER_W / 2;
        player.invincibleUntil = performance.now() + INVINCIBLE_MS;
        gameState = 'playing';
      }
      return;
    }

    // Input
    if (keys['ArrowLeft']) player.x = Math.max(0, player.x - PLAYER_SPEED);
    if (keys['ArrowRight']) player.x = Math.min(W - PLAYER_W, player.x + PLAYER_SPEED);

    const now = performance.now();
    const maxB = signalBoost > 0 ? 3 : player.maxBullets;
    const cd = signalBoost > 0 ? 100 : player.fireCooldown;
    if (keys[' '] && playerBullets.length < maxB && now - lastFireTime > cd) {
      playerBullets.push({ x: player.x + PLAYER_W / 2 - BULLET_W / 2, y: PLAYER_Y - BULLET_H });
      lastFireTime = now;
      SFX.pulse_fire();
    }

    // Signal boost timer
    if (signalBoost > 0) {
      signalBoost -= dt;
      if (signalBoost <= 0) signalBoost = 0;
    }

    // Move player bullets
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      playerBullets[i].y -= BULLET_SPEED;
      if (playerBullets[i].y < 0) {
        playerBullets.splice(i, 1);
        player.multiplier = 1; // miss resets
      }
    }

    // Fleet movement
    const cfg = WAVE_CONFIG[wave];
    const speedMult = 1 - fleet.aliveCount / TOTAL_INVADERS;
    const stepInterval = Math.max(80, cfg.stepMs - speedMult * (cfg.stepMs - 80));
    fleet.stepTimer += dt;
    if (fleet.stepTimer >= stepInterval) {
      fleet.stepTimer = 0;
      fleet.animFrame = 1 - fleet.animFrame;
      // March sound
      const pitch = 120 + (TOTAL_INVADERS - fleet.aliveCount) * 2;
      SFX.march_blip(pitch);

      // Check edge collision
      let hitEdge = false;
      for (let r = 0; r < ALIEN_ROWS; r++) {
        for (let c = 0; c < ALIEN_COLS; c++) {
          if (!fleet.grid[r][c].alive) continue;
          const ax = fleet.x + c * (ALIEN_W + ALIEN_PAD_X);
          if (fleet.dx > 0 && ax + ALIEN_W + ALIEN_STEP_X > W - 10) hitEdge = true;
          if (fleet.dx < 0 && ax - ALIEN_STEP_X < 10) hitEdge = true;
        }
      }
      if (hitEdge) {
        fleet.y += ALIEN_STEP_Y;
        fleet.dx *= -1;
        // Erode shields if invaders overlap
        erodeShieldsFromInvaders();
      } else {
        fleet.x += ALIEN_STEP_X * fleet.dx;
      }
    }

    // Bomb spawning
    spawnBombs(dt, cfg);

    // Move bombs
    for (let i = bombs.length - 1; i >= 0; i--) {
      bombs[i].y += bombs[i].speed;
      if (bombs[i].type === 'red') bombs[i].zigzag = (bombs[i].zigzag || 0) + dt * 0.01;
      if (bombs[i].y > H) bombs.splice(i, 1);
    }

    // UFO logic
    updateUFO(dt);

    // Signal boost pickup (wave 5 only)
    if (wave === 4 && signalBoostPickup) {
      signalBoostPickup.timer -= dt;
      signalBoostPickup.pulse = (signalBoostPickup.pulse || 0) + dt * 0.005;
      if (signalBoostPickup.timer <= 0) signalBoostPickup = null;
      else if (signalBoostPickup && rectsOverlap(player.x, PLAYER_Y, PLAYER_W, PLAYER_H,
        signalBoostPickup.x - 4, signalBoostPickup.y - 4, 8, 8)) {
        signalBoost = 3000;
        SFX.signal_catch();
        signalBoostPickup = null;
      }
    }

    // Collisions
    checkCollisions();

    // Check wave clear
    if (fleet.aliveCount <= 0) {
      player.score += WAVE_BONUS_PER * (wave + 1);
      SFX.freq_sweep();
      gameState = 'waveTransition';
      transitionTimer = 1000;
      return;
    }

    // Check invasion
    for (let r = ALIEN_ROWS - 1; r >= 0; r--) {
      for (let c = 0; c < ALIEN_COLS; c++) {
        if (!fleet.grid[r][c].alive) continue;
        const ay = fleet.y + r * (ALIEN_H + ALIEN_PAD_Y);
        if (ay + ALIEN_H >= PLAYER_Y) {
          gameState = 'gameOver';
          saveHiScore();
          return;
        }
      }
    }

    // Bonus life
    if (player.score >= nextBonusLife) {
      player.lives++;
      nextBonusLife += BONUS_LIFE_SCORE;
    }

    // Update particles
    updateParticles(dt);

    // Update ghost images
    for (let i = ghostImages.length - 1; i >= 0; i--) {
      ghostImages[i].life -= dt;
      if (ghostImages[i].life <= 0) ghostImages.splice(i, 1);
    }

    // CRT effects
    updateCRT(dt);

    // Tremor wave 4+
    crt.tremor = wave >= 3 ? (Math.random() - 0.5) * 1 : 0;
  }

  init();
  gameLoop(performance.now());

  function cleanup() {
    cancelAnimationFrame(animId);
    animId = null;
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }

  return { controls: 'Arrow keys: Move | Space: Fire | R: Restart', cleanup };
}
