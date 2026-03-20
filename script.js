const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const tile = 30;

const mapData = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacman, ghosts, score, lives, gameOver;

function initGame() {
  pacman = { x: 1, y: 1, dx: 0, dy: 0 };
  ghosts = [{ x: 10, y: 3, color: "red" }];
  score = 0;
  lives = 3;
  gameOver = false;

  document.getElementById("gameOverScreen").style.display = "none";
  updateUI();
  loop();
}

function updateUI() {
  document.getElementById("score").innerText = score;
  document.getElementById("lives").innerText = lives;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {
      if (mapData[y][x] === 1) {
        ctx.fillStyle = "#004771";
        ctx.fillRect(x * tile, y * tile, tile, tile);
      } else {
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(x * tile + 15, y * tile + 15, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Pacman
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(pacman.x * tile + 15, pacman.y * tile + 15, 10, 0, Math.PI * 2);
  ctx.fill();

  // Ghosts
  ghosts.forEach(g => {
    ctx.fillStyle = g.color;
    ctx.fillRect(g.x * tile + 5, g.y * tile + 5, 20, 20);
  });
}

function move() {
  let nx = pacman.x + pacman.dx;
  let ny = pacman.y + pacman.dy;

  if (mapData[ny] && mapData[ny][nx] !== 1) {
    pacman.x = nx;
    pacman.y = ny;
  }

  ghosts.forEach(g => {
    let dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    let d = dirs[Math.floor(Math.random()*4)];

    if (mapData[g.y + d[1]] && mapData[g.y + d[1]][g.x + d[0]] !== 1) {
      g.x += d[0];
      g.y += d[1];
    }

    if (g.x === pacman.x && g.y === pacman.y) {
      if (lives > 0) lives--;

      if (lives === 0) {
        gameOver = true;
        document.getElementById("gameOverScreen").style.display = "block";
        return;
      }

      pacman.x = 1;
      pacman.y = 1;
    }
  });

  updateUI();
}

function loop() {
  if (gameOver) return;

  move();
  draw();

  setTimeout(loop, 200);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") { pacman.dx = 0; pacman.dy = -1; }
  if (e.key === "ArrowDown") { pacman.dx = 0; pacman.dy = 1; }
  if (e.key === "ArrowLeft") { pacman.dx = -1; pacman.dy = 0; }
  if (e.key === "ArrowRight") { pacman.dx = 1; pacman.dy = 0; }
});

initGame();
