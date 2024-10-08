export class Lay {
  constructor(currentNeurons, previousNeurons) {
    //console.log("currentNeurons = ", currentNeurons?.length);
    //console.log("previousNeurons = ", previousNeurons?.length);
    this.neurons = currentNeurons;
    if (previousNeurons != null) {
      this.previousNeurons = previousNeurons;

      this.weights = this.randomWeights(
        1.0,
        this.previousNeurons.length,
        this.neurons.length
      );
      this.shifts = new Array(this.neurons.length).fill(0);
    } else {
      this.previousNeurons = null;
      this.weights = null;
      this.shifts = null;
    }
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
          summ += this.weights[i][j] * this.previousNeurons[j];
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
    if (this.weights != null) {
      for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].length; j++) {
          if (Math.random() < probability) {
            this.weights[i][j] += (Math.random() * 2 - 1) * amplitude;
          }
        }
      }

      this.shifts.forEach((shift) => {
        shift += (Math.random() * 2 - 1) * amplitude;
      });
    }
  }

  crossingover(otherLay) {
    if (this.weights != null && otherLay != null) {
      for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].length; j++) {
          if (Math.random() < 0.5) {
            this.weights[i][j] = otherLay.weights[i][j];
          }
        }
      }

      this.shifts.forEach((shift, i) => {
        if (Math.random() < 0.5) {
          shift = otherLay.shifts[i];
        }
      });
    }
  }

  print() {
    console.log("Веса:");
    //console.log(this.weights);
    if (this.weights != null) {
      this.weights.forEach((neuron, i) => {
        console.log(neuron);
      });
    }

    console.log("Сдвиги:");
    console.log(this.shifts);
  }
}
