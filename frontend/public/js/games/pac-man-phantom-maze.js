/**
 * Pac-Man — Phantom Maze (Phase 3: arcade-evolution)
 * Controls: Arrow keys to move, Enter to restart after game over.
 * Mechanics: Fog-of-war haunted labyrinth, 4 ghost AI personalities,
 * 7 difficulty levels, Ghost Train combo, 8 zzfx sounds, particle effects,
 * procedural sprites, hi-score persistence.
 * 600x400 canvas, all procedural rendering.
 */
function startPacManPhantomMaze(canvas, ctx) {
  // === CONSTANTS ===
  const W = 600, H = 400;
  const COLS = 28, ROWS = 31;
  const TILE_W = 14;
  const TILE_H = 12;
  const FIELD_X = 104;
  const FIELD_Y = 14;

  const BG = '#080810';
  const WALL_COLOR = '#1a237e';
  const WALL_GLOW = '#3949ab';
  const DOT_COLOR = '#b0bec5';
  const POWER_COLOR = '#ffffff';
  const PAC_COLOR = '#ffd600';
  const PAC_GLOW_PX = 6;
  const GHOST_COLORS = {
    blinky: '#ff1744', pinky: '#f48fb1',
    inky: '#00e5ff', clyde: '#ff9100'
  };
  const FRIGHT_COLOR = '#1565c0';
  const FRIGHT_FLASH = '#ffffff';
  const EYES_COLOR = '#ffffff';
  const FRUIT_COLOR = '#ff1744';
  const SCORE_COLOR = '#b0bec5';
  const COMBO_COLOR = '#ffd600';

  const BASE_PAC_SPEED = 2.0;
  const GHOST_EATEN_SPEED = 3.0;
  const FRIGHT_FLASH_TIME = 2000;

  const DOT_SCORE = 10;
  const POWER_SCORE = 50;
  const GHOST_EAT_SCORES = [200, 400, 800, 1600];
  const EXTRA_LIFE_AT = 10000;
  const STARTING_LIVES = 3;

  const T_EMPTY = 0, T_WALL = 1, T_DOT = 2, T_POWER = 3;
  const T_HOUSE = 4, T_DOOR = 5, T_TUNNEL = 6;
  const MAX_PARTICLES = 200;
  const TOTAL_DOTS = 240;

  const LEVELS = [
    { level: 1, ghostPct: 0.75, frightMs: 8000, fogTiles: 5.0, fruit: 'cherry',      fruitPts: 100  },
    { level: 2, ghostPct: 0.80, frightMs: 7000, fogTiles: 5.0, fruit: 'strawberry',   fruitPts: 300  },
    { level: 3, ghostPct: 0.85, frightMs: 6000, fogTiles: 4.5, fruit: 'orange',       fruitPts: 500  },
    { level: 4, ghostPct: 0.90, frightMs: 5000, fogTiles: 4.0, fruit: 'apple',        fruitPts: 700  },
    { level: 5, ghostPct: 0.95, frightMs: 4000, fogTiles: 3.5, fruit: 'apple',        fruitPts: 700  },
    { level: 6, ghostPct: 1.00, frightMs: 3000, fogTiles: 3.0, fruit: 'melon',        fruitPts: 1000 },
    { level: 7, ghostPct: 1.05, frightMs: 2000, fogTiles: 2.5, fruit: 'melon',        fruitPts: 1000 },
  ];
  function getLevelConfig(lvl) { return LEVELS[Math.min(lvl - 1, LEVELS.length - 1)]; }

  const MODE_SEQUENCE = [
    { mode: 'scatter', duration: 7000 },
    { mode: 'chase',   duration: 20000 },
    { mode: 'scatter', duration: 7000 },
    { mode: 'chase',   duration: 20000 },
    { mode: 'scatter', duration: 5000 },
    { mode: 'chase',   duration: 20000 },
    { mode: 'scatter', duration: 5000 },
    { mode: 'chase',   duration: Infinity },
  ];

  const DIR_OFFSETS = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };
  const DIR_ANGLES = { right: 0, down: Math.PI/2, left: Math.PI, up: 3*Math.PI/2 };
  const DIR_ORDER = ['up', 'left', 'down', 'right'];
  const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

  const MAZE_TEMPLATE = [
    "1111111111111111111111111111",
    "1222222222222112222222222221",
    "1211112111112112111121111121",
    "1311112111112112111121111131",
    "1211112111112112111121111121",
    "1222222222222222222222222221",
    "1211112112111111112112111121",
    "1211112112111111112112111121",
    "1222222112222112222112222221",
    "1111112111110110111121111111",
    "0000012111110110111121000000",
    "0000012110000000001121000000",
    "0000012110111551110121000000",
    "6000012000144444410021000006",
    "0000012110144444410121000000",
    "0000012110111111110121000000",
    "0000012110000000001121000000",
    "1111112110111111112121111111",
    "1222222222222112222222222221",
    "1211112111112112111121111121",
    "1311112111112112111121111131",
    "1222112222222002222222112221",
    "1112112112111111112112112111",
    "1112112112111111112112112111",
    "1222222112222112222112222221",
    "1211111111112112111111111121",
    "1211111111112112111111111121",
    "1222222222222222222222222221",
    "1111111111111111111111111111",
    "0000000000000000000000000000",
    "0000000000000000000000000000"
  ];

  // === SOUNDS (zzfx) ===
  const SOUNDS = {
    munch_a:       () => { try { zzfx(.3,.05,260,.01,.04,.01,2,.5,0,0,0,0,0,0,0,0,.04,0,0); } catch(e){} },
    munch_b:       () => { try { zzfx(.3,.05,300,.01,.04,.01,2,.5,0,0,0,0,0,0,0,0,.04,0,0); } catch(e){} },
    power_surge:   () => { try { zzfx(.5,.1,60,.05,.15,.1,0,1,10,0,0,0,0,0,0,0,.15,.1,0); } catch(e){} },
    spirit_capture:() => { try { zzfx(.4,.05,1000,.01,.2,.05,1,.5,-20,0,0,0,0,0,0,0,.2,0,0); } catch(e){} },
    soul_shatter:  () => { try { zzfx(.5,.1,800,.02,.5,.1,0,1,-15,5,0,0,0,0,0,0,.5,0,0); } catch(e){} },
    fruit_chime:   () => { try { zzfx(.3,.02,880,.01,.06,.02,2,.3,0,0,0,0,0,0,0,0,.06,.02,0); zzfx(.3,.02,1100,.01,.06,.02,2,.3,0,0,0,0,0,0,0,0,.06,.02,.06); } catch(e){} },
    maze_clear:    () => { try { zzfx(.4,.05,392,.01,.15,.05,0,.5,0,0,0,0,0,0,0,0,.15,0,0); setTimeout(()=>zzfx(.4,.05,494,.01,.15,.05,0,.5,0,0,0,0,0,0,0,0,.15,0,0),150); setTimeout(()=>zzfx(.4,.05,587,.01,.15,.05,0,.5,0,0,0,0,0,0,0,0,.15,0,0),300); setTimeout(()=>zzfx(.4,.05,784,.01,.15,.05,0,.5,0,0,0,0,0,0,0,0,.15,0,0),450); } catch(e){} },
    ghost_train:   () => { try { zzfx(.6,.1,65,.05,.4,.1,0,1,0,0,0,0,0,0,0,0,.4,0,0); zzfx(.5,.1,98,.05,.4,.1,0,1,0,0,0,0,0,0,0,0,.4,0,0); } catch(e){} },
  };
  let munchToggle = false;

  // === SIREN (Web Audio looping oscillator) ===
  let sirenCtx = null, sirenOsc = null, sirenGain = null, sirenLFO = null, sirenLFOGain = null;
  let sirenActive = false;
  function startSiren() {
    if (sirenActive) return;
    try {
      sirenCtx = new (window.AudioContext || window.webkitAudioContext)();
      sirenOsc = sirenCtx.createOscillator();
      sirenGain = sirenCtx.createGain();
      sirenLFO = sirenCtx.createOscillator();
      sirenLFOGain = sirenCtx.createGain();
      sirenOsc.type = 'sine';
      sirenOsc.frequency.value = 250;
      sirenLFO.type = 'sine';
      sirenLFO.frequency.value = 1;
      sirenLFOGain.gain.value = 50;
      sirenGain.gain.value = 0.12;
      sirenLFO.connect(sirenLFOGain);
      sirenLFOGain.connect(sirenOsc.frequency);
      sirenOsc.connect(sirenGain);
      sirenGain.connect(sirenCtx.destination);
      sirenOsc.start();
      sirenLFO.start();
      sirenActive = true;
    } catch(e) {}
  }
  function updateSiren(frightened) {
    if (!sirenActive) return;
    try {
      if (frightened) {
        sirenOsc.frequency.value = 500;
        sirenLFO.frequency.value = 2;
        sirenLFOGain.gain.value = 100;
        sirenGain.gain.value = 0.15;
      } else {
        sirenOsc.frequency.value = 250;
        sirenLFO.frequency.value = 1;
        sirenLFOGain.gain.value = 50;
        sirenGain.gain.value = 0.12;
      }
    } catch(e) {}
  }
  function stopSiren() {
    if (!sirenActive) return;
    try { sirenOsc.stop(); sirenLFO.stop(); sirenCtx.close(); } catch(e) {}
    sirenActive = false;
    sirenCtx = sirenOsc = sirenGain = sirenLFO = sirenLFOGain = null;
  }


  // === STATE ===
  let maze = [];
  let pacman = null;
  let ghosts = [];
  let score = 0, lives = STARTING_LIVES, level = 1;
  let dotsRemaining = 0;
  let ghostsEatenThisPellet = 0;
  let modePhase = 0, currentMode = 'scatter', modeTimer = 0;
  let frightTimer = 0;
  let fruitActive = false, fruitTimer = 0;
  let paused = false, gameOver = false, waitingToStart = true;
  let highScore = parseInt(localStorage.getItem('phantomMazeHigh') || '0');
  let extraLifeAwarded = false;
  let particles = [];
  let levelConfig = getLevelConfig(1);
  let rafId = null;
  let lastTime = 0;
  let gameOverAnim = 0;
  let readyTimer = 0;
  let floatingTexts = [];
  let comboDisplay = null;

  // === TILE/PIXEL HELPERS ===
  function tileToPixelX(col) { return FIELD_X + col * TILE_W + TILE_W / 2; }
  function tileToPixelY(row) { return FIELD_Y + row * TILE_H + TILE_H / 2; }
  function pixelToTileX(x)   { return Math.floor((x - FIELD_X) / TILE_W); }
  function pixelToTileY(y)   { return Math.floor((y - FIELD_Y) / TILE_H); }
  function atTileCenter(entity, threshold) {
    const cx = tileToPixelX(entity.tileX);
    const cy = tileToPixelY(entity.tileY);
    return Math.abs(entity.x - cx) < threshold && Math.abs(entity.y - cy) < threshold;
  }
  function snapToTileCenter(entity) {
    entity.x = tileToPixelX(entity.tileX);
    entity.y = tileToPixelY(entity.tileY);
  }
  function euclidDist(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
  }
  function isValidTile(col, row) {
    return col >= 0 && col < COLS && row >= 0 && row < ROWS;
  }
  function isBlocked(col, row, isPacman) {
    if (!isValidTile(col, row)) return true;
    const t = maze[row][col];
    if (t === T_WALL) return true;
    if (isPacman && (t === T_HOUSE || t === T_DOOR)) return true;
    return false;
  }
  function nextTile(col, row, dir) {
    const o = DIR_OFFSETS[dir];
    return { col: col + o[0], row: row + o[1] };
  }

  // === MAZE PARSING ===
  function parseMaze() {
    maze = [];
    dotsRemaining = 0;
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        const ch = parseInt(MAZE_TEMPLATE[r][c]);
        row.push(ch);
        if (ch === T_DOT || ch === T_POWER) dotsRemaining++;
      }
      maze.push(row);
    }
  }

  // === ENTITY CREATION ===
  function makeEntity(col, row, speed) {
    return {
      x: tileToPixelX(col), y: tileToPixelY(row),
      tileX: col, tileY: row,
      dir: null, nextDir: null,
      speed: speed, frame: 0
    };
  }
  function updateTileCoords(entity) {
    entity.tileX = pixelToTileX(entity.x);
    entity.tileY = pixelToTileY(entity.y);
  }
  function advanceEntity(entity, speed) {
    if (!entity.dir) return;
    const o = DIR_OFFSETS[entity.dir];
    entity.x += o[0] * speed;
    entity.y += o[1] * speed;
  }
  function wrapTunnel(entity) {
    const leftEdge = FIELD_X;
    const rightEdge = FIELD_X + COLS * TILE_W;
    if (entity.x < leftEdge - TILE_W) entity.x = rightEdge;
    else if (entity.x > rightEdge) entity.x = leftEdge - TILE_W;
  }

  // === GHOST CREATION ===
  function makeGhost(name, col, row, scatterCol, scatterRow, exitDelay) {
    const g = makeEntity(col, row, BASE_PAC_SPEED * levelConfig.ghostPct);
    g.name = name;
    g.color = GHOST_COLORS[name];
    g.mode = 'scatter';
    g.scatterTarget = { col: scatterCol, row: scatterRow };
    g.homeTarget = { col: 13, row: 12 };
    g.active = exitDelay === 0;
    g.exitDelay = exitDelay;
    g.exitTimer = 0;
    return g;
  }

  // === INIT ===
  function initEntities() {
    pacman = makeEntity(14, 23, BASE_PAC_SPEED);
    pacman.dir = 'left';
    ghosts = [
      makeGhost('blinky', 14, 11, 25, 0, 0),
      makeGhost('pinky',  12, 14, 2,  0, 5000),
      makeGhost('inky',   14, 14, 27, 30, 15000),
      makeGhost('clyde',  16, 14, 0,  30, 30000),
    ];
    ghostsEatenThisPellet = 0;
    modePhase = 0;
    currentMode = 'scatter';
    modeTimer = MODE_SEQUENCE[0].duration;
    frightTimer = 0;
    fruitActive = false;
    fruitTimer = 0;
    readyTimer = 1500;
    particles = [];
    floatingTexts = [];
    comboDisplay = null;
  }

  function resetPositions() {
    pacman.x = tileToPixelX(14); pacman.y = tileToPixelY(23);
    pacman.tileX = 14; pacman.tileY = 23;
    pacman.dir = 'left'; pacman.nextDir = null;
    ghosts[0].x = tileToPixelX(14); ghosts[0].y = tileToPixelY(11); ghosts[0].tileX = 14; ghosts[0].tileY = 11; ghosts[0].active = true; ghosts[0].exitDelay = 0; ghosts[0].exitTimer = 0;
    ghosts[1].x = tileToPixelX(12); ghosts[1].y = tileToPixelY(14); ghosts[1].tileX = 12; ghosts[1].tileY = 14; ghosts[1].active = false; ghosts[1].exitDelay = 5000; ghosts[1].exitTimer = 0;
    ghosts[2].x = tileToPixelX(14); ghosts[2].y = tileToPixelY(14); ghosts[2].tileX = 14; ghosts[2].tileY = 14; ghosts[2].active = false; ghosts[2].exitDelay = 15000; ghosts[2].exitTimer = 0;
    ghosts[3].x = tileToPixelX(16); ghosts[3].y = tileToPixelY(14); ghosts[3].tileX = 16; ghosts[3].tileY = 14; ghosts[3].active = false; ghosts[3].exitDelay = 30000; ghosts[3].exitTimer = 0;
    for (const g of ghosts) { g.dir = null; g.mode = currentMode; }
    ghostsEatenThisPellet = 0;
    frightTimer = 0;
    readyTimer = 1500;
    particles = [];
    floatingTexts = [];
  }

  function nextLevel() {
    level++;
    levelConfig = getLevelConfig(level);
    parseMaze();
    resetPositions();
    for (const g of ghosts) g.speed = BASE_PAC_SPEED * levelConfig.ghostPct;
    modePhase = 0;
    currentMode = 'scatter';
    modeTimer = MODE_SEQUENCE[0].duration;
  }


  // === PARTICLES ===
  function spawnParticles(type, x, y, color) {
    const spawn = (count, c, sizeRange, lifeMs, spread) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) particles.shift();
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const spd = spread * (0.5 + Math.random() * 0.5);
        particles.push({
          x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
          life: lifeMs, maxLife: lifeMs, color: c, size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
        });
      }
    };
    switch (type) {
      case 'dot': spawn(2, DOT_COLOR, [1,2], 150, 1); break;
      case 'power': spawn(8, POWER_COLOR, [2,4], 400, 2); break;
      case 'ghost': spawn(10, color, [2,4], 350, 1.5); break;
      case 'death': spawn(12, PAC_COLOR, [2,5], 600, 3); break;
      case 'fruit': spawn(6, FRUIT_COLOR, [2,3], 250, 2); break;
    }
  }
  function spawnWispTrail(ghost) {
    const trailCount = Math.min(3 + level - 1, 7);
    if (Math.random() > 0.3) return;
    if (particles.length >= MAX_PARTICLES) particles.shift();
    particles.push({
      x: ghost.x + (Math.random() - 0.5) * 4,
      y: ghost.y + (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.3 - Math.random() * 0.3,
      life: 200, maxLife: 200,
      color: ghost.color, size: 2 + Math.random() * 2
    });
  }
  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 0.5;
      ft.life -= dt;
      if (ft.life <= 0) floatingTexts.splice(i, 1);
    }
    if (comboDisplay) {
      comboDisplay.life -= dt;
      if (comboDisplay.life <= 0) comboDisplay = null;
    }
  }

  // === INPUT ===
  function onKeyDown(e) {
    if (e.key === 'ArrowUp')    { pacman.nextDir = 'up'; e.preventDefault(); }
    if (e.key === 'ArrowDown')  { pacman.nextDir = 'down'; e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { pacman.nextDir = 'left'; e.preventDefault(); }
    if (e.key === 'ArrowRight') { pacman.nextDir = 'right'; e.preventDefault(); }
    if (waitingToStart && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
      waitingToStart = false;
      startSiren();
    }
    if (gameOver && (e.key === 'Enter' || e.key === 'r')) {
      restartGame();
    }
  }
  document.addEventListener('keydown', onKeyDown);

  function restartGame() {
    score = 0; lives = STARTING_LIVES; level = 1;
    extraLifeAwarded = false;
    levelConfig = getLevelConfig(1);
    gameOver = false; gameOverAnim = 0;
    parseMaze();
    initEntities();
    waitingToStart = true;
  }

  // === MOVEMENT ===
  function movePacMan() {
    if (readyTimer > 0 || waitingToStart) return;
    updateTileCoords(pacman);
    if (pacman.nextDir && atTileCenter(pacman, 2)) {
      const nt = nextTile(pacman.tileX, pacman.tileY, pacman.nextDir);
      if (!isBlocked(nt.col, nt.row, true)) {
        pacman.dir = pacman.nextDir;
        pacman.nextDir = null;
        snapToTileCenter(pacman);
      }
    }
    if (pacman.dir) {
      const nt = nextTile(pacman.tileX, pacman.tileY, pacman.dir);
      if (isBlocked(nt.col, nt.row, true) && atTileCenter(pacman, pacman.speed)) {
        snapToTileCenter(pacman);
      } else {
        advanceEntity(pacman, pacman.speed);
      }
    }
    wrapTunnel(pacman);
    updateTileCoords(pacman);
    pacman.frame++;
  }

  // === GHOST AI ===
  function getGhostTarget(ghost) {
    if (ghost.mode === 'scatter') return ghost.scatterTarget;
    if (ghost.mode === 'frightened') return { col: Math.floor(Math.random() * COLS), row: Math.floor(Math.random() * ROWS) };
    if (ghost.mode === 'eaten') return ghost.homeTarget;
    // Chase mode
    switch (ghost.name) {
      case 'blinky': return { col: pacman.tileX, row: pacman.tileY };
      case 'pinky': {
        const ahead = level >= 4 ? 6 : 4;
        const o = DIR_OFFSETS[pacman.dir || 'left'];
        return { col: pacman.tileX + o[0] * ahead, row: pacman.tileY + o[1] * ahead };
      }
      case 'inky': {
        const o = DIR_OFFSETS[pacman.dir || 'left'];
        const ax = pacman.tileX + o[0] * 2;
        const ay = pacman.tileY + o[1] * 2;
        const blinky = ghosts[0];
        return { col: ax + (ax - blinky.tileX), row: ay + (ay - blinky.tileY) };
      }
      case 'clyde': {
        const threshold = level >= 4 ? 10 : 8;
        const dist = euclidDist(ghost.tileX, ghost.tileY, pacman.tileX, pacman.tileY);
        if (dist > threshold) return { col: pacman.tileX, row: pacman.tileY };
        return ghost.scatterTarget;
      }
    }
    return { col: 14, row: 14 };
  }

  function chooseGhostDirection(ghost) {
    const target = getGhostTarget(ghost);
    let bestDir = null, bestDist = Infinity;
    for (const dir of DIR_ORDER) {
      if (ghost.dir && dir === OPPOSITE[ghost.dir]) continue;
      const nt = nextTile(ghost.tileX, ghost.tileY, dir);
      if (!isValidTile(nt.col, nt.row)) continue;
      const t = maze[nt.row][nt.col];
      if (t === T_WALL) continue;
      if (ghost.mode !== 'eaten' && t === T_DOOR) continue;
      const d = euclidDist(nt.col, nt.row, target.col, target.row);
      if (d < bestDist) { bestDist = d; bestDir = dir; }
    }
    return bestDir;
  }

  function moveGhosts(dt) {
    if (readyTimer > 0 || waitingToStart) return;
    for (const ghost of ghosts) {
      // Exit delay
      if (!ghost.active) {
        ghost.exitTimer += dt;
        if (ghost.exitTimer >= ghost.exitDelay) {
          ghost.active = true;
          ghost.x = tileToPixelX(14); ghost.y = tileToPixelY(11);
          ghost.tileX = 14; ghost.tileY = 11;
          ghost.dir = 'left';
          ghost.mode = currentMode;
        }
        continue;
      }
      // Speed
      let speed = BASE_PAC_SPEED * levelConfig.ghostPct;
      if (ghost.mode === 'frightened') speed = BASE_PAC_SPEED * 0.5;
      else if (ghost.mode === 'eaten') speed = GHOST_EATEN_SPEED;
      // Tunnel slowdown
      if (ghost.tileY === 13 && (ghost.tileX <= 5 || ghost.tileX >= 22) && ghost.mode !== 'eaten') {
        speed = BASE_PAC_SPEED * 0.5;
      }
      // Cruise mode: L7+ Blinky with <10 dots
      if (ghost.name === 'blinky' && level >= 7 && dotsRemaining < 10) {
        speed = BASE_PAC_SPEED * 1.1;
      }

      updateTileCoords(ghost);
      if (atTileCenter(ghost, 2)) {
        // Eaten ghost reaching home
        if (ghost.mode === 'eaten' && ghost.tileX === ghost.homeTarget.col && Math.abs(ghost.tileY - ghost.homeTarget.row) <= 1) {
          ghost.x = tileToPixelX(14); ghost.y = tileToPixelY(14);
          ghost.tileX = 14; ghost.tileY = 14;
          ghost.mode = currentMode;
          ghost.dir = 'up';
          continue;
        }
        const newDir = chooseGhostDirection(ghost);
        if (newDir) ghost.dir = newDir;
        snapToTileCenter(ghost);
      }
      if (ghost.dir) advanceEntity(ghost, speed);
      wrapTunnel(ghost);
      updateTileCoords(ghost);
      // Wisp trail
      if (ghost.mode !== 'eaten') spawnWispTrail(ghost);
    }
  }



  // === RENDERING ===
  function drawMaze() {
    const pacTX = pacman.tileX, pacTY = pacman.tileY;
    const time = performance.now();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const t = maze[r][c];
        const px = FIELD_X + c * TILE_W;
        const py = FIELD_Y + r * TILE_H;
        if (t === T_WALL || t === T_DOOR) {
          const dist = euclidDist(c, r, pacTX, pacTY);
          ctx.fillStyle = dist <= 3 ? WALL_GLOW : WALL_COLOR;
          if (t === T_DOOR) ctx.fillStyle = '#ff6f00';
          ctx.fillRect(px + 1, py + 1, TILE_W - 2, TILE_H - 2);
        } else if (t === T_DOT) {
          const alpha = 0.8 + 0.2 * Math.sin(time / 1000);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = DOT_COLOR;
          ctx.beginPath();
          ctx.arc(px + TILE_W/2, py + TILE_H/2, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        } else if (t === T_POWER) {
          const alpha = 0.5 + 0.5 * Math.sin(time / 400);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = POWER_COLOR;
          ctx.shadowColor = POWER_COLOR;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(px + TILE_W/2, py + TILE_H/2, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function drawPacMan() {
    if (readyTimer > 0 && readyTimer < 500) return; // brief flash during ready
    const mouthAngle = 0.25 * Math.PI * Math.abs(Math.sin(pacman.frame * 0.15));
    const dirAngle = DIR_ANGLES[pacman.dir || 'left'];
    ctx.save();
    ctx.shadowColor = PAC_COLOR;
    ctx.shadowBlur = PAC_GLOW_PX;
    // Power pellet expanded glow
    if (frightTimer > 0) ctx.shadowBlur = 20;
    ctx.fillStyle = PAC_COLOR;
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, 10, dirAngle + mouthAngle, dirAngle - mouthAngle + Math.PI * 2);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawGhost(ghost) {
    if (!ghost.active && ghost.mode !== 'eaten') return;
    const gx = ghost.x, gy = ghost.y;
    let color = ghost.color;
    if (ghost.mode === 'frightened') {
      if (frightTimer < FRIGHT_FLASH_TIME) {
        color = Math.floor(performance.now() / 200) % 2 === 0 ? FRIGHT_COLOR : FRIGHT_FLASH;
      } else {
        color = FRIGHT_COLOR;
      }
    }
    if (ghost.mode === 'eaten') {
      // Eyes only
      drawGhostEyes(gx, gy, ghost.dir);
      return;
    }
    // Body: semicircle top + rect + wavy bottom
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(gx, gy - 2, 8, Math.PI, 0);
    ctx.lineTo(gx + 8, gy + 6);
    // Wavy bottom (3 bumps)
    for (let i = 0; i < 3; i++) {
      const bx = gx + 8 - (i + 1) * (16/3);
      ctx.quadraticCurveTo(gx + 8 - i * (16/3) - (16/6), gy + 10, bx, gy + 6);
    }
    ctx.closePath();
    ctx.fill();
    // Eyes
    if (ghost.mode === 'frightened') {
      // Hollow eyes for frightened
      ctx.fillStyle = EYES_COLOR;
      ctx.beginPath();
      ctx.arc(gx - 3, gy - 3, 2, 0, Math.PI * 2);
      ctx.arc(gx + 3, gy - 3, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawGhostEyes(gx, gy, ghost.dir);
    }
  }

  function drawGhostEyes(x, y, dir) {
    // White sclera
    ctx.fillStyle = EYES_COLOR;
    ctx.beginPath();
    ctx.arc(x - 3, y - 3, 3, 0, Math.PI * 2);
    ctx.arc(x + 3, y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    // Pupils (directional)
    const po = DIR_OFFSETS[dir || 'left'];
    ctx.fillStyle = '#2121de';
    ctx.beginPath();
    ctx.arc(x - 3 + po[0] * 1.5, y - 3 + po[1] * 1.5, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 3 + po[0] * 1.5, y - 3 + po[1] * 1.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFog() {
    let fogR = levelConfig.fogTiles;
    if (frightTimer > 0) fogR += 3;
    if (gameOver) {
      fogR *= Math.max(0, gameOverAnim / 1000);
    }
    const radiusPx = fogR * TILE_W;
    // Draw fog as a dark overlay with a hole at pacman
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    const gradient = ctx.createRadialGradient(pacman.x, pacman.y, 0, pacman.x, pacman.y, radiusPx);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawFruit() {
    if (!fruitActive) return;
    const fx = tileToPixelX(14), fy = tileToPixelY(17);
    const pulse = 0.7 + 0.3 * Math.sin(performance.now() / 300);
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = FRUIT_COLOR;
    ctx.shadowColor = FRUIT_COLOR;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(fx, fy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawParticles() {
    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha * 0.7;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Floating score texts
    for (const ft of floatingTexts) {
      const alpha = ft.life / ft.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ft.color;
      ctx.font = ft.size + 'px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
    // Combo display (Ghost Train)
    if (comboDisplay) {
      const alpha = comboDisplay.life / comboDisplay.maxLife;
      const scale = 1 + 0.3 * Math.sin((1 - alpha) * Math.PI);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COMBO_COLOR;
      const fontSize = (comboDisplay.legendary ? 28 : 24) * scale;
      ctx.font = 'bold ' + Math.round(fontSize) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(comboDisplay.legendary ? 'LEGENDARY' : '\u00d74 COMBO', comboDisplay.x, comboDisplay.y);
      ctx.globalAlpha = 1;
    }
  }

  function drawHUD() {
    ctx.fillStyle = SCORE_COLOR;
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE ' + score, 10, 12);
    ctx.textAlign = 'center';
    ctx.fillText('HIGH ' + highScore, W / 2, 12);
    ctx.textAlign = 'right';
    ctx.fillText('L' + level, W - 10, 12);
    // Lives (bottom left)
    ctx.textAlign = 'left';
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = PAC_COLOR;
      ctx.beginPath();
      ctx.arc(20 + i * 20, H - 10, 6, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(20 + i * 20, H - 10);
      ctx.fill();
    }
    // Fruit display (bottom center)
    ctx.fillStyle = FRUIT_COLOR;
    ctx.textAlign = 'center';
    ctx.font = '12px monospace';
    ctx.fillText(levelConfig.fruit, W / 2, H - 4);
  }

  function drawReady() {
    if (readyTimer > 0) {
      ctx.fillStyle = COMBO_COLOR;
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('READY!', W / 2, H / 2);
    }
  }

  function drawGameOverOverlay() {
    if (!gameOver) return;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = COMBO_COLOR;
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W / 2, H / 2 - 20);
    ctx.fillStyle = SCORE_COLOR;
    ctx.font = '16px monospace';
    ctx.fillText('Score: ' + score, W / 2, H / 2 + 10);
    ctx.fillText('High: ' + highScore, W / 2, H / 2 + 30);
    ctx.font = '14px monospace';
    ctx.fillText('Press Enter to restart', W / 2, H / 2 + 60);
  }

  function drawAll() {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    drawMaze();
    drawFruit();
    for (const g of ghosts) drawGhost(g);
    drawParticles();
    drawPacMan();
    drawFog();
    drawHUD();
    drawReady();
    if (gameOver) drawGameOverOverlay();
    if (waitingToStart && !gameOver) {
      ctx.fillStyle = SCORE_COLOR;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Press arrow key to start', W / 2, H / 2 + 40);
    }
  }



  // === GAME LOOP ===
  function update(dt) {
    if (gameOver) return;
    if (readyTimer > 0) { readyTimer -= dt; return; }
    movePacMan();
    moveGhosts(dt);
    checkDotCollection();
    checkFruitCollection();
    checkGhostCollisions();
    updateModeTimers(dt);
    updateFruitTimer(dt);
    updateParticles(dt);
  }

  function gameLoop(timestamp) {
    const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
    lastTime = timestamp;
    update(dt);
    updateParticles(dt * (gameOver ? 1 : 0)); // extra particle update for game over
    drawAll();
    rafId = requestAnimationFrame(gameLoop);
  }

  // === START ===
  canvas.width = W;
  canvas.height = H;
  parseMaze();
  initEntities();
  rafId = requestAnimationFrame(gameLoop);

  // === CLEANUP ===
  return function cleanup() {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('keydown', onKeyDown);
    stopSiren();
    rafId = null;
  };
}
