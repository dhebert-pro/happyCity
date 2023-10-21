import cardCatalog from '../data/cardCatalog.js';
import { shuffle } from '../util/RandomUtil.js';
import { NormalCard } from './Card/NormalCard.js';

export class Deck {
  constructor(level) {
    this.level = level;
    this.cards = [];
    const levelId = `level${level}`;
    const cardList = cardCatalog[levelId];
    cardList.forEach(cardItem => {
      //2 exemplaires de chaque carte
      this.addCard(NormalCard.getFromList(cardItem));
      this.addCard(NormalCard.getFromList(cardItem));
    });
    this.shuffle();
  }

  shuffle() {
    const deckShuffled = shuffle(this.cards);
    this.cards = deckShuffled;
  }

  draw() {
    if (this.isEmpty()) {
      throw new Error(`Deck ${this.level} is empty`);
    }
    const card = this.cards.shift();
    return card;
  }

  getCardCount() {
    return this.cards.length;
  }

  isEmpty() {
    return this.getCardCount() === 0;
  }

  addCard(card) {
    this.cards.push(card);
  }
}