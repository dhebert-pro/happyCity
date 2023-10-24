export class ReplayMemory {
  constructor(capacity) {
    this.capacity = capacity;
    this.memory = [];
    this.position = 0;
  }

  add(experience) {
      if (this.memory.length >= this.maxSize) {
          this.memory.shift(); // retire la première expérience si la mémoire est pleine
      }
      this.memory.push(experience);
    }

  sample(batchSize) {
    const randomIndices = [];
    for (let i = 0; i < batchSize; i++) {
      randomIndices.push(Math.floor(Math.random() * this.memory.length));
    }
    return randomIndices.map(index => this.memory[index]);
  }

  length() {
    return this.memory.length;
  }
}