const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreEl = document.getElementById('highScore');
const bgMusic = document.getElementById('bgMusic');
const eatSound = document.getElementById('eatSound');

let tileCount = 20;
let tileSize = canvas.width / tileCount;
let snake = [];
let apple = {};
let dx = 0, dy = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
highScoreEl.textContent = highScore;

startBtn.onclick = () => {
  menu.style.display = 'none';
  canvas.style.display = 'block';
  scoreDisplay.style.display = 'block';
  resetGame();
  bgMusic.play();
};

function resetGame() {
  snake = [{ x: 10, y: 10 }]; 
  apple = { x: 5, y: 5 }; 
  dx = 1; 
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
    case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
    case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
    case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
  }
});

function drawBoard() {
  for (let y = 0; y < tileCount; y++) {
    for (let x = 0; x < tileCount; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#8fbc8f' : '#98fb98';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawApple() {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc((apple.x + 0.5) * tileSize, (apple.y + 0.5) * tileSize, tileSize / 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnake() {
  ctx.fillStyle = 'purple';
  snake.forEach(part => {
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
  });
}

function updateGame() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(part => part.x === head.x && part.y === head.y)) {
    if (score > highScore) {
      localStorage.setItem('highScore', score);
      highScoreEl.textContent = score;
    }
    bgMusic.pause();
    alert('Koniec gry! Twój wynik: ' + score);
    
    menu.style.display = 'block';
    canvas.style.display = 'none';
    scoreDisplay.style.display = 'none';

    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    apple = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    score++;
    scoreEl.textContent = score;
    eatSound.play();
  } else {
    snake.pop();
  }

  drawBoard();
  drawApple();
  drawSnake();
}

setInterval(updateGame, 150);
