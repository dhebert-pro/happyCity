import cardCatalog from '../../data/cardCatalog.js';
import { Card } from './Card.js';

export class StartCard extends Card {
  constructor(name, revenue, happiness, population, color, cost) {
    super(name, revenue, happiness, population, 'Start');
    this.cost = cost;
    this.color = color;
  }

  static getFromList = (card) => {
    return new StartCard(card.name, card.revenue, card.happiness, card.population, card.color, card.cost);
  }

  static getCardList = () => {
    return cardCatalog.start.map(card => card.name);
  }

}