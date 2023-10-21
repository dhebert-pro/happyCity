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
    if (isCentralZoneFull()) {
      throw new Error(`You can't draw at ${lineNumber} because central zone is full`);
    }

    const line = getLine(lineNumber);
    line.draw();
  }

  removeCardFromLine(lineNumber, cardName) {
    const line = this.getLine(lineNumber);
    line.removeVisibleCard(cardName);
  }

  getLine(lineNumber) {
    return this.lines[lineNumber - 1];
  }

  getVisibleCardCount() {
    return this.getLine(1).getVisibleCardCount() + this.getLine(2).getVisibleCardCount() + this.getLine(3).getVisibleCardCount();
  }

  isFull() {
    return getVisibleCardCount() === 3;
  }
}