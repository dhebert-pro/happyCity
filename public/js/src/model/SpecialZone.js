import cardCatalog from "../data/cardCatalog.js";
import { getFirstItemByProperty, removeAt } from "../util/ArrayUtil.js";
import { getRandomElements } from "../util/RandomUtil.js";
import { SpecialCard } from "./Card/SpecialCard.js";

export class SpecialZone {
  constructor(nbCards) {
    this.cards = [];
    const specialCardList = cardCatalog.special;
    const specialCardListSelection = getRandomElements(specialCardList, nbCards);
    specialCardListSelection.forEach(specialCardItem => {
      this.addCard(SpecialCard.getFromList(specialCardItem));
    });
  }

  removeCard(position) {
    const cardRemoved = removeAt(this.cards, position);
    return cardRemoved;
  }

  getCardByName(cardName) {
    const card = getFirstItemByProperty(this.cards, 'name', cardName);
    return card;
  }

  getCardByPosition(position) {
    const card = this.cards[position];
    return card;
  }

  addCard(card) {
    this.cards.push(card);
  }
}