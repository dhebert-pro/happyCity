import { getFirstItemByProperty, removeFirstItemByProperty } from "../util/ArrayUtil.js";
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

  isDeckEmpty() {
    return this.deck.isEmpty();
  }

  removeVisibleCard(cardName) {
    const cardRemoved = removeFirstItemByProperty(this.visibleCards, 'name', cardName);
    return cardRemoved;
  }

  getVisibleCardCount() {
    return this.visibleCards.length;
  }
}