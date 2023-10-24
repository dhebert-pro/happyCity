import { ACTIONS } from "./src/enum/actions.js";
import { HappyCityGame } from "./src/model/HappyCityGame.js";
import { createQNetwork } from "./src/network/qNetwork.js";
import { getRandomElement } from "./src/util/RandomUtil.js";

const debug = false;


if (debug) {
  const game = new HappyCityGame(4);

  game.newTurn();

  while (!game.isGameFinished) {

    const availableActions = game.getAvailableActions();
    const action = getRandomElement(availableActions);

    game.do(action);

  }

} else {
  const stateSize = 630;  // taille de votre état
  const numActions = ACTIONS.length;  // Nombres d'actions possibles

  const qNetwork = createQNetwork(stateSize, numActions);
  qNetwork.summary();
}