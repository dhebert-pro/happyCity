import cardCatalog from '../data/cardCatalog.js';
import { sortByMethod } from '../util/ArrayUtil.js';
import { getRandomNumber, shuffle } from '../util/RandomUtil.js';
import { NormalCard } from './Card/NormalCard.js';
import { CentralZone } from './CentralZone.js';
import { DwellingZone } from './DwellingZone.js';
import { Player } from './Player.js';
import { SpecialZone } from './SpecialZone.js';
import ACTIONS from '../enum/actions.js';

export class HappyCityGame {
  constructor(playerCount) {
    this.playerCount = playerCount;
    this.players = [];
    this.nbTurn = 0;
    this.isGameFinished = false;
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
    return  !!card && 
            !this.hasCurrentPlayerRemovedCard() && 
            !this.hasCurrentPlayerAddedCard() &&
            !this.hasCurrentPlayerTakenNormalCard() &&
            !this.hasCurrentPlayerTakenSpecialCard() &&
            !this.hasCurrentPlayerSkippedTurn();
  }

  canAddCardToLine(lineNumber) {
    return  !this.isCentralZoneFull() && 
            !this.isCentralZoneLineDeckEmpty(lineNumber) &&
            !this.hasCurrentPlayerTakenNormalCard() &&
            !this.hasCurrentPlayerTakenSpecialCard() &&
            !this.hasCurrentPlayerSkippedTurn();
  }

  canTakeCardFromLine(lineNumber, cardName) {
    const card = this.getCardFromLine(lineNumber, cardName);
    return  !!card &&
            !this.isCurrentPlayerFull() && 
            this.canCurrentPlayerBuy(lineNumber, cardName) &&
            !this.hasCurrentPlayerCard(cardName) &&
            this.isCentralZoneFull() &&
            !this.hasCurrentPlayerTakenNormalCard() &&
            !this.hasCurrentPlayerTakenSpecialCard() &&
            !this.hasCurrentPlayerSkippedTurn();
  }

  canTakeSpecialCard(cardName) {
    const card = this.getSpecialCard(cardName);
    return  !!card && 
            !this.isCurrentPlayerFull() && 
            this.hasCurrentPlayerConditions(card) &&
            this.isCentralZoneFull() &&
            !this.hasCurrentPlayerSpecialCard() &&
            !this.hasCurrentPlayerTakenSpecialCard();
  }

  canTakeDwellingCard(cardName) {
    const card = this.getDwellingCard(cardName);
    return  !!card && 
            !this.isCurrentPlayerFull() && 
            this.canCurrentPlayerBuyDwelling(cardName) &&
            !this.hasCurrentPlayerCard(cardName) &&
            this.isCentralZoneFull() &&
            !this.hasCurrentPlayerTakenNormalCard() &&
            !this.hasCurrentPlayerTakenSpecialCard() &&
            !this.hasCurrentPlayerSkippedTurn();
  }

  canSkipTurn() {
    return  this.isCentralZoneFull() &&
            !this.hasCurrentPlayerTakenNormalCard() &&
            !this.hasCurrentPlayerTakenSpecialCard() &&
            !this.hasCurrentPlayerSkippedTurn();
  }

  canEndTurn() {
    return  this.hasCurrentPlayerTakenNormalCard() ||
            this.hasCurrentPlayerTakenSpecialCard() ||
            this.hasCurrentPlayerSkippedTurn();
  }

  // ACTIONS

  removeCardFromLine(lineNumber, cardName) {
    console.log(`${this.getCurrentPlayer().name} remove card ${cardName} from line ${lineNumber}`);
    if (this.canRemoveCardFromLine(lineNumber, cardName)) {
      const cardRemoved = this.centralZone.removeCardFromLine(lineNumber, cardName);
      this.getCurrentPlayer().hasRemovedCard = true;
      return cardRemoved;
    } else {
      throw new Error(`Card ${cardName} can't be removed from line ${this.lineNumber}`);
    }
  }

  addCardToLine(lineNumber) {
    console.log(`${this.getCurrentPlayer().name} add card to line ${lineNumber}`);
    if (this.canAddCardToLine(lineNumber)) {
      this.centralZone.addCardToLine(lineNumber);
      this.getCurrentPlayer().hasAddedCard = true;
    } else {
      throw new Error(`Cards can't be added to line ${lineNumber}`);
    }
  }

  takeCardFromLine(lineNumber, cardName) {
    console.log(`${this.getCurrentPlayer().name} take card ${cardName} from line ${lineNumber}`);
    if (this.canTakeCardFromLine(lineNumber, cardName)) {
      const cardRemoved = this.centralZone.removeCardFromLine(lineNumber, cardName);
      this.getCurrentPlayer().buyCard(cardRemoved);
      this.getCurrentPlayer().hasTakenNormalCard = true;
    } else {
      throw new Error(`Current player can't take card ${cardName} from ${lineNumber}`);
    }
  }

  takeDwellingCard(cardName) {
    console.log(`${this.getCurrentPlayer().name} take dwelling card ${cardName}`);
    if (this.canTakeDwellingCard(cardName)) {
      const cardRemoved = this.removeDwellingCard(cardName);
      this.getCurrentPlayer().buyCard(cardRemoved);
      this.getCurrentPlayer().hasTakenNormalCard = true;
    } else {
      throw new Error(`Current player can't take dwelling card ${cardName}`);
    }
  }

  takeSpecialCard(cardName) {
    console.log(`${this.getCurrentPlayer().name} take special card ${cardName}`);
    if (this.canTakeSpecialCard(cardName)) {
      const cardRemoved = this.removeSpecialCard(cardName);
      this.getCurrentPlayer().addCard(cardRemoved);
      this.getCurrentPlayer().hasTakenSpecialCard = true;
    } else {
      throw new Error(`Current player can't take special card ${cardName}`);
    }
  }

  skipTurn() {
    console.log(`${this.getCurrentPlayer().name} skip turn`);
    if (this.canSkipTurn()) {
      this.getCurrentPlayer().skipTurn();
      this.getCurrentPlayer().hasSkippedTurn = true;
    } else {
      throw new Error(`Current player can't skip turn`);
    }
  }

  endTurn() {
    console.log(`${this.getCurrentPlayer().name} end turn`);
    if (this.canEndTurn()) {
      this.nextPlayer();
      this.getCurrentPlayer().hasEndedTurn = true;
    } else {
      throw new Error(`Current player can't end turn`);
    }
  }

  newTurn() {
    console.log(`New turn : ${this.nbTurn + 1}`);
    this.nbTurn++;
    if (this.isLastTurn()) {
      this.isGameFinished = true;
      const rankings = this.getRankings();
      rankings.forEach(ranking => {
        console.log('- ', ranking.name, ranking.getTotalScore());
      })
      console.log('Fin du jeu', this);
    } else {
      this.earnRevenue();
    }
  }

  nextPlayer() {
    console.log(`Next player : ${this.currentPlayerIndex === this.playerCount - 1 ? 0 : this.currentPlayerIndex + 1}`);
    this.getCurrentPlayer().resetTurn();
    if (this.currentPlayerIndex === this.playerCount - 1) {
      this.currentPlayerIndex = 0;
      this.newTurn();
    } else {
      this.currentPlayerIndex++;
    }
  }

  // OTHER METHODS

  isCurrentPlayerFull() {
    return this.getCurrentPlayer().isFull();
  }

  hasCurrentPlayerRemovedCard() {
    return this.getCurrentPlayer().hasRemovedCard;
  }

  hasCurrentPlayerAddedCard() {
    return this.getCurrentPlayer().hasAddedCard;
  }

  hasCurrentPlayerTakenNormalCard() {
    return this.getCurrentPlayer().hasTakenNormalCard;
  }

  hasCurrentPlayerTakenSpecialCard() {
    return this.getCurrentPlayer().hasTakenSpecialCard;
  }

  hasCurrentPlayerSkippedTurn() {
    return this.getCurrentPlayer().hasSkippedTurn;
  }

  hasCurrentPlayerConditions(card) {
    return !!card && this.getCurrentPlayer().hasConditions(card.conditions);
  }

  canCurrentPlayerBuy(lineNumber, cardName) {
    const card = this.getCardFromLine(lineNumber, cardName);
    return !!card && this.getCurrentPlayer().canBuy(card);
  }

  canCurrentPlayerBuyDwelling(cardName) {
    const card = this.getDwellingCard(cardName);
    return !!card && this.getCurrentPlayer().canBuy(card);
  }

  hasCurrentPlayerCard(cardName) {
    return this.getCurrentPlayer().hasCard(cardName);
  }

  hasCurrentPlayerSpecialCard() {
    return this.getCurrentPlayer().hasSpecialCard();
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

  getSpecialCards() {
    return this.specialZone.cards;
  }

  getDwellingCard(cardName) {
    const card = this.dwellingZone.getCardByName(cardName);
    return card;
  }

  getDwellingCards() {
    return this.dwellingZone.cards;
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

  isLastTurn() {
    let result = false;
    this.players.forEach(player => {
      if (player.isFull() || this.nbTurn > 20) {
        result = true;
      }
    })
    return result;
  }

  getCardFromLine(lineNumber, cardName) {
    return this.centralZone.getCardFromLine(lineNumber, cardName);
  }

  getCardsFromLine(lineNumber) {
    return this.centralZone.getCardsFromLine(lineNumber);
  }

  getRankings() {
    return sortByMethod(this.players, 'getTotalScore');
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getCurrentPlayerScore() {
    return this.getCurrentPlayer().getTotalScore();
  }

  getPlayerByIndex(index) {
    return this.players[index];
  }

  addPlayer(name) {
    this.players.push(new Player(name));
  }

  do(action) {
    switch (action.type) {
      case 'removeCardFromLine' : 
        this.removeCardFromLine(action.lineNumber, action.cardName);
        break;
      case 'addCardToLine': 
        this.addCardToLine(action.lineNumber);
        break;
      case 'takeCardFromLine': 
        this.takeCardFromLine(action.lineNumber, action.cardName);
        break;
      case 'takeDwellingCard': 
        this.takeDwellingCard(action.cardName);
        break;
      case 'takeSpecialCard': 
        this.takeSpecialCard(action.cardName);
        break;
      case 'skipTurn': 
        this.skipTurn();
        break;
      case 'endTurn': 
        this.endTurn();
        break;
      default:
        throw new Error('No action avalaible');
    }
  }

  //Apprentissage

  getState() {
    return this;
  }

  getAvailableActions() {
    let availableActions = [];
    for (let lineIndex = 0; lineIndex < 3; lineIndex++) {
      const lineNumber = lineIndex + 1;
      if (this.canAddCardToLine(lineNumber)) {
        availableActions.push(ACTIONS.ADD_CARD_TO_LINE(lineNumber));
      }
      const cards = this.getCardsFromLine(lineNumber);
      for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
        const card = cards[cardIndex];
        if (this.canRemoveCardFromLine(lineNumber, card.name)) {
          availableActions.push(ACTIONS.REMOVE_CARD_FROM_LINE(lineNumber, card.name));
        }
        if (this.canTakeCardFromLine(lineNumber, card.name)) {
          availableActions.push(ACTIONS.TAKE_CARD_FROM_LINE(lineNumber, card.name));
        }
      }
    }
    const dwellingCards = this.getDwellingCards();
    for (let cardIndex = 0; cardIndex < dwellingCards.length; cardIndex++) {
      const card = dwellingCards[cardIndex];
      if (this.canTakeDwellingCard(card.name)) {
        availableActions.push(ACTIONS.TAKE_DWELLING_CARD(card.name));
      }
    }
    
    const specialCards = this.getSpecialCards();
    for (let cardIndex = 0; cardIndex < specialCards.length; cardIndex++) {
      const card = specialCards[cardIndex];
      if (this.canTakeSpecialCard(card.name)) {
        availableActions.push(ACTIONS.TAKE_SPECIAL_CARD(card.name));
      }
    }

    if (this.canSkipTurn()) {
      availableActions.push(ACTIONS.SKIP_TURN());
    }

    if (this.canEndTurn()) {
      availableActions.push(ACTIONS.END_TURN());
    }

    return availableActions;
  }


}