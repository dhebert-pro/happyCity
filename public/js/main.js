import { ACTIONS } from "./src/enum/actions.js";
import { HappyCityGame } from "./src/model/HappyCityGame.js";
import { createQNetwork, selectEpsilonGreedyAction } from "./src/network/qNetwork.js";
import { getRandomElement } from "./src/util/RandomUtil.js";
import deepLearning from './src/const/deepLearning.js';
import { ReplayMemory } from "./src/model/ReplayMemory.js";

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
  const stateSize = 630;  // taille de l'état
  const numActions = ACTIONS.length;  // Nombres d'actions possibles

  const qNetwork = createQNetwork(stateSize, numActions);
  
  const replayMemory = new ReplayMemory(deepLearning.replayMemorySize);

}