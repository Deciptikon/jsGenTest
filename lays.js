export class Lay {
  constructor(currentLay, previousLay = null) {
    this.neurons = currentLay;
    if (previousLay != null) {
      this.weights = this.randomWeights(
        1.0,
        previousLay.length,
        this.neurons.length
      );
    } else {
      this.weights = null;
    }

    this.shifts = new Array(this.neurons.length).fill(0);
    this.previousLay = previousLay;
  }

  randomWeights(amplitude, w, h) {
    let weights = [];
    for (let i = 0; i < h; i++) {
      weights[i] = new Array(w)
        .fill(0)
        .map(() => (Math.random() * 2 - 1) * amplitude);
    }
    return weights;
  }

  sigmoid(x, shift) {
    return 1 / (1 + Math.exp(shift - x));
  }

  forward() {
    if (this.weights != null) {
      for (let i = 0; i < this.weights.length; i++) {
        let summ = 0;
        for (let j = 0; j < this.weights[i].length; j++) {
          summ += this.weights[i][j] * this.previousLay.neurons[j];
        }
        this.neurons[i] = this.sigmoid(summ, this.shifts[i]);
      }
    }
  }

  setNeurons(neurons) {
    if (neurons != null) {
      this.neurons = neurons;
    }
  }

  getNeurons() {
    return this.neurons;
  }

  mutation(probability = 0.5, amplitude = 0.1) {
    //
  }

  crossingover(otherLay) {
    //
  }
}
