import { PLAYER_SPEED, PLAYER_SIZE } from "./config.js";
import { Projectile } from "./projectile.js";

export class Player {
  constructor(x, y, size = PLAYER_SIZE, speed = PLAYER_SPEED) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = 0;
    this.projectiles = [];
    this.distance_shooting = 250 * 250;
  }

  moveTo(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > PLAYER_SIZE) {
      this.angle = Math.atan2(dy, dx);
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
    }
  }

  shoot() {
    this.projectiles.push(new Projectile(this.x, this.y, this.angle));
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = "blue";
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }

  updateProjectiles(ctx, canvas) {
    this.projectiles.forEach((projectile, index) => {
      projectile.update(ctx);
      let lx = this.x - projectile.x;
      let ly = this.y - projectile.y;

      if (
        projectile.x < 0 ||
        projectile.x > canvas.width ||
        projectile.y < 0 ||
        projectile.y > canvas.height ||
        lx * lx + ly * ly > this.distance_shooting
      ) {
        this.projectiles.splice(index, 1);
      }
    });
  }
}
