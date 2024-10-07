import { MONSTER_SPEED, MONSTER_SIZE } from "./config.js";

export class Monster {
  constructor(x, y, size = MONSTER_SIZE, speed = MONSTER_SPEED) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = Math.random() * Math.PI * 2;
  }

  update(canvas) {
    // Простое случайное движение, пока без сложных вычислений
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Проверка на границы экрана и смена направления
    if (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    ) {
      this.angle = Math.random() * Math.PI * 2;
    }

    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > canvas.width) {
      this.x = canvas.width;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y > canvas.height) {
      this.y = canvas.height;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.size / 2, this.y + this.size);
    ctx.lineTo(this.x + this.size / 2, this.y + this.size);
    ctx.closePath();
    ctx.fill();
  }

  respawn(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  }
}
