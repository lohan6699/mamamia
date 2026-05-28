* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #0a1f3d, #1e3a5f);
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 0 0 15px #00bfff;
}

.game-area {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px 0;
}

.board-container h2 {
  margin-bottom: 10px;
  font-size: 1.4rem;
}

.board {
  display: grid;
  grid-template-columns: repeat(10, 35px);
  gap: 3px;
  background: #112233;
  padding: 10px;
  border-radius: 12px;
}

.cell {
  width: 35px;
  height: 35px;
  background: #224466;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  transition: 0.2s;
  border: 1px solid #113355;
}

.cell:hover {
  background: #00bfff;
  transform: scale(1.1);
}

.player-cell {
  cursor: default;
}

.ship {
  background: #00ff88 !important;
}

.hit {
  background: #ff3366 !important;
  animation: explode 0.4s;
}

.miss {
  background: #88aaff !important;
}

@keyframes explode {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

.status {
  font-size: 1.4rem;
  margin: 20px 0;
  min-height: 50px;
}

.reset-btn {
  padding: 14px 35px;
  font-size: 1.2rem;
  background: #ff3366;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
}

.reset-btn:hover {
  background: #ff6688;
  transform: translateY(-3px);
}