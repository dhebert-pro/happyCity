import { Card } from './Card.js';

export class NormalCard extends Card {
  constructor(name, revenue, happiness, population, color, cost) {
    super(name, revenue, happiness, population, 'Normal');
    this.cost = cost;
    this.color = color;
  }

  static getFromList = (card) => {
    return new NormalCard(card.name, card.revenue, card.happiness, card.population, card.color, card.cost);
  }

}