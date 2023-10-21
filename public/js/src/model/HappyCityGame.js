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
    this.specialCards = new SpecialZone(playerCount + 2);
    this.currentPlayerIndex = getRandomNumber(0, playerCount - 1);
  }

  //ACTIONS
  removeCardFromLine(lineNumber, cardName) {
    const cardRemoved = this.centralZone.removeCardFromLine(lineNumber, cardName);
    return cardRemoved;
  }

  addCardToLine(lineNumber) {
    this.centralZone.addCardToLine(lineNumber);
  }

  takeCardFromLine(lineNumber, cardName) {
    const cardRemoved = this.removeCardFromLine(lineNumber, cardName);
    this.players[this.currentPlayerIndex].buyCard(cardRemoved);
  }

  newTurn() {
    this.nbTurn++;
    if (this.isGameFinished() || this.nbTurn > 20) {
      console.log('Fin du jeu');
    } else {
      this.earnRevenue();
    }
  }

  // OTHER ACTIONS
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

  //GET-SET
  getPlayerByIndex(index) {
    return this.players[index];
  }

  addPlayer(name) {
    this.players.push(new Player(name));
  }

}