import cardCatalog from '../data/cardCatalog.js';
import { getRandomNumber, shuffle } from '../util/RandomUtil.js';
import { NormalCard } from './Card/NormalCard.js';
import { CentralZone } from './CentralZone.js';
import { Player } from './Player.js';
import { SpecialZone } from './SpecialZone.js';

export class HappyCityGame {
  constructor(playerCount) {
    this.playerCount = playerCount;
    this.players = [];
    this.nbTurn = 0;
    for(let playerNum = 0; playerNum < playerCount; playerNum++) {
      this.addPlayer(`Joueur ${playerNum + 1}`);
    }
    const startCardList = shuffle(cardCatalog.start);
    for (let playerNum = 0; playerNum < playerCount; playerNum++) {
      this.getPlayerByIndex(playerNum).addCard(NormalCard.getFromList(startCardList[playerNum]));
    }
    this.centralZone = new CentralZone();
    this.specialZone = new SpecialZone(playerCount + 2);
    this.currentPlayerIndex = getRandomNumber(0, playerCount - 1);
  }

  // CAN

  canRemoveCardFromLine(lineNumber, cardName) {
    const card = this.getCardFromLine(lineNumber, cardName);
    return !!card;
  }

  canAddCardToLine(lineNumber) {
    return !this.isCentralZoneFull() && !this.isCentralZoneLineDeckEmpty(lineNumber);
  }

  canCurrentPlayerTakeCardFromLine(lineNumber, cardName) {
    return this.canRemoveCardFromLine(lineNumber, cardName) && this.canCurrentPlayerBuy(lineNumber, cardName);
  }

  canCurrentPlayerTakeSpecialCard(cardName) {
    const card = this.getSpecialCard(cardName);
    return !!card && !this.isCurrentPlayerFull() && this.hasCurrentPlayerConditions(card);
  }

  // ACTIONS

  removeCardFromLine(lineNumber, cardName) {
    if (this.canRemoveCardFromLine(lineNumber, cardName)) {
      const cardRemoved = this.centralZone.removeCardFromLine(lineNumber, cardName);
      return cardRemoved;
    } else {
      throw new Error(`Card ${cardName} doesn't exist at line ${this.lineNumber}`);
    }
  }

  addCardToLine(lineNumber) {
    if (this.canAddCardToLine(lineNumber)) {
      this.centralZone.addCardToLine(lineNumber);
    } else {
      throw new Error(`Cards can't be added to line ${lineNumber}`);
    }
  }

  takeCardFromLine(lineNumber, cardName) {
    if (this.canCurrentPlayerTakeCardFromLine(lineNumber, cardName)) {
      const cardRemoved = this.removeCardFromLine(lineNumber, cardName);
      this.getCurrentPlayer().buyCard(cardRemoved);
    } else {
      throw new Error(`Current player can't take card ${cardName} from ${lineNumber}`);
    }
  }

  takeSpecialCard(cardName) {
    if (this.canCurrentPlayerTakeSpecialCard(cardName)) {
      const cardRemoved = this.removeSpecialCard(cardName);
      this.getCurrentPlayer().addSpecialCard(cardRemoved);
    } else {
      throw new Error(`Current player can't take special card ${cardName}`);
    }
  }

  newTurn() {
    this.nbTurn++;
    if (this.isGameFinished() || this.nbTurn > 20) {
      console.log('Fin du jeu');
    } else {
      this.earnRevenue();
    }
  }

  // OTHER METHODS

  isCurrentPlayerFull() {
    return this.getCurrentPlayer().isFull();
  }

  hasCurrentPlayerConditions(card) {
    return this.getCurrentPlayer().hasConditions(card.conditions);
  }

  canCurrentPlayerBuy(lineNumber, cardName) {
    const card = this.getCardFromLine(lineNumber, cardName);
    return this.getCurrentPlayer().canBuy(card);
  }

  isCentralZoneLineDeckEmpty(lineNumber) {
    return this.centralZone.isLineDeckEmpty(lineNumber);
  }

  isCentralZoneFull() {
    return this.centralZone.isFull();
  }

  getSpecialCard(cardName) {
    const card = this.specialZone.getCardByName(cardName);
    return card;
  }

  removeSpecialCard(cardName) {
    const cardRemoved = this.specialZone.removeCard(cardName);
    return cardRemoved;
  }

  earnRevenue() {
    this.players.forEach(player => {
      player.earnRevenue();
    });
  }

  isGameFinished() {
    let result = false;
    this.players.forEach(player => {
      if (player.isFull()) {
        result = true;
      }
    })
    return result;
  }

  getCardFromLine(line, cardName) {
    return this.centralZone.getCardFromLine(line, cardName);
  }

  //GET-SET
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getPlayerByIndex(index) {
    return this.players[index];
  }

  addPlayer(name) {
    this.players.push(new Player(name));
  }

}