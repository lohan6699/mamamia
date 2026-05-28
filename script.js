const SIZE = 10;
let playerBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let enemyBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let enemyShips = [];
let gameOver = false;

const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');

// Tamanhos dos navios
const shipSizes = [5, 4, 3, 3, 2];

// Criar tabuleiros
function createBoards() {
  playerBoardEl.innerHTML = '';
  enemyBoardEl.innerHTML = '';

  for (let i = 0; i < SIZE * SIZE; i++) {
    // Tabuleiro do Jogador
    const pCell = document.createElement('div');
    pCell.classList.add('cell', 'player-cell');
    pCell.dataset.index = i;
    playerBoardEl.appendChild(pCell);

    // Tabuleiro do Inimigo
    const eCell = document.createElement('div');
    eCell.classList.add('cell');
    eCell.dataset.index = i;
    eCell.addEventListener('click', handlePlayerShot);
    enemyBoardEl.appendChild(eCell);
  }
}

// Colocar navios aleatoriamente
function placeShips(board, isPlayer) {
  shipSizes.forEach(size => {
    let placed = false;
    while (!placed) {
      const horizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);

      if (canPlaceShip(board, row, col, size, horizontal)) {
        placeShipOnBoard(board, row, col, size, horizontal, isPlayer);
        placed = true;
      }
    }
  });
}

function canPlaceShip(board, row, col, size, horizontal) {
  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    if (r >= SIZE || c >= SIZE || board[r][c] !== 0) return false;
  }
  return true;
}

function placeShipOnBoard(board, row, col, size, horizontal, isPlayer) {
  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    board[r][c] = size; // marca o navio
  }
}

// Ataque do jogador
function handlePlayerShot(e) {
  if (gameOver) return;
  
  const index = parseInt(e.target.dataset.index);
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;

  if (enemyBoard[row][col] === -1 || enemyBoard[row][col] === -2) return; // já atirou

  const isHit = enemyBoard[row][col] > 0;

  if (isHit) {
    e.target.classList.add('hit');
    e.target.textContent = '💥';
    enemyBoard[row][col] = -2; // navio atingido
    statusEl.textContent = "💥 Acertou um navio!";
  } else {
    e.target.classList.add('miss');
    e.target.textContent = '🌊';
    enemyBoard[row][col] = -1; // água
    statusEl.textContent = "🌊 Errou!";
  }

  if (checkWin(enemyBoard)) {
    statusEl.textContent = "🎉 VOCÊ VENCEU A BATALHA!";
    gameOver = true;
    return;
  }

  // Ataque do computador
  setTimeout(computerAttack, 600);
}

// Ataque do computador (simples)
function computerAttack() {
  let row, col;
  do {
    row = Math.floor(Math.random() * SIZE);
    col = Math.floor(Math.random() * SIZE);
  } while (playerBoard[row][col] < 0);

  const index = row * SIZE + col;
  const cell = playerBoardEl.children[index];

  if (playerBoard[row][col] > 0) {
    cell.classList.add('hit');
    cell.textContent = '💥';
    playerBoard[row][col] = -2;
    statusEl.textContent = "O inimigo acertou um dos seus navios!";
  } else {
    cell.classList.add('miss');
    cell.textContent = '🌊';
    playerBoard[row][col] = -1;
    statusEl.textContent = "O inimigo errou!";
  }

  if (checkWin(playerBoard)) {
    statusEl.textContent = "😢 Você perdeu...";
    gameOver = true;
  }
}

function checkWin(board) {
  return board.flat().every(cell => cell <= 0);
}

function newGame() {
  playerBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  enemyBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  gameOver = false;

  createBoards();
  placeShips(playerBoard, true);
  placeShips(enemyBoard, false);

  // Mostrar navios do jogador
  playerBoard.flat().forEach((value, i) => {
    if (value > 0) {
      playerBoardEl.children[i].classList.add('ship');
    }
  });

  statusEl.textContent = "Clique no tabuleiro inimigo para atirar!";
}

// Iniciar o jogo
newGame();