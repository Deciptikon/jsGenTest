import { MONSTER_SPEED, MONSTER_SIZE } from "./config.js";
import { MARGIN_WINDOW } from "./config.js";
import { INPUT_SIZE_NEURONS, OUTPUT_SIZE_NEURONS } from "./config.js";

import { Lay } from "./lays.js";
import { NeuralNetwork } from "./neuralNet.js";

export class Monster {
  constructor(x, y, size = MONSTER_SIZE, speed = MONSTER_SPEED) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = Math.random() * Math.PI * 2;

    this.tempory = 0;
    this.createNN();
  }

  createNN() {
    this.nn = new NeuralNetwork();
    this.nn.pushLay(new Lay(new Array(INPUT_SIZE_NEURONS).fill(0)));
    this.nn.pushLay(new Lay(new Array(4).fill(0)), this.nn.getLastLay());
    this.nn.pushLay(new Lay(new Array(4).fill(0)), this.nn.getLastLay());
    this.nn.pushLay(
      new Lay(new Array(OUTPUT_SIZE_NEURONS).fill(0)),
      this.nn.getLastLay()
    );
  }

  update(canvas, data) {
    [this.angle, this.tempory] = this.nn.forward(data);
    this.angle *= Math.PI * 2;
    //console.log(this.tempory);

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x < MARGIN_WINDOW) {
      this.x = MARGIN_WINDOW;
    }
    if (this.x > canvas.width - MARGIN_WINDOW) {
      this.x = canvas.width - MARGIN_WINDOW;
    }
    if (this.y < MARGIN_WINDOW) {
      this.y = MARGIN_WINDOW;
    }
    if (this.y > canvas.height - MARGIN_WINDOW) {
      this.y = canvas.height - MARGIN_WINDOW;
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

  respawn(canvas, randomMonster) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    if (Math.random() < 0.1) {
      this.createNN();
    } else {
      this.nn.crossingover(randomMonster.getNN());
      this.nn.mutation(0.01, 0.01);
    }
  }

  getNN() {
    return this.nn;
  }
}
