const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let lives = 3;
let gameOver = false;

const player = {
  x: 375,
  y: 500,
  width: 60,
  height: 50,
  speed: 8
};

let bullets = [];
let enemies = [];
let enemyBullets = [];

// Controles
let keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

canvas.addEventListener('click', shoot);

function shoot() {
  if (gameOver) return;
  bullets.push({
    x: player.x + 25,
    y: player.y,
    width: 6,
    height: 20,
    speed: 12
  });
}

function createEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 60),
    y: -60,
    width: 55,
    height: 50,
    speed: 2 + Math.random() * 2
  });
}

function drawOcean() {
  ctx.fillStyle = '#001f3f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Ondas
  ctx.strokeStyle = 'rgba(0, 150, 255, 0.3)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 80 + i * 60 + Math.sin(Date.now()/500) * 10);
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.lineTo(x, 80 + i * 60 + Math.sin(x/50 + Date.now()/400) * 15);
    }
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.fillStyle = '#00ff88';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(player.x + 20, player.y - 10, 20, 15); // canhão
}

function update() {
  if (gameOver) return;

  // Movimento do jogador
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

  // Atualizar balas
  bullets = bullets.filter(b => {
    b.y -= b.speed;
    return b.y > 0;
  });

  // Atualizar inimigos
  enemies.forEach((e, i) => {
    e.y += e.speed;

    // Inimigo atira
    if (Math.random() < 0.02) {
      enemyBullets.push({
        x: e.x + 25,
        y: e.y + 50,
        width: 6,
        height: 18,
        speed: 6
      });
    }

    // Colisão com jogador
    if (e.y + e.height > player.y && 
        e.x < player.x + player.width && 
        e.x + e.width > player.x) {
      lives--;
      enemies.splice(i, 1);
      if (lives <= 0) gameOver = true;
    }
  });

  // Atualizar balas inimigas
  enemyBullets = enemyBullets.filter(b => {
    b.y += b.speed;
    return b.y < canvas.height;
  });

  // Colisão bala x inimigo
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x > e.x && b.x < e.x + e.width &&
          b.y > e.y && b.y < e.y + e.height) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score += 100;
      }
    });
  });

  // Gerar inimigos
  if (Math.random() < 0.03) createEnemy();
}

function draw() {
  drawOcean();
  drawPlayer();

  // Desenhar balas do jogador
  ctx.fillStyle = '#ffff00';
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  // Desenhar inimigos (navios vermelhos)
  ctx.fillStyle = '#ff3366';
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(e.x + 20, e.y + 10, 15, 10); // canhão inimigo
    ctx.fillStyle = '#ff3366';
  });

  // Balas inimigas
  ctx.fillStyle = '#ff8800';
  enemyBullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = lives;

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff0000';
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER', 220, 280);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  bullets = [];
  enemies = [];
  enemyBullets = [];
  player.x = 375;
}

gameLoop();