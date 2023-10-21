import cardCatalog from "../data/cardCatalog.js";
import { getFirstItemByProperty, removeFirstItemByProperty } from "../util/ArrayUtil.js";
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

  removeCard(cardName) {
    const cardRemoved = removeFirstItemByProperty(this.cards, 'name', cardName);
    if (!cardRemoved) {
      throw new Error(`Special card ${cardName} doesn't exist`);
    }
    return cardRemoved;
  }

  getCardByName(cardName) {
    const card = getFirstItemByProperty(this.cards, 'name', cardName);
    return card;
  }

  addCard(card) {
    this.cards.push(card);
  }
}