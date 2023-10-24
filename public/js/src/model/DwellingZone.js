import cardCatalog from "../data/cardCatalog.js";
import { getFirstItemByProperty, removeAt } from "../util/ArrayUtil.js";
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