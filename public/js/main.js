import { HappyCityGame } from "./src/model/HappyCityGame.js";
import { getRandomElement, getRandomNumber } from "./src/util/RandomUtil.js";

const game = new HappyCityGame(4);

game.newTurn();

while (!game.isGameFinished) {

  const availableActions = game.getAvailableActions();
  const action = getRandomElement(availableActions);

  game.do(action);

}