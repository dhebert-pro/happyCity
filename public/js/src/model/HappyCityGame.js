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
    this.centralZone.removeCardFromLine(lineNumber, cardName);
  }

  addCardToLine(lineNumber) {
    console.log('Add Card');
    this.centralZone.addCardToLine(lineNumber);
  }

  //GET-SET
  getPlayerByIndex(index) {
    return this.players[index];
  }

  addPlayer(name) {
    this.players.push(new Player(name));
  }

}