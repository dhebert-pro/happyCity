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
    this.getCards().forEach(card => result += card.revenue);
    return result;
  }

  getHapiness() {
    const result = 0;
    this.getCards().forEach(card => result += card.happiness);
    return result;
  }

  getPopulation() {
    const result = 0;
    this.getCards().forEach(card => result += card.population);
    return result;
  }

  getCards() {
    return [...this.cards.line1, ...this.cards.line2];
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

  earnRevenue() {
    this.getCards().forEach(card => {
      this.coins += card.revenue;
    })
  }

  computeTotalScore() {
    return this.getHapiness() * this.getPopulation();
  }
}