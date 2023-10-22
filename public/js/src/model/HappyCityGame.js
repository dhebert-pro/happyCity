import cardCatalog from '../data/cardCatalog.js';
import { getRandomNumber, shuffle } from '../util/RandomUtil.js';
import { NormalCard } from './Card/NormalCard.js';
import { CentralZone } from './CentralZone.js';
import { DwellingZone } from './DwellingZone.js';
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
    this.dwellingZone = new DwellingZone(playerCount - 1);
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
    return this.canRemoveCardFromLine(lineNumber, cardName) && 
          !this.isCurrentPlayerFull() && 
          this.canCurrentPlayerBuy(lineNumber, cardName) &&
          !this.hasCurrentPlayerCard(cardName);
  }

  canCurrentPlayerTakeSpecialCard(cardName) {
    const card = this.getSpecialCard(cardName);
    return  !!card && 
            !this.isCurrentPlayerFull() && 
            this.hasCurrentPlayerConditions(card) &&
            !this.hasCurrentPlayerCard(cardName);
  }

  canCurrentPlayerTakeDwellingCard(cardName) {
    const card = this.getDwellingCard(cardName);
    return  !!card && !this.isCurrentPlayerFull() && 
            this.canCurrentPlayerBuyDwelling(cardName) &&
            !this.hasCurrentPlayerCard(cardName);
  }

  // ACTIONS

  removeCardFromLine(lineNumber, cardName) {
    console.log(`${this.getCurrentPlayer().name} remove card ${cardName} from line ${lineNumber}`);
    if (this.canRemoveCardFromLine(lineNumber, cardName)) {
      const cardRemoved = this.centralZone.removeCardFromLine(lineNumber, cardName);
      return cardRemoved;
    } else {
      throw new Error(`Card ${cardName} doesn't exist at line ${this.lineNumber}`);
    }
  }

  addCardToLine(lineNumber) {
    console.log(`${this.getCurrentPlayer().name} add card to line ${lineNumber}`);
    if (this.canAddCardToLine(lineNumber)) {
      this.centralZone.addCardToLine(lineNumber);
    } else {
      throw new Error(`Cards can't be added to line ${lineNumber}`);
    }
  }

  takeCardFromLine(lineNumber, cardName) {
    console.log(`${this.getCurrentPlayer().name} take card ${cardName} from line ${lineNumber}`);
    if (this.canCurrentPlayerTakeCardFromLine(lineNumber, cardName)) {
      const cardRemoved = this.removeCardFromLine(lineNumber, cardName);
      this.getCurrentPlayer().buyCard(cardRemoved);
    } else {
      throw new Error(`Current player can't take card ${cardName} from ${lineNumber}`);
    }
  }

  takeDwellingCard(cardName) {
    console.log(`${this.getCurrentPlayer().name} take dwelling card ${cardName}`);
    if (this.canCurrentPlayerTakeDwellingCard(cardName)) {
      const cardRemoved = this.removeDwellingCard(cardName);
      this.getCurrentPlayer().buyCard(cardRemoved);
    } else {
      throw new Error(`Current player can't take dwelling card ${cardName}`);
    }
  }

  takeSpecialCard(cardName) {
    console.log(`${this.getCurrentPlayer().name} take special card ${cardName}`);
    if (this.canCurrentPlayerTakeSpecialCard(cardName)) {
      const cardRemoved = this.removeSpecialCard(cardName);
      this.getCurrentPlayer().addSpecialCard(cardRemoved);
    } else {
      throw new Error(`Current player can't take special card ${cardName}`);
    }
  }

  newTurn() {
    console.log(`New turn : ${this.nbTurn + 1}`);
    this.nbTurn++;
    if (this.isGameFinished() || this.nbTurn > 20) {
      console.log('Fin du jeu');
    } else {
      this.earnRevenue();
    }
  }

  nextPlayer() {
    console.log(`Next player : ${this.currentPlayerIndex === this.playerCount - 1 ? 0 : this.currentPlayerIndex + 1}`);
    if (this.currentPlayerIndex === this.playerCount - 1) {
      this.currentPlayerIndex = 0;
      nextTurn();
    } else {
      this.currentPlayerIndex = 1;
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

  canCurrentPlayerBuyDwelling(cardName) {
    const card = this.getDwellingCard(cardName);
    return this.getCurrentPlayer().canBuy(card);
  }

  hasCurrentPlayerCard(cardName) {
    return this.getCurrentPlayer().hasCard(cardName);
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

  getDwellingCard(cardName) {
    const card = this.dwellingZone.getCardByName(cardName);
    return card;
  }

  removeSpecialCard(cardName) {
    const cardRemoved = this.specialZone.removeCard(cardName);
    return cardRemoved;
  }

  removeDwellingCard(cardName) {
    const cardRemoved = this.dwellingZone.removeCard(cardName);
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