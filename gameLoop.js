import { Player } from "./player.js";
import { Monster } from "./monster.js";
import { INITIAL_MONSTER_COUNT } from "./config.js";

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.isPaused = false;
    this.playerScore = 0;
    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.monsters = [];
    this.mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    this.initMonsters(INITIAL_MONSTER_COUNT);
    this.initListeners();
  }

  initMonsters(count) {
    for (let i = 0; i < count; i++) {
      this.monsters.push(
        new Monster(
          Math.random() * this.canvas.width,
          Math.random() * this.canvas.height
        )
      );
    }
  }

  initListeners() {
    // Функция для проверки, поддерживаются ли сенсорные экраны
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      // Инициализация сенсорных слушателей
      console.log("Запуск на сенсорном устройстве");

      let isTouching = false;

      // Обработка касания (начало касания)
      this.canvas.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        this.mouse.x = touch.clientX - this.canvas.offsetLeft;
        this.mouse.y = touch.clientY - this.canvas.offsetTop;

        isTouching = true;
        this.player.shoot();
      });

      // Обработка движения пальца по экрану
      this.canvas.addEventListener("touchmove", (e) => {
        if (isTouching) {
          const touch = e.touches[0];
          this.mouse.x = touch.clientX - this.canvas.offsetLeft;
          this.mouse.y = touch.clientY - this.canvas.offsetTop;

          e.preventDefault(); // Предотвращаем прокрутку
        }
      });

      // Окончание касания
      this.canvas.addEventListener("touchend", () => {
        isTouching = false;
      });

      this.canvas.addEventListener("touchcancel", () => {
        isTouching = false;
      });
    } else {
      // Инициализация слушателей для мыши
      console.log("Запуск на компьютере с мышью");

      this.canvas.addEventListener("mousemove", (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      this.canvas.addEventListener("mousedown", (e) => {
        if (e.button === 0) this.player.shoot();
      });
    }

    // Общий обработчик клавиатуры для обоих типов устройств
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.isPaused = !this.isPaused;
    });
  }

  drawScore(ctx, score) {
    ctx.fillStyle = "black";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `Score = ${score}`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  getRandomElement(list) {
    if (list.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  gameLoop() {
    //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawScore(this.ctx, this.playerScore);

    if (!this.isPaused) {
      this.player.moveTo(this.mouse.x, this.mouse.y);

      this.player.updateProjectiles(this.ctx, this.canvas);
      //this.monsters.forEach((monster) => monster.update());

      this.monsters.forEach((monster, monsterIndex) => {
        let data = [
          this.player.x / this.canvas.width,
          this.player.y / this.canvas.height,
          monster.x / this.canvas.width,
          monster.y / this.canvas.height,
          monster.tempory,
        ];
        monster.update(this.canvas, data);
        monster.draw(this.ctx);
        this.player.projectiles.forEach((projectile, projectileIndex) => {
          if (this.checkCollision(projectile, monster)) {
            console.log("Collision");
            this.player.projectiles.splice(projectileIndex, 1);
            monster.respawn(this.canvas, this.getRandomElement(this.monsters));
            this.playerScore++;
          }
        });
      });

      this.player.draw(this.ctx);
      this.drawCustomCursor();
    } else {
      this.drawPauseMenu();
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  checkCollision(projectile, monster) {
    const distX = projectile.x - monster.x;
    const distY = projectile.y - monster.y;
    const distance = Math.sqrt(distX * distX + distY * distY);
    return distance < monster.size;
  }

  drawCustomCursor() {
    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouse.x - 10, this.mouse.y);
    this.ctx.lineTo(this.mouse.x + 10, this.mouse.y);
    this.ctx.moveTo(this.mouse.x, this.mouse.y - 10);
    this.ctx.lineTo(this.mouse.x, this.mouse.y + 10);
    this.ctx.stroke();
  }

  drawPauseMenu() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    const rectWidth = this.canvas.width / 3;
    const rectHeight = this.canvas.height / 3;
    this.ctx.fillRect(
      this.canvas.width / 2 - rectWidth / 2,
      this.canvas.height / 2 - rectHeight / 2,
      rectWidth,
      rectHeight
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = "48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "PAUSE",
      this.canvas.width / 2,
      this.canvas.height / 2 - 103
    );
  }

  start() {
    this.gameLoop();
  }
}
