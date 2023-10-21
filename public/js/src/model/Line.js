import { removeFirstItemByProperty } from "../util/ArrayUtil.js";
import { Deck } from "./Deck.js";

export class Line {
  constructor(level) {
    this.level = level;
    this.deck = new Deck(level);
    this.visibleCards = [];
  }

  draw() {
    const card = this.deck.draw();
    this.visibleCards.push(card);
  }

  removeVisibleCard(cardName) {
    const cardFound = removeFirstItemByProperty(this.visibleCards, 'name', cardName);
    if (!cardFound) {
      throw new Error(`Card ${cardName} doesn't exist at line ${this.level}`);
    }
  }

  getVisibleCardCount() {
    return this.visibleCards.length;
  }
}