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

  getLine1Count() {
    return this.cards.line1.length;
  }

  getCardCount() {
    return this.getCards().length;
  }

  isLine1Complete() {
    return this.getLine1Count() === 5;
  }

  isFull() {
    return this.getCardCount() === 10;
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

  buyCard(card) {
    const cost = card.cost;
    if (this.coins < cost) {
      throw new Error(`Player ${this.name} has not enough coins to buy ${card.name}`);
    }
    this.removeCoins(cost);
    this.addCard(card);
  }

  removeCoins(coins) {
    this.coins -= coins;
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