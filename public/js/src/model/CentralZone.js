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
    if (this.isFull()) {
      throw new Error(`You can't draw at ${lineNumber} because central zone is full`);
    }

    const line = this.getLine(lineNumber);
    line.draw();
  }

  getCardFromLine(lineNumber, cardName) {
    const line = this.getLine(lineNumber);
    return line.getCardByName(cardName);
  }

  getCardsFromLine(lineNumber) {
    const line = this.getLine(lineNumber);
    return line.visibleCards;
  }

  removeCardFromLine(lineNumber, cardName) {
    const line = this.getLine(lineNumber);
    const cardRemoved = line.removeVisibleCard(cardName);
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