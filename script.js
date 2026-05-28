const SIZE = 10;
let playerBoard = [];
let enemyBoard = [];
let gameOver = false;
let aiTargets = [];

const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');

const shipTypes = [
  { size: 5, emoji: '🚢' }, // Porta-aviões
  { size: 4, emoji: '⛴️' }, // Navio de guerra
  { size: 3, emoji: '🛥️' }, // Submarino
  { size: 3, emoji: '🛥️' }, // Submarino
  { size: 2, emoji: '⛵' }  // Barco pequeno
];

const directions = [[-1,0],[1,0],[0,-1],[0,1]];

function createBoards() {
  playerBoardEl.innerHTML = '';
  enemyBoardEl.innerHTML = '';
  playerBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  enemyBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));

  for (let i = 0; i < SIZE*SIZE; i++) {
    const p = document.createElement('div');
    p.classList.add('cell');
    playerBoardEl.appendChild(p);

    const e = document.createElement('div');
    e.classList.add('cell');
    e.dataset.index = i;
    e.addEventListener('click', handlePlayerShot);
    enemyBoardEl.appendChild(e);
  }
}

function placeShips(board, isPlayer) {
  shipTypes.forEach((ship, index) => {
    let placed = false;
    while (!placed) {
      const horizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);

      if (canPlace(board, row, col, ship.size, horizontal)) {
        for (let i = 0; i < ship.size; i++) {
          const r = horizontal ? row : row + i;
          const c = horizontal ? col + i : col;
          board[r][c] = index + 1; // marca qual navio
        }
        placed = true;
      }
    }
  });
}

function canPlace(board, row, col, size, horizontal) {
  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r][c] !== 0) return false;
  }
  return true;
}

function showPlayerShips() {
  shipTypes.forEach((ship, index) => {
    const shipNumber = index + 1;
    playerBoard.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === shipNumber) {
          const idx = r * SIZE + c;
          const el = playerBoardEl.children[idx];
          el.classList.add('ship');
          el.textContent = ship.emoji;
        }
      });
    });
  });
}

// ==================== IA AVANÇADA ====================
function computerAttack() {
  if (gameOver) return;
  // (mesma lógica da versão anterior - mantida avançada)
  let row, col;
  do {
    row = Math.floor(Math.random() * SIZE);
    col = Math.floor(Math.random() * SIZE);
  } while (playerBoard[row][col] < 0);

  const index = row * SIZE + col;
  const cell = playerBoardEl.children[index];
  const isHit = playerBoard[row][col] > 0;

  if (isHit) {
    cell.classList.add('hit');
    cell.textContent = '💥';
    playerBoard[row][col] = -2;
    statusEl.textContent = "💥 A IA acertou seu navio!";
  } else {
    cell.classList.add('miss');
    cell.textContent = '🌊';
    playerBoard[row][col] = -1;
    statusEl.textContent = "🌊 A IA errou!";
  }

  if (playerBoard.flat().every(v => v <= 0)) {
    statusEl.textContent = "😢 A IA VENCEU!";
    gameOver = true;
  }
}

function handlePlayerShot(e) {
  if (gameOver) return;
  const index = parseInt(e.target.dataset.index);
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;

  if (enemyBoard[row][col] < 0) return;

  const isHit = enemyBoard[row][col] > 0;

  if (isHit) {
    e.target.classList.add('hit');
    e.target.textContent = '💥';
    enemyBoard[row][col] = -2;
    statusEl.textContent = "💥 Acertou em cheio!";
  } else {
    e.target.classList.add('miss');
    e.target.textContent = '🌊';
    enemyBoard[row][col] = -1;
    statusEl.textContent = "🌊 Errou!";
  }

  if (enemyBoard.flat().every(v => v <= 0)) {
    statusEl.textContent = "🎉 VOCÊ VENCEU A BATALHA 4D!";
    gameOver = true;
    return;
  }

  setTimeout(computerAttack, 800);
}

function newGame() {
  gameOver = false;
  aiTargets = [];
  createBoards();
  placeShips(playerBoard, true);
  placeShips(enemyBoard, false);
  showPlayerShips();
  statusEl.textContent = "🔥 Clique no tabuleiro inimigo para atacar!";
}

newGame();