class QLearningAgent {
  constructor(actions, alpha = 0.1, gamma = 0.9, epsilon = 0.1) {
    this.qTable = {};
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.actions = actions;
  }

  chooseAction(state) {
    if (Math.random() < this.epsilon) {
      // Choisir une action aléatoire pour l'exploration
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else {
      // Choisir la meilleure action pour cette politique d'état (gloutonne)
      return this.maxQAction(state);
    }
  }

  maxQAction(state) {
    let maxQ = -Infinity;
    let bestAction = null;
    for (let action of this.actions) {
      let q = this.qTable[`${state}-${action}`] || 0;
      if (q > maxQ) {
        maxQ = q;
        bestAction = action;
      }
    }
    return bestAction;
  }

  learn(state, action, reward, nextState) {
    let currentQ = this.qTable[`${state}-${action}`] || 0;
    let maxNextQ = this.qValue(nextState, this.maxQAction(nextState));
    this.qTable[`${state}-${action}`] = currentQ + this.alpha * (reward + this.gamma * maxNextQ - currentQ);
  }

  qValue(state, action) {
    return this.qTable[`${state}-${action}`] || 0;
  }
}