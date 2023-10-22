import { HappyCityGame } from "./src/model/HappyCityGame.js";
import { getRandomNumber } from "./src/util/RandomUtil.js";

const game = new HappyCityGame(4);

game.addCardToLine(3);
game.addCardToLine(3);

game.newTurn();

while (!game.isGameFinished) {

  if (game.canRemoveCardFromLine(3, game.centralZone.getLine(3).visibleCards[1]?.name)) {
    game.removeCardFromLine(3, game.centralZone.getLine(3).visibleCards[1].name);
  }

  if (game.canAddCardToLine(1)) {
    game.addCardToLine(1);
  }

  if (game.canAddCardToLine(1)) {
    game.addCardToLine(1);
  }

  if (getRandomNumber(0, 1) === 1) {
    if (game.canCurrentPlayerTakeCardFromLine(1, game.centralZone.getLine(1).visibleCards[0]?.name)) {
      game.takeCardFromLine(1, game.centralZone.getLine(1).visibleCards[0].name);
    } else {
      game.skipTurn();
    }
  } else {
    if (game.canCurrentPlayerTakeDwellingCard(game.dwellingZone.cards[0]?.name)) {
      game.takeDwellingCard(game.dwellingZone.cards[0].name);
    } else {
      game.skipTurn();
    }
  }

  if (game.canCurrentPlayerTakeSpecialCard(game.specialZone.cards[0]?.name)) {
    game.takeSpecialCard(game.specialZone.cards[0].name);
  }

  game.nextPlayer();

}