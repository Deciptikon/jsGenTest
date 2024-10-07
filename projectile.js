import { PROJECTILE_SPEED, PROJECTILE_RADIUS } from "./config.js";

export class Projectile {
  constructor(x, y, size = PROJECTILE_RADIUS, speed = PROJECTILE_SPEED, angle) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = angle;
  }

  update(ctx) {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.draw(ctx);
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
