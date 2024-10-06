// Настройки игры
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

// Размеры игрового поля
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Переменные для паузы
let isPaused = false;
let playerScore = 0;

// Класс игрока
class Player {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = 0;
    this.projectiles = [];
  }

  moveTo(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    this.angle = Math.atan2(dy, dx);
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  shoot() {
    this.projectiles.push(
      new Projectile(
        this.x + this.size / 2,
        this.y + this.size / 2,
        5,
        7,
        this.angle
      )
    );
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
    ctx.rotate(this.angle);
    ctx.fillStyle = "blue";
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }

  updateProjectiles() {
    this.projectiles.forEach((projectile, index) => {
      projectile.update();
      if (
        projectile.x < 0 ||
        projectile.x > canvas.width ||
        projectile.y < 0 ||
        projectile.y > canvas.height
      ) {
        this.projectiles.splice(index, 1);
      }
    });
  }
}

// Класс снарядов
class Projectile {
  constructor(x, y, size, speed, angle) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = angle;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.draw();
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Класс монстров (треугольники)
class Monster {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  draw() {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.size / 2, this.y + this.size);
    ctx.lineTo(this.x + this.size / 2, this.y + this.size);
    ctx.closePath();
    ctx.fill();
  }

  respawn() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  }
}

// Создание игрока
const player = new Player(canvas.width / 2, canvas.height / 2, 50, 3);

// Массив для монстров
const monsters = [];
for (let i = 0; i < 5; i++) {
  monsters.push(
    new Monster(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      40,
      1
    )
  );
}

// Переменные для хранения положения мыши
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Основной игровой цикл
function gameLoop() {
  if (!isPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обновление и отрисовка игрока
    player.moveTo(mouseX, mouseY);
    player.draw();
    player.updateProjectiles();

    // Отрисовка монстров и проверка на коллизии
    monsters.forEach((monster, monsterIndex) => {
      monster.draw();
      player.projectiles.forEach((projectile, projectileIndex) => {
        if (checkCollision(projectile, monster)) {
          player.projectiles.splice(projectileIndex, 1);
          monster.respawn();
          playerScore++;
          updateScore();
        }
      });
    });
  }
  requestAnimationFrame(gameLoop);
}

// Событие перемещения мыши
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Событие нажатия мыши
canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    player.shoot();
  }
});

// Событие нажатия на клавишу Escape для паузы
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    isPaused = !isPaused;
  }
});

// Проверка на коллизии
function checkCollision(projectile, monster) {
  const distX = projectile.x - monster.x;
  const distY = projectile.y - monster.y;
  const distance = Math.sqrt(distX * distX + distY * distY);

  return distance < monster.size;
}

// Обновление счета на экране
function updateScore() {
  scoreDisplay.textContent = `Score = ${playerScore}`;
}

// Запуск игрового цикла
gameLoop();
