import { Card } from './Card.js';

export class DwellingCard extends Card {
  constructor(name, revenue, happiness, population, color, cost) {
    super(name, revenue, happiness, population, 'Dwelling');
    this.cost = cost;
    this.color = color;
  }

  static getFromList = (card) => {
    return new DwellingCard(card.name, card.revenue, card.happiness, card.population, card.color, card.cost);
  }

}