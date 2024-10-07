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
          Math.random() * this.canvas.height,
          40,
          1
        )
      );
    }
  }

  initListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) this.player.shoot();
    });

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

  gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScore(this.ctx, this.playerScore);

    if (!this.isPaused) {
      this.player.moveTo(this.mouse.x, this.mouse.y);

      this.player.updateProjectiles(this.ctx, this.canvas);
      //this.monsters.forEach((monster) => monster.update());

      this.monsters.forEach((monster, monsterIndex) => {
        monster.update(this.canvas);
        monster.draw(this.ctx);
        this.player.projectiles.forEach((projectile, projectileIndex) => {
          if (this.checkCollision(projectile, monster)) {
            this.player.projectiles.splice(projectileIndex, 1);
            monster.respawn(this.canvas);
            this.playerScore++;
            this.updateScore();
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
    this.ctx.fillText("Pause", this.canvas.width / 2, this.canvas.height / 2);
  }

  start() {
    this.gameLoop();
  }
}
