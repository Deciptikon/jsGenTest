// Настройки игры
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Game {
  constructor() {
    this.isPaused = false;
    this.playerScore = 0;
    this.player = new Player(canvas.width / 2, canvas.height / 2, 50, 3);
    this.monsters = [];
    this.initMonsters(5);
    this.mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    this.initListeners();
  }

  initMonsters(count) {
    for (let i = 0; i < count; i++) {
      this.monsters.push(
        new Monster(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          40,
          1
        )
      );
    }
  }

  initListeners() {
    canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) this.player.shoot();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.isPaused = !this.isPaused;
    });
  }

  updateScore() {
    scoreDisplay.textContent = `Score = ${this.playerScore}`;
  }

  gameLoop() {
    if (!this.isPaused) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.player.moveTo(this.mouse.x, this.mouse.y);
      this.player.draw();
      this.player.updateProjectiles();

      this.monsters.forEach((monster, monsterIndex) => {
        monster.draw();
        this.player.projectiles.forEach((projectile, projectileIndex) => {
          if (this.checkCollision(projectile, monster)) {
            this.player.projectiles.splice(projectileIndex, 1);
            monster.respawn();
            this.playerScore++;
            this.updateScore();
          }
        });
      });
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  checkCollision(projectile, monster) {
    const distX = projectile.x - monster.x;
    const distY = projectile.y - monster.y;
    const distance = Math.sqrt(distX * distX + distY * distY);
    return distance < monster.size;
  }
}

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
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 10) {
      this.angle = Math.atan2(dy, dx);
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
    }
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
    ctx.translate(this.x, this.y);
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

// Запуск игры
const game = new Game();
game.gameLoop();
