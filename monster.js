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
    //console.log("this.nn.getLastLay() = ", this.nn.getLastLay());

    let neurons1 = new Array(INPUT_SIZE_NEURONS).fill(0);
    let layer1 = new Lay(neurons1);
    this.nn.pushLay(layer1);
    //console.log("layer1.getNeurons() = ", layer1.getNeurons());

    let neurons4 = new Array(40).fill(0);
    let layer4 = new Lay(neurons4, neurons1);
    this.nn.pushLay(layer4);
    //console.log("this.nn.getLastLay() = ", this.nn.getLastLay());

    let neurons5 = new Array(OUTPUT_SIZE_NEURONS).fill(0);
    let layer5 = new Lay(neurons5, neurons4);
    this.nn.pushLay(layer5);
    //console.log("this.nn.getLastLay() = ", this.nn.getLastLay());

    //console.log("--------- NEW MONSTER ----------");
    //this.nn.print();
    //console.log("");
  }

  update(canvas, data) {
    //console.log("data = ", data);
    let [angle, tempory] = this.nn.forward(data);
    this.angle = angle;
    this.tempory = tempory;
    this.angle *= Math.PI * 2;
    //console.log("tempory = ", this.tempory, "   | angle = ", this.angle);

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
    //console.log("--------- NEW MONSTER ----------");
    //this.nn.print();
    //console.log("");
  }

  getNN() {
    return this.nn;
  }
}
