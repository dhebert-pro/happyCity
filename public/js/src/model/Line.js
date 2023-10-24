import { getFirstItemByProperty, removeAt } from "../util/ArrayUtil.js";
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

  getCardByName(cardName) {
    const card = getFirstItemByProperty(this.visibleCards, 'name', cardName);
    return card;
  }

  getCardByPosition(position) {
    const card = this.visibleCards[position];
    return card;
  }

  isDeckEmpty() {
    return this.deck.isEmpty();
  }

  removeVisibleCard(position) {
    const cardRemoved = removeAt(this.visibleCards, position);
    return cardRemoved;
  }

  getVisibleCardCount() {
    return this.visibleCards.length;
  }
}