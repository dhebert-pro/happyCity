import { Line } from "./Line.js";

export class CentralZone {
  constructor() {
    this.lines = [
      new Line(1),
      new Line(2),
      new Line(3)
    ]
  }

  addCardToLine(lineNumber) {
    const line = this.getLine(lineNumber);
    line.draw();
  }

  getCardFromLine(lineNumber, position) {
    const line = this.getLine(lineNumber);
    return line.getCardByPosition(position);
  }

  getCards() {
    return [
      ...this.getLine(1).visibleCards,
      ...this.getLine(2).visibleCards,
      ...this.getLine(3).visibleCards
    ];
  }

  getCardsFromLine(lineNumber) {
    const line = this.getLine(lineNumber);
    return line.visibleCards;
  }

  removeCardFromLine(lineNumber, position) {
    const line = this.getLine(lineNumber);
    const cardRemoved = line.removeVisibleCard(position);
    return cardRemoved;
  }

  getLine(lineNumber) {
    return this.lines[lineNumber - 1];
  }

  getVisibleCardCount() {
    return this.getLine(1).getVisibleCardCount() + this.getLine(2).getVisibleCardCount() + this.getLine(3).getVisibleCardCount();
  }

  isLineDeckEmpty(lineNumber) {
    const line = this.getLine(lineNumber);
    return line.isDeckEmpty();
  }

  isFull() {
    return this.getVisibleCardCount() === 3;
  }
}