import { Lay } from "./lays.js";

export class NeuralNetwork {
  constructor() {
    this.lays = [];
  }

  pushLay(lay) {
    this.lays.push(lay);
  }

  getLastLay() {
    return this.lays[this.lays.length - 1];
  }

  getFirstLay() {
    return this.lays[0];
  }

  forward(inputs) {
    this.getFirstLay().setNeurons(inputs);
    this.lays.forEach((lay) => {
      lay.forward();
    });
    return this.getLastLay().getNeurons();
  }

  mutation(probability = 0.5, amplitude = 0.1) {
    this.lays.forEach((lay) => {
      lay.mutation(probability, amplitude);
    });
  }

  crossingover(otherNN) {
    this.lays.forEach((lay, i) => {
      let otherLay = otherNN.lays[i];
      lay.crossingover(otherLay);
    });
  }

  print() {
    console.log("______________________");
    this.lays.forEach((lay, i) => {
      console.log("=== Слой №", i);
      lay.print();
    });
    console.log("");
  }
}
