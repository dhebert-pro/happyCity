import cardCatalog from "../data/cardCatalog.js";
import { getFirstItemByProperty, removeFirstItemByProperty } from "../util/ArrayUtil.js";
import { DwellingCard } from "./Card/DwellingCard.js";

export class DwellingZone {
  constructor(nbCardsPerPlayer) {
    this.cards = [];
    const dwellingCardList = cardCatalog.dwelling;
    dwellingCardList.forEach(dwellingCardItem => {
      for (let cardCount = 0; cardCount < nbCardsPerPlayer; cardCount++) {
        this.addCard(DwellingCard.getFromList(dwellingCardItem));
      }
    });
  }

  removeCard(cardName) {
    const cardRemoved = removeFirstItemByProperty(this.cards, 'name', cardName);
    if (!cardRemoved) {
      throw new Error(`Dwelling card ${cardName} doesn't exist`);
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