import { Card } from './Card.js';

export class SpecialCard extends Card {
  constructor(name, revenue, happiness, population, conditions) {
    super(name, revenue, happiness, population, 'Special');
    this.conditions = conditions;
  }

  static getFromList = (card) => {
    return new SpecialCard(card.name, card.revenue, card.happiness, card.population, card.conditions);
  }

}