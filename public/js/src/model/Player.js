export class Player {
  constructor(name) {
    this.name = name;
    this.coins = 2;
    this.cards = {
      line1: [],
      line2: []
    }
  }

  canBuy(card) {
    return this.coins >= card.cost;
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

  hasConditions(conditions) {
    for (let conditionIndex = 0; conditionIndex < conditions.length; conditionIndex++) {
      const condition = conditions[conditionIndex];
      if (!this.hasCondition(condition)) {
        return false;
      }
    }
    return true;
  }

  hasCondition(condition) {
    const cardCountByConditionColor = this.getCardCountByColor(condition.color);
    return cardCountByConditionColor >= condition.count;
  }

  getCardsByColor(color) {
    return this.getCards().filter(card => card.color === color);
  }

  getCardsByType(type) {
    return this.getCards().filter(card => card.type === type);
  }

  getCardCountByColor(color) {
    return this.getCardsByColor(color).length;
  }

  getCardCountByType(type) {
    return this.getCardsByType(type).length;
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
    if (!this.canBuy(card)) {
      throw new Error(`Player ${this.name} has not enough coins to buy ${card.name}`);
    }
    this.removeCoins(card.cost);
    this.addCard(card);
  }

  addSpecialCard(card) {
    const conditions = card.conditions;
    if (this.isFull()) {
      throw new Error(`Player ${this.name} has no spot to add special card ${card.name}`);
    }
    if (!this.hasConditions(conditions)) {
      throw new Error(`Player ${this.name} has not the requirements to add special card ${card.name}`);
    }
    if (this.getCardCountByType('Special') > 0) {
      throw new Error(`Player ${this.name} can only have one special card`);
    }
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