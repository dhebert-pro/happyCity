import cardCatalog from '../data/cardCatalog.js';
import { countOccurrences, sortByMethod } from '../util/ArrayUtil.js';
import { getRandomNumber, shuffle } from '../util/RandomUtil.js';
import { NormalCard } from './Card/NormalCard.js';
import { CentralZone } from './CentralZone.js';
import { DwellingZone } from './DwellingZone.js';
import { Player } from './Player.js';
import { SpecialZone } from './SpecialZone.js';
import { ACTIONS, getActionIndex } from '../enum/actions.js';
import { SpecialCard } from './Card/SpecialCard.js';
import { DwellingCard } from './Card/DwellingCard.js';
import { StartCard } from './Card/StartCard.js';

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
      this.getPlayerByIndex(playerNum).addCard(StartCard.getFromList(startCardList[playerNum]));
    }
    this.centralZone = new CentralZone();
    this.specialZone = new SpecialZone(playerCount + 2);
    this.dwellingZone = new DwellingZone(playerCount - 1);
    this.currentPlayerIndex = getRandomNumber(0, playerCount - 1);
  }

  // CAN

  canRemoveCardFromLine(lineNumber, position) {
    const card = this.getCardFromLine(lineNumber, position);
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

  canTakeCardFromLine(lineNumber, position) {
    const card = this.getCardFromLine(lineNumber, position);
    const cardName = card.name;
    return  !!card &&
            !this.isCurrentPlayerFull() && 
            this.canCurrentPlayerBuy(lineNumber, position) &&
            !this.hasCurrentPlayerCard(cardName) &&
            this.isCentralZoneFull() &&
            !this.hasCurrentPlayerTakenNormalCard() &&
            !this.hasCurrentPlayerTakenSpecialCard() &&
            !this.hasCurrentPlayerSkippedTurn();
  }

  canTakeSpecialCard(position) {
    const card = this.getSpecialCard(position);
    return  !!card && 
            !this.isCurrentPlayerFull() && 
            this.hasCurrentPlayerConditions(card) &&
            this.isCentralZoneFull() &&
            !this.hasCurrentPlayerSpecialCard() &&
            !this.hasCurrentPlayerTakenSpecialCard();
  }

  canTakeDwellingCard(position) {
    const card = this.getDwellingCard(position);
    const cardName = card.name;
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

  removeCardFromLine(lineNumber, position) {
    console.log(`${this.getCurrentPlayer().name} remove card at position ${position} from line ${lineNumber}`);
    if (this.canRemoveCardFromLine(lineNumber, position)) {
      const cardRemoved = this.centralZone.removeCardFromLine(lineNumber, position);
      this.getCurrentPlayer().hasRemovedCard = true;
      return cardRemoved;
    } else {
      throw new Error(`Card at position ${position} can't be removed from line ${this.lineNumber}`);
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

  takeCardFromLine(lineNumber, position) {
    console.log(`${this.getCurrentPlayer().name} take card at position ${position} from line ${lineNumber}`);
    if (this.canTakeCardFromLine(lineNumber, position)) {
      const cardRemoved = this.centralZone.removeCardFromLine(lineNumber, position);
      this.getCurrentPlayer().buyCard(cardRemoved);
      this.getCurrentPlayer().hasTakenNormalCard = true;
    } else {
      throw new Error(`Current player can't take card at position ${position} from ${lineNumber}`);
    }
  }

  takeDwellingCard(position) {
    console.log(`${this.getCurrentPlayer().name} take dwelling card at position ${position}`);
    if (this.canTakeDwellingCard(position)) {
      const cardRemoved = this.removeDwellingCard(position);
      this.getCurrentPlayer().buyCard(cardRemoved);
      this.getCurrentPlayer().hasTakenNormalCard = true;
    } else {
      throw new Error(`Current player can't take dwelling card at position ${position}`);
    }
  }

  takeSpecialCard(position) {
    console.log(`${this.getCurrentPlayer().name} take special card at position ${position}`);
    if (this.canTakeSpecialCard(position)) {
      const cardRemoved = this.removeSpecialCard(position);
      this.getCurrentPlayer().addCard(cardRemoved);
      this.getCurrentPlayer().hasTakenSpecialCard = true;
    } else {
      throw new Error(`Current player can't take special card at position ${position}`);
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

  canCurrentPlayerBuy(lineNumber, position) {
    const card = this.getCardFromLine(lineNumber, position);
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

  getSpecialCard(position) {
    const card = this.specialZone.getCardByPosition(position);
    return card;
  }

  getSpecialCards() {
    return this.specialZone.cards;
  }

  getDwellingCard(position) {
    const card = this.dwellingZone.getCardByPosition(position);
    return card;
  }

  getDwellingCards() {
    return this.dwellingZone.cards;
  }

  removeSpecialCard(position) {
    const cardRemoved = this.specialZone.removeCard(position);
    return cardRemoved;
  }

  removeDwellingCard(position) {
    const cardRemoved = this.dwellingZone.removeCard(position);
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

  getCardFromLine(lineNumber, position) {
    return this.centralZone.getCardFromLine(lineNumber, position);
  }

  getCardsFromLines() {
    return this.centralZone.getCards();
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

  do(numAction) {
    const action = ACTIONS[numAction];
    switch (action.type) {
      case 'removeCardFromLine' : 
        this.removeCardFromLine(action.lineNumber, action.position - 1);
        break;
      case 'addCardToLine': 
        this.addCardToLine(action.lineNumber);
        break;
      case 'takeCardFromLine': 
        this.takeCardFromLine(action.lineNumber, action.position - 1);
        break;
      case 'takeDwellingCard': 
        this.takeDwellingCard(action.position - 1);
        break;
      case 'takeSpecialCard': 
        this.takeSpecialCard(action.position - 1);
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
    const state = {
      nbPlayers: this.playerCount / 5,
      hasCurrentPlayerRemovedCard: this.hasCurrentPlayerRemovedCard() ? 1 : 0,
      hasCurrentPlayerAddedCard: this.hasCurrentPlayerAddedCard() ? 1 : 0,
      hasCurrentPlayerTakenNormalCard: this.hasCurrentPlayerTakenNormalCard() ? 1 : 0,
      hasCurrentPlayerTakenSpecialCard: this.hasCurrentPlayerTakenSpecialCard() ? 1 : 0,
      hasCurrentPlayerSkippedTurn: this.hasCurrentPlayerSkippedTurn() ? 1 : 0
    };
    for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
      state[`coins${playerIndex}`] = 0;
    }
    //Récupération du nom de toutes les cartes
    const startCardList = StartCard.getCardList();
    startCardList.forEach(card => {
      for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
        state[`${card}Player${playerIndex}`] = 0;
      }
    });
    const level1CardList = NormalCard.getCardList(1);
    level1CardList.forEach(card => {
      for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
        state[`${card}1Player${playerIndex}`] = 0;
        state[`${card}2Player${playerIndex}`] = 0;
      }
      state[`${card}1Revealed`] = 0;
      state[`${card}2Revealed`] = 0;
    });
    const level2CardList = NormalCard.getCardList(2);
    level2CardList.forEach(card => {
      for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
        state[`${card}1Player${playerIndex}`] = 0;
        state[`${card}2Player${playerIndex}`] = 0;
      }
      state[`${card}1Revealed`] = 0;
      state[`${card}2Revealed`] = 0;
    });
    const level3CardList = NormalCard.getCardList(3);
    level3CardList.forEach(card => {
      for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
        state[`${card}1Player${playerIndex}`] = 0;
        state[`${card}2Player${playerIndex}`] = 0;
      }
      state[`${card}1Revealed`] = 0;
      state[`${card}2Revealed`] = 0;
    });
    level3CardList.forEach(card => {
      for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
        state[`${card}1Player${playerIndex}`] = 0;
        state[`${card}2Player${playerIndex}`] = 0;
      }
      state[`${card}1Revealed`] = 0;
      state[`${card}2Revealed`] = 0;
    });
    const specialCardList = SpecialCard.getCardList();
    specialCardList.forEach(card => {
      for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
        state[`${card}Player${playerIndex}`] = 0;
      }
      state[`${card}Selected`] = 0;
    });
    const dwellingCardList = DwellingCard.getCardList();
    dwellingCardList.forEach(card => {
      for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
        state[`${card}1Player${playerIndex}`] = 0;
        state[`${card}2Player${playerIndex}`] = 0;
        state[`${card}3Player${playerIndex}`] = 0;
        state[`${card}4Player${playerIndex}`] = 0;
        state[`${card}5Player${playerIndex}`] = 0;
      }
      state[`${card}1Selected`] = 0;
      state[`${card}2Selected`] = 0;
      state[`${card}3Selected`] = 0;
      state[`${card}4Selected`] = 0;
      state[`${card}5Selected`] = 0;
    });

    const revealedCards = [];

    for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
      const player = this.players[playerIndex];
      let playerCards =  [];
      if (player) {
        playerCards = player.getCards();
        state[`coins${playerIndex}`] = Math.log10(player.coins + 1) / Math.log10(400 + 1);
      }
      playerCards.forEach(card => {
        const occurrenceCount = countOccurrences(revealedCards, card.name);
        const type = card.type;
        switch (type) {
          case 'Start':
            state[`${card.name}Player${playerIndex}`] = 1;
            break;
          case 'Normal':
            state[`${card.name}${occurrenceCount + 1}Player${playerIndex}`] = 1;
            state[`${card.name}${occurrenceCount + 1}Revealed`] = 1;
            console.log('PushNormal', card.name, occurrenceCount + 1, playerIndex);
            revealedCards.push(card.name);
            break;
          case 'Special':
            state[`${card.name}Player${playerIndex}`] = 1;
            state[`${card.name}Selected`] = 1;
            break;
          case 'Dwelling':
            state[`${card.name}${occurrenceCount + 1}Player${playerIndex}`] = 1;
            state[`${card.name}${occurrenceCount + 1}Selected`] = 1;
            revealedCards.push(card.name);
            break;
          default:
            throw new Error('Type not found', type);
        }
      });
    }
    const lineCards = this.getCardsFromLines();
    lineCards.forEach(card => {
      const occurrenceCount = countOccurrences(revealedCards, card.name);
      state[`${card.name}${occurrenceCount + 1}Revealed`] = 1;
      console.log('PushLine', card.name, occurrenceCount + 1);
      revealedCards.push(card.name);
    });
    const dwellingCards = this.getDwellingCards();
    dwellingCards.forEach(card => {
      const occurrenceCount = countOccurrences(revealedCards, card.name);
      state[`${card.name}${occurrenceCount + 1}Selected`] = 1;
      console.log('PushDwelling', card.name, occurrenceCount + 1);
      revealedCards.push(card.name);
    });
    const specialCards = this.getSpecialCards();
    specialCards.forEach(card => {
      state[`${card.name}Selected`] = 1;
    });
    console.log('revealed', revealedCards);
    return state;
  }

  getAvailableActions() {
    let availableActions = [];
    for (let lineIndex = 0; lineIndex < 3; lineIndex++) {
      const lineNumber = lineIndex + 1;
      if (this.canAddCardToLine(lineNumber)) {
        availableActions.push(getActionIndex(`ADD_CARD_TO_LINE_${lineNumber}`));
      }
      const cards = this.getCardsFromLine(lineNumber);
      for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
        if (this.canRemoveCardFromLine(lineNumber, cardIndex)) {
          availableActions.push(getActionIndex(`REMOVE_CARD_FROM_LINE_${lineNumber}_POSITION_${cardIndex + 1}`));
        }
        if (this.canTakeCardFromLine(lineNumber, cardIndex)) {
          availableActions.push(getActionIndex(`TAKE_CARD_FROM_LINE_${lineNumber}_POSITION_${cardIndex + 1}`));
        }
      }
    }
    const dwellingCards = this.getDwellingCards();
    for (let cardIndex = 0; cardIndex < dwellingCards.length; cardIndex++) {
      const card = dwellingCards[cardIndex];
      if (this.canTakeDwellingCard(cardIndex)) {
        availableActions.push(getActionIndex(`TAKE_DWELLING_CARD_${cardIndex + 1}`));
      }
    }
    
    const specialCards = this.getSpecialCards();
    for (let cardIndex = 0; cardIndex < specialCards.length; cardIndex++) {
      if (this.canTakeSpecialCard(cardIndex)) {
        availableActions.push(getActionIndex(`TAKE_SPECIAL_CARD_${cardIndex + 1}`));
      }
    }

    if (this.canSkipTurn()) {
      availableActions.push(getActionIndex('SKIP_TURN'));
    }

    if (this.canEndTurn()) {
      availableActions.push(getActionIndex('END_TURN'));
    }

    return availableActions;
  }


}