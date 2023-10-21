export class Player {
  constructor(name) {
    this.name = name;
    this.coins = 2;
    this.cards = {
      line1: [],
      line2: []
    } // cartes devant le joueur
  }

  getRevenue() {
    const result = 0;
    this.cards.line1.forEach(card => result += card.revenue);
    this.cards.line2.forEach(card => result += card.revenue);
    return result;
  }

  getHapiness() {
    const result = 0;
    this.cards.line1.forEach(card => result += card.happiness);
    this.cards.line2.forEach(card => result += card.happiness);
    return result;
  }

  getPopulation() {
    const result = 0;
    this.cards.line1.forEach(card => result += card.population);
    this.cards.line2.forEach(card => result += card.population);
    return result;
  }

  isLine1Complete() {
    return this.cards.line1.length === 5;
  }

  addCardToLine(lineNumber, card) {
    const line = `line${lineNumber}`;
    this.cards[line].push(card);
  }

  addCard(card) {
    if (this.isLine1Complete()) {
      this.addCardToLine(2, card);
    } else {
      this.addCardToLine(1, card);
    }
  }

  computeTotalScore() {
    return this.getHapiness() * this.getPopulation();
  }
}