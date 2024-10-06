// Настройки игры
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Размеры игрового поля
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Класс игрока
class Player {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.projectiles = [];
  }

  moveTo(targetX, targetY) {
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;
  }

  shoot() {
    this.projectiles.push(
      new Projectile(this.x + this.size / 2, this.y + this.size / 2, 5, 7)
    );
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.size, this.size);
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
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Обновление и отрисовка игрока
  player.moveTo(mouseX, mouseY);
  player.draw();
  player.updateProjectiles();

  // Отрисовка монстров
  monsters.forEach((monster) => {
    monster.draw();
  });

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

// Запуск игрового цикла
gameLoop();
