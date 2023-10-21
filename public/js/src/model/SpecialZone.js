import cardCatalog from "../data/cardCatalog.js";
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

  addCard(card) {
    this.cards.push(card);
  }
}