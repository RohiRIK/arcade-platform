/**
 * Tetris Cascade - Phase 3: arcade-evolution
 * Controls: Arrow keys move/rotate, Space hard drop, C hold, R restart, P pause
 * 600x400 canvas, all procedural rendering.
 */
function startTetrisCascade(canvas, ctx) {
  const W = 600, H = 400;
  const COLS = 10, ROWS = 20;
  const CELL_SIZE = 18;
  const WELL_X = 30;
  const WELL_Y = 16;
  const CELL_DRAW = 16;
  const PANEL_X = WELL_X + COLS * CELL_SIZE + 20;
  const PREVIEW_CELL = 14;
  const BG_COLOR = '#0a0e14';
  const WELL_BORDER = '#1c2833';
  const GRID_LINE = '#111820';
  const SCORE_COLOR = '#b0bec5';
  const LABEL_COLOR = '#78909c';
  const PIECE_COLORS = { I:'#00bcd4', O:'#ffc107', T:'#9c27b0', S:'#4caf50', Z:'#f44336', L:'#ff9800', J:'#2196f3' };
  const DROP_SPEEDS = [800,740,680,620,560,500,440,380,320,260,200,140];
  const MIN_DROP_SPEED = 100;
  const LOCK_DELAY = 500;
  const MAX_LOCK_RESETS = 15;
  const LINE_SCORES = [0, 100, 300, 500, 800];
  const TSPIN_MULTIPLIER = 2;
  const COMBO_BONUS = 50;
  const MELTDOWN_MULTIPLIER = 1.5;
  const LINES_PER_LEVEL = 10;
  const PARTICLE_CAP = 200;
  const PIECES = {
    I:[[[0,1],[1,1],[2,1],[3,1]],[[2,0],[2,1],[2,2],[2,3]],[[0,2],[1,2],[2,2],[3,2]],[[1,0],[1,1],[1,2],[1,3]]],
    O:[[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]]],
    T:[[[1,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[2,1],[1,2]],[[0,1],[1,1],[2,1],[1,2]],[[1,0],[0,1],[1,1],[1,2]]],
    S:[[[1,0],[2,0],[0,1],[1,1]],[[1,0],[1,1],[2,1],[2,2]],[[1,1],[2,1],[0,2],[1,2]],[[0,0],[0,1],[1,1],[1,2]]],
    Z:[[[0,0],[1,0],[1,1],[2,1]],[[2,0],[1,1],[2,1],[1,2]],[[0,1],[1,1],[1,2],[2,2]],[[1,0],[0,1],[1,1],[0,2]]],
    L:[[[2,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[1,2],[2,2]],[[0,1],[1,1],[2,1],[0,2]],[[0,0],[1,0],[1,1],[1,2]]],
    J:[[[0,0],[0,1],[1,1],[2,1]],[[1,0],[2,0],[1,1],[1,2]],[[0,1],[1,1],[2,1],[2,2]],[[1,0],[1,1],[0,2],[1,2]]],
  };
  const KICK_JLSTZ = {
    '0>1':[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],'1>0':[[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    '1>2':[[0,0],[1,0],[1,1],[0,-2],[1,-2]],'2>1':[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '2>3':[[0,0],[1,0],[1,-1],[0,2],[1,2]],'3>2':[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '3>0':[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],'0>3':[[0,0],[1,0],[1,-1],[0,2],[1,2]],
  };
  const KICK_I = {
    '0>1':[[0,0],[-2,0],[1,0],[-2,1],[1,-2]],'1>0':[[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
    '1>2':[[0,0],[-1,0],[2,0],[-1,-2],[2,1]],'2>1':[[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
    '2>3':[[0,0],[2,0],[-1,0],[2,-1],[-1,2]],'3>2':[[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
    '3>0':[[0,0],[1,0],[-2,0],[1,2],[-2,-1]],'0>3':[[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
  };
  const SFX = {
    metal_tick:    function(){ try{zzfx(...[.2,,600,.01,.03,.01,1,1,,,,,,,,,,,.01]);}catch(e){} },
    gear_click:    function(){ try{zzfx(...[.2,,800,.01,.02,.01,1,1,,,,,,,,,,,.02]);}catch(e){} },
    clamp_thud:    function(){ try{zzfx(...[.3,,150,.01,.08,.05,2,1,,,,,,,,,,,.03]);}catch(e){} },
    slam_impact:   function(){ try{zzfx(...[.5,,80,.01,.12,.08,3,2,,,,,,,,,,,.05]);}catch(e){} },
    drain_hiss:    function(){ try{zzfx(...[.3,,2000,.01,.3,.2,4,1,,-10,,,,,,,,,.1]);}catch(e){} },
    meltdown_boom: function(){ try{zzfx(...[.6,,50,.02,.5,.3,2,2,,,,,,,,,.1,.5,.02]);}catch(e){} },
    power_surge:   function(){ try{zzfx(...[.4,,200,.01,.4,.1,1,2,,,,800,,,,,,,,.1]);}catch(e){} },
    shutdown_snd:  function(){ try{zzfx(...[.4,,400,.02,.6,.3,2,1,,-5,,,,,,,,,.2]);}catch(e){} },
  };
  var board, currentPiece, nextPiece, holdPiece, holdUsed;
  var score, level, linesCleared, highScore;
  var comboCount, gameOver, paused;
  var dropTimer, lockTimer, lockResets;
  var particles, ambientParticles;
  var animFrameId, lastTime;
  var screenShake, flashText, levelUpFlash, lineClearAnim, gameOverAnim;
  var bagQueue, lastMoveWasRotation;
  function init() {
    board = [];
    for (var r = 0; r < ROWS; r++) { board[r] = []; for (var c = 0; c < COLS; c++) board[r][c] = null; }
    score = 0; level = 1; linesCleared = 0; comboCount = 0;
    gameOver = false; paused = false;
    dropTimer = 0; lockTimer = 0; lockResets = 0;
    particles = []; ambientParticles = [];
    screenShake = null; flashText = null; levelUpFlash = null;
    lineClearAnim = null; gameOverAnim = null;
    bagQueue = []; lastMoveWasRotation = false;
    holdPiece = null; holdUsed = false;
    highScore = 0;
    try { highScore = Math.max(0, Math.min(999999, parseInt(localStorage.getItem('tetrisCascadeHigh')) || 0)); } catch(e){}
    nextPiece = null;
    spawnNextPiece();
    lastTime = performance.now();
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(gameLoop);
  }
  function fillBag() { bagQueue = shuffle(['I','O','T','S','Z','L','J']); }
  function shuffle(arr) { for (var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;} return arr; }
  function nextFromBag() { if (!bagQueue.length) fillBag(); return bagQueue.pop(); }
  function spawnPiece(type) {
    currentPiece = { type:type, rotation:0, col:3, row:-1, color:PIECE_COLORS[type] };
    lastMoveWasRotation = false; dropTimer = 0; lockTimer = 0; lockResets = 0;
    if (!canPlace(type,0,3,-1)&&!canPlace(type,0,3,0)) {
      gameOver = true; SFX.shutdown_snd();
      gameOverAnim = { row:ROWS-1, elapsed:0 };
      if (score>highScore){highScore=score;try{localStorage.setItem('tetrisCascadeHigh',highScore);}catch(e){}}
    }
  }
  function spawnNextPiece() {
    if (!nextPiece) nextPiece = { type:nextFromBag() };
    spawnPiece(nextPiece.type);
    nextPiece = { type:nextFromBag() };
  }
  function canPlace(type,rotation,col,row) {
    var cells=PIECES[type][rotation];
    for (var i=0;i<cells.length;i++){var x=col+cells[i][0],y=row+cells[i][1];if(x<0||x>=COLS)return false;if(y>=ROWS)return false;if(y>=0&&board[y][x]!==null)return false;}
    return true;
  }
  function tryMove(dx,dy) {
    var p=currentPiece;
    if (canPlace(p.type,p.rotation,p.col+dx,p.row+dy)){p.col+=dx;p.row+=dy;lastMoveWasRotation=false;
      if(dy===0&&!canPlace(p.type,p.rotation,p.col,p.row+1)){if(lockResets<MAX_LOCK_RESETS){lockTimer=0;lockResets++;}}
      return true;}
    return false;
  }
  function tryRotate(dir) {
    var p=currentPiece,newRot=(p.rotation+dir+4)%4;
    var table=(p.type==='I')?KICK_I:KICK_JLSTZ;
    var key=p.rotation+'>'+newRot,kicks=table[key];
    if(!kicks)return false;
    for(var i=0;i<kicks.length;i++){var dx=kicks[i][0],dy=kicks[i][1];
      if(canPlace(p.type,newRot,p.col+dx,p.row+dy)){p.col+=dx;p.row+=dy;p.rotation=newRot;lastMoveWasRotation=true;
        if(!canPlace(p.type,p.rotation,p.col,p.row+1)){if(lockResets<MAX_LOCK_RESETS){lockTimer=0;lockResets++;}}
        return true;}}
    return false;
  }
  function isTSpin() {
    var p=currentPiece;if(p.type!=='T'||!lastMoveWasRotation)return false;
    var cx=p.col+1,cy=p.row+1,filled=0;
    var corners=[[cx-1,cy-1],[cx+1,cy-1],[cx-1,cy+1],[cx+1,cy+1]];
    for(var i=0;i<4;i++){var x=corners[i][0],y=corners[i][1];if(x<0||x>=COLS||y<0||y>=ROWS||(y>=0&&board[y][x]!==null))filled++;}
    return filled>=3;
  }
  function getGhostRow(){var p=currentPiece,r=p.row;while(canPlace(p.type,p.rotation,p.col,r+1))r++;return r;}
  function getDropSpeed(){return level>DROP_SPEEDS.length?MIN_DROP_SPEED:DROP_SPEEDS[level-1];}
  function hardDrop(){var p=currentPiece,dist=0;while(canPlace(p.type,p.rotation,p.col,p.row+1)){p.row++;dist++;}score+=dist*2;SFX.slam_impact();screenShake={amplitude:2,duration:150,elapsed:0};lockPiece();}
  function holdSwap(){if(holdUsed)return;if(level<3)return;holdUsed=true;if(!holdPiece){holdPiece={type:currentPiece.type};spawnNextPiece();}else{var t=holdPiece.type;holdPiece={type:currentPiece.type};spawnPiece(t);}}
  function findFullRows(){var full=[];for(var r=0;r<ROWS;r++){var ok=true;for(var c=0;c<COLS;c++){if(!board[r][c]){ok=false;break;}}if(ok)full.push(r);}return full;}
  function removeRows(rows){rows.sort(function(a,b){return a-b;});for(var i=rows.length-1;i>=0;i--){board.splice(rows[i],1);var nr=[];for(var c=0;c<COLS;c++)nr.push(null);board.unshift(nr);}}
  function lockPiece(){
    var p=currentPiece;SFX.clamp_thud();
    var cells=PIECES[p.type][p.rotation];
    for(var i=0;i<cells.length;i++){var x=p.col+cells[i][0],y=p.row+cells[i][1];
      if(y<0){gameOver=true;SFX.shutdown_snd();gameOverAnim={row:ROWS-1,elapsed:0};if(score>highScore){highScore=score;try{localStorage.setItem('tetrisCascadeHigh',highScore);}catch(e){}}return;}
      board[y][x]=p.color;}
    for(var i=0;i<cells.length;i++){addParticle(WELL_X+(p.col+cells[i][0])*CELL_SIZE+CELL_SIZE/2,WELL_Y+(p.row+cells[i][1])*CELL_SIZE+CELL_SIZE/2,'#ffffff',150,3);}
    var clearedRows=findFullRows();
    if(clearedRows.length>0){
      var ts=isTSpin();var bs=LINE_SCORES[Math.min(clearedRows.length,4)]*level;
      if(ts)bs*=TSPIN_MULTIPLIER;if(level>=12)bs=Math.floor(bs*MELTDOWN_MULTIPLIER);
      comboCount++;score+=bs+comboCount*COMBO_BONUS*level;
      var dur=clearedRows.length>=4?800:clearedRows.length===3?600:clearedRows.length===2?500:400;
      lineClearAnim={rows:clearedRows.slice(),elapsed:0,duration:dur};
      if(clearedRows.length===4){SFX.meltdown_boom();screenShake={amplitude:level>=12?3:2,duration:300,elapsed:0};}else SFX.drain_hiss();
      if(ts)showFlash('T-SPIN','#9c27b0',20,800);
      if(comboCount>1)showFlash('COMBO x'+comboCount,'#ffc107',18,600);
      if(clearedRows.length===4)showFlash('TETRIS!','#ffc107',level>=12?42:36,1000);
      for(var ri=0;ri<clearedRows.length;ri++){for(var c=0;c<COLS;c++){
        var px=WELL_X+c*CELL_SIZE+CELL_SIZE/2,py=WELL_Y+clearedRows[ri]*CELL_SIZE+CELL_SIZE/2;
        var cl=board[clearedRows[ri]][c]||'#fff';addParticle(px,py,cl,500,2);
        if(clearedRows.length===4){addParticle(px,py-5,cl,700,2);addParticle(px,py+5,cl,700,2);}}}
      linesCleared+=clearedRows.length;var nl=Math.floor(linesCleared/LINES_PER_LEVEL)+1;
      if(nl>level){level=nl;SFX.power_surge();levelUpFlash={elapsed:0,duration:600};showFlash('LEVEL '+level,'#00bcd4',24,800);}
      removeRows(clearedRows);
    }else{comboCount=0;}
    if(!gameOver){spawnNextPiece();holdUsed=false;}
  }
  // === PARTICLES ===
  function addParticle(x,y,color,life,size){
    if(particles.length>=PARTICLE_CAP)return;
    particles.push({x:x,y:y,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3-1,color:color,life:life,maxLife:life,size:size||2});
  }
  function updateParticles(dt){for(var i=particles.length-1;i>=0;i--){var p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.02;p.life-=dt;if(p.life<=0)particles.splice(i,1);}}
  function updateAmbientParticles(dt){
    var target=level>=12?12:level>=9?8:level>=6?6:3;
    while(ambientParticles.length<target){
      var cols=level>=12?Object.values(PIECE_COLORS):level>=9?['#ff9800','#f44336']:['#444'];
      ambientParticles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,
        color:cols[Math.floor(Math.random()*cols.length)],size:1+Math.random(),alpha:0.06+Math.random()*0.04});}
    for(var i=0;i<ambientParticles.length;i++){var a=ambientParticles[i];a.x+=a.vx;a.y+=a.vy;
      if(a.x<0)a.x=W;if(a.x>W)a.x=0;if(a.y<0)a.y=H;if(a.y>H)a.y=0;}
    while(ambientParticles.length>target)ambientParticles.pop();
  }
  function showFlash(text,color,size,dur){flashText={text:text,color:color,size:size,elapsed:0,duration:dur};}
  // === INPUT ===
  function keyHandler(e){
    if(gameOver){if(e.key==='r'||e.key==='R'){init();e.preventDefault();}return;}
    if(e.key==='p'||e.key==='P'){paused=!paused;e.preventDefault();return;}
    if(paused)return;
    switch(e.key){
      case'ArrowLeft':if(tryMove(-1,0))SFX.metal_tick();e.preventDefault();break;
      case'ArrowRight':if(tryMove(1,0))SFX.metal_tick();e.preventDefault();break;
      case'ArrowDown':if(tryMove(0,1)){score+=1;dropTimer=0;}e.preventDefault();break;
      case'ArrowUp':if(tryRotate(1))SFX.gear_click();e.preventDefault();break;
      case' ':hardDrop();e.preventDefault();break;
      case'c':case'C':holdSwap();e.preventDefault();break;
    }
  }
  document.addEventListener('keydown',keyHandler);
  // === GAME LOOP ===
  function gameLoop(timestamp){
    var dt=timestamp-lastTime;lastTime=timestamp;if(dt>100)dt=100;
    if(gameOver){
      if(gameOverAnim){gameOverAnim.elapsed+=dt;
        if(gameOverAnim.elapsed>50){gameOverAnim.elapsed=0;
          if(gameOverAnim.row>=0){for(var c=0;c<COLS;c++)if(board[gameOverAnim.row][c])board[gameOverAnim.row][c]='#333';gameOverAnim.row--;}}}
      render();animFrameId=requestAnimationFrame(gameLoop);return;
    }
    if(paused){render();animFrameId=requestAnimationFrame(gameLoop);return;}
    dropTimer+=dt;var spd=getDropSpeed();
    if(dropTimer>=spd){
      if(canPlace(currentPiece.type,currentPiece.rotation,currentPiece.col,currentPiece.row+1)){currentPiece.row++;dropTimer=0;lockTimer=0;}
      else{lockTimer+=dt;if(lockTimer>=LOCK_DELAY)lockPiece();}
      dropTimer=0;
    }else if(!canPlace(currentPiece.type,currentPiece.rotation,currentPiece.col,currentPiece.row+1)){
      lockTimer+=dt;if(lockTimer>=LOCK_DELAY)lockPiece();
    }
    updateParticles(dt);updateAmbientParticles(dt);
    if(screenShake){screenShake.elapsed+=dt;if(screenShake.elapsed>=screenShake.duration)screenShake=null;}
    if(flashText){flashText.elapsed+=dt;if(flashText.elapsed>=flashText.duration)flashText=null;}
    if(levelUpFlash){levelUpFlash.elapsed+=dt;if(levelUpFlash.elapsed>=levelUpFlash.duration)levelUpFlash=null;}
    if(lineClearAnim){lineClearAnim.elapsed+=dt;if(lineClearAnim.elapsed>=lineClearAnim.duration)lineClearAnim=null;}
    render();animFrameId=requestAnimationFrame(gameLoop);
  }
  // === RENDERING ===
  function render(){
    var sx=0,sy=0;
    if(screenShake){var a=screenShake.amplitude;sx=(Math.random()-0.5)*a*2;sy=(Math.random()-0.5)*a*2;}
    ctx.save();ctx.translate(sx,sy);
    // Background with tension
    var bgColor=getBgColor();ctx.fillStyle=bgColor;ctx.fillRect(0,0,W,H);
    // Ambient particles
    for(var i=0;i<ambientParticles.length;i++){var ap=ambientParticles[i];ctx.globalAlpha=ap.alpha;ctx.fillStyle=ap.color;ctx.fillRect(ap.x,ap.y,ap.size,ap.size);}
    ctx.globalAlpha=1;
    // Stage 3+ grid oscillation
    var gridAlpha=1;if(level>=6){gridAlpha=0.5+0.5*Math.sin(performance.now()/2000);}
    // Well background
    ctx.fillStyle=BG_COLOR;ctx.fillRect(WELL_X,WELL_Y,COLS*CELL_SIZE,ROWS*CELL_SIZE);
    // Grid lines
    ctx.globalAlpha=gridAlpha*0.3;ctx.strokeStyle=GRID_LINE;ctx.lineWidth=1;
    for(var c=0;c<=COLS;c++){ctx.beginPath();ctx.moveTo(WELL_X+c*CELL_SIZE,WELL_Y);ctx.lineTo(WELL_X+c*CELL_SIZE,WELL_Y+ROWS*CELL_SIZE);ctx.stroke();}
    for(var r=0;r<=ROWS;r++){ctx.beginPath();ctx.moveTo(WELL_X,WELL_Y+r*CELL_SIZE);ctx.lineTo(WELL_X+COLS*CELL_SIZE,WELL_Y+r*CELL_SIZE);ctx.stroke();}
    ctx.globalAlpha=1;
    // Stage 2+ radial gradient
    if(level>=3){ctx.save();var grd=ctx.createRadialGradient(WELL_X+COLS*CELL_SIZE/2,WELL_Y+ROWS*CELL_SIZE/2,10,WELL_X+COLS*CELL_SIZE/2,WELL_Y+ROWS*CELL_SIZE/2,ROWS*CELL_SIZE/2);grd.addColorStop(0,'rgba(30,50,70,0.15)');grd.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grd;ctx.fillRect(WELL_X,WELL_Y,COLS*CELL_SIZE,ROWS*CELL_SIZE);ctx.restore();}
    // Board cells
    for(var r=0;r<ROWS;r++){for(var c=0;c<COLS;c++){if(board[r][c]){drawCell(WELL_X+c*CELL_SIZE,WELL_Y+r*CELL_SIZE,board[r][c]);}}}
    // Ghost piece
    if(!gameOver&&currentPiece){
      var gr=getGhostRow();var cells=PIECES[currentPiece.type][currentPiece.rotation];
      ctx.globalAlpha=0.2;ctx.strokeStyle=currentPiece.color;ctx.lineWidth=2;
      for(var i=0;i<cells.length;i++){var x=WELL_X+(currentPiece.col+cells[i][0])*CELL_SIZE+1,y=WELL_Y+(gr+cells[i][1])*CELL_SIZE+1;
        if(gr+cells[i][1]>=0)ctx.strokeRect(x,y,CELL_DRAW,CELL_DRAW);}
      ctx.globalAlpha=1;ctx.lineWidth=1;
    }
    // Current piece
    if(!gameOver&&currentPiece){var cells=PIECES[currentPiece.type][currentPiece.rotation];
      for(var i=0;i<cells.length;i++){var y=currentPiece.row+cells[i][1];if(y>=0)drawCell(WELL_X+(currentPiece.col+cells[i][0])*CELL_SIZE,WELL_Y+y*CELL_SIZE,currentPiece.color);}}
    // Line clear animation overlay
    if(lineClearAnim){var prog=lineClearAnim.elapsed/lineClearAnim.duration;
      for(var ri=0;ri<lineClearAnim.rows.length;ri++){var row=lineClearAnim.rows[ri];
        ctx.fillStyle='rgba(255,255,255,'+(0.3*(1-prog))+')';ctx.fillRect(WELL_X,WELL_Y+row*CELL_SIZE,COLS*CELL_SIZE,CELL_SIZE);}}
    // Well border
    ctx.strokeStyle=WELL_BORDER;ctx.lineWidth=2;
    if(level>=9){ctx.globalAlpha=0.7+0.3*Math.sin(performance.now()/500);}
    ctx.strokeRect(WELL_X-1,WELL_Y-1,COLS*CELL_SIZE+2,ROWS*CELL_SIZE+2);ctx.globalAlpha=1;
    // Level up flash
    if(levelUpFlash){var a=1-levelUpFlash.elapsed/levelUpFlash.duration;ctx.strokeStyle='rgba(0,188,212,'+a+')';ctx.lineWidth=3;ctx.strokeRect(WELL_X-3,WELL_Y-3,COLS*CELL_SIZE+6,ROWS*CELL_SIZE+6);ctx.lineWidth=1;}
    // Right panel
    drawPanel();
    // Particles
    for(var i=0;i<particles.length;i++){var p=particles[i];ctx.globalAlpha=p.life/p.maxLife;ctx.fillStyle=p.color;ctx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);}
    ctx.globalAlpha=1;
    // Flash text
    if(flashText){var prog=flashText.elapsed/flashText.duration;var scale=1+0.2*Math.sin(prog*Math.PI);
      ctx.save();ctx.translate(W/2,H/2);ctx.scale(scale,scale);ctx.font='bold '+flashText.size+'px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=flashText.color;ctx.globalAlpha=1-prog;ctx.fillText(flashText.text,0,0);ctx.restore();ctx.globalAlpha=1;}
    // Game over overlay
    if(gameOver&&gameOverAnim&&gameOverAnim.row<0){
      ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(0,0,W,H);
      ctx.font='bold 32px monospace';ctx.textAlign='center';ctx.fillStyle='#f44336';ctx.fillText('GAME OVER',W/2,H/2-50);
      ctx.font='18px monospace';ctx.fillStyle=SCORE_COLOR;ctx.fillText('Score: '+score,W/2,H/2-10);
      ctx.fillText('High Score: '+highScore,W/2,H/2+20);
      if(score>=highScore&&score>0){ctx.font='bold 24px monospace';ctx.fillStyle='#ffc107';
        var pulse=1+0.1*Math.sin(performance.now()/200);ctx.save();ctx.translate(W/2,H/2+55);ctx.scale(pulse,pulse);ctx.fillText('NEW BEST!',0,0);ctx.restore();}
      ctx.font='14px monospace';ctx.fillStyle=LABEL_COLOR;ctx.fillText('Press R to restart',W/2,H/2+90);
    }
    // Pause overlay
    if(paused){ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(0,0,W,H);ctx.font='bold 28px monospace';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('PAUSED',W/2,H/2);}
    ctx.restore();
  }
  function drawCell(x,y,color){
    ctx.fillStyle=color;ctx.fillRect(x+1,y+1,CELL_DRAW,CELL_DRAW);
    // Bevel
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(x+1,y+1,CELL_DRAW,1);ctx.fillRect(x+1,y+1,1,CELL_DRAW);
    ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(x+1,y+CELL_DRAW,CELL_DRAW,1);ctx.fillRect(x+CELL_DRAW,y+1,1,CELL_DRAW);
  }
  function getBgColor(){
    var highestRow=ROWS;for(var r=0;r<ROWS;r++){for(var c=0;c<COLS;c++){if(board[r][c]){highestRow=r;r=ROWS;break;}}}
    var tension=Math.max(0,Math.min(1,(ROWS-highestRow)/ROWS));
    var r2=Math.round(0x0a+(0x1a-0x0a)*tension),g=Math.round(0x0e+(0x0a-0x0e)*tension),b=Math.round(0x14+(0x0a-0x14)*tension);
    return 'rgb('+r2+','+g+','+b+')';
  }
  function drawPanel(){
    ctx.font='11px monospace';ctx.textAlign='left';
    ctx.fillStyle=LABEL_COLOR;ctx.fillText('NEXT',PANEL_X,30);
    if(nextPiece)drawPreview(nextPiece.type,PANEL_X,35);
    if(level>=3){ctx.fillStyle=LABEL_COLOR;ctx.fillText('HOLD',PANEL_X,110);if(holdPiece)drawPreview(holdPiece.type,PANEL_X,115);}
    ctx.fillStyle=LABEL_COLOR;ctx.fillText('SCORE',PANEL_X,200);ctx.fillStyle=SCORE_COLOR;ctx.font='14px monospace';ctx.fillText(''+score,PANEL_X,218);
    ctx.font='11px monospace';ctx.fillStyle=LABEL_COLOR;ctx.fillText('LEVEL',PANEL_X,248);ctx.fillStyle=SCORE_COLOR;ctx.font='14px monospace';ctx.fillText(''+level,PANEL_X,266);
    ctx.font='11px monospace';ctx.fillStyle=LABEL_COLOR;ctx.fillText('LINES',PANEL_X,296);ctx.fillStyle=SCORE_COLOR;ctx.font='14px monospace';ctx.fillText(''+linesCleared,PANEL_X,314);
    ctx.font='11px monospace';ctx.fillStyle=LABEL_COLOR;ctx.fillText('HIGH',PANEL_X,344);ctx.fillStyle=SCORE_COLOR;ctx.font='14px monospace';ctx.fillText(''+highScore,PANEL_X,362);
    // Combo display (stage 4+)
    if(level>=9&&comboCount>1){ctx.font='bold 12px monospace';ctx.fillStyle='#ffc107';ctx.fillText('COMBO x'+comboCount,PANEL_X,385);}
  }
  function drawPreview(type,x,y){
    var cells=PIECES[type][0];var color=PIECE_COLORS[type];
    for(var i=0;i<cells.length;i++){ctx.fillStyle=color;ctx.fillRect(x+cells[i][0]*PREVIEW_CELL,y+cells[i][1]*PREVIEW_CELL,PREVIEW_CELL-2,PREVIEW_CELL-2);}
  }
  // === INIT & RETURN ===
  init();
  return {
    controls: 'Arrow keys: Move/Rotate | Space: Hard Drop | C: Hold | P: Pause | R: Restart',
    cleanup: function(){cancelAnimationFrame(animFrameId);document.removeEventListener('keydown',keyHandler);animFrameId=null;}
  };
}
