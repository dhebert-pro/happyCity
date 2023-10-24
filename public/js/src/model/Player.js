export class Player {
  constructor(name) {
    this.name = name;
    this.coins = 2;
    this.cards = {
      line1: [],
      line2: []
    },
    this.hasRemovedCard = false;
    this.hasAddedCard = false;
    this.hasTakenNormalCard = false;
    this.hasTakenSpecialCard = false;
    this.hasSkippedTurn = false;
  }

  canBuy(card) {
    return this.coins >= card.cost;
  }

  getRevenue() {
    let result = 0;
    this.getCards().forEach(card => result += card.revenue);
    return result;
  }

  getHapiness() {
    let result = 0;
    this.getCards().forEach(card => result += card.happiness);
    return result;
  }

  getPopulation() {
    let result = 0;
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

  getCardByName(name) {
    return this.getCards().filter(card => card.name === name);
  }

  getCardCountByColor(color) {
    return this.getCardsByColor(color).length;
  }

  getCardCountByType(type) {
    return this.getCardsByType(type).length;
  }

  getCardByPosition(position) {
    return this.getCards()[position];
  }

  hasCard(name) {
    return this.getCardByName(name).length;
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
    this.removeCoins(card.cost);
    this.addCard(card);
  }

  hasSpecialCard() {
    return this.getCardCountByType('Special') > 0;
  }

  removeCoins(coins) {
    this.coins -= coins;
  }

  addCoins(coins) {
    this.coins += coins;
  }

  skipTurn() {
    this.addCoins(1);
  }

  earnRevenue() {
    this.coins += this.getRevenue();
  }

  getTotalScore() {
    return Math.max(0, this.getHapiness()) * Math.max(0, this.getPopulation());
  }

  resetTurn() {
    this.hasRemovedCard = false;
    this.hasAddedCard = false;
    this.hasTakenNormalCard = false;
    this.hasTakenSpecialCard = false;
    this.hasSkippedTurn = false;
  }
}