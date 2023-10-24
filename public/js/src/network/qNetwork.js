import deepLearning from "../const/deepLearning.js";

const replayMemory = [];

const createQNetwork = (inputDim, outputDim, hiddenLayers = [128, 128]) => {
  const model = tf.sequential();

  // Première couche cachée
  model.add(tf.layers.dense({ units: hiddenLayers[0], activation: 'relu', inputShape: [inputDim] }));

  // Couches cachées supplémentaires
  hiddenLayers.slice(1).forEach(units => {
    model.add(tf.layers.dense({ units: units, activation: 'relu' }));
  });

  // Couche de sortie
  model.add(tf.layers.dense({ units: outputDim, activation: 'linear' }));

  model.compile({ optimizer: tf.train.adam(), loss: 'meanSquaredError' });
  return model;
};

const selectEpsilonGreedyAction = async (state, model, numActions) => {
  if (Math.random() < deepLearning.epsilon) {
    // Choisir une action aléatoire
    return Math.floor(Math.random() * numActions);
  } else {
    // Choisir l'action optimale
    const qValues = await model.predict(tf.tensor([state])).array();
    return qValues[0].indexOf(Math.max(...qValues[0]));
  }
};

const learnFromMemory = async (batchSize, model, optimizer) => {
  if (replayMemory.length() < batchSize) {
    return;
  }
  const transitions = replayMemory.sample(batchSize);

  const currentStates = transitions.map(t => t.state);
  const actions = transitions.map(t => t.action);
  const rewards = transitions.map(t => t.reward);
  const nextStates = transitions.map(t => t.nextState);
  const dones = transitions.map(t => t.done);

  const currentQValues = await model.predict(tf.tensor(currentStates)).array();
  const nextQValues = await model.predict(tf.tensor(nextStates)).array();

  for (let i = 0; i < batchSize; i++) {
    if (dones[i]) {
      currentQValues[i][actions[i]] = rewards[i];
    } else {
      currentQValues[i][actions[i]] = rewards[i] + deepLearning.gamma * Math.max(...nextQValues[i]);
    }
  }

  // Entrainement du modèle
  const lossFn = () => {
    return tf.losses.meanSquaredError(tf.tensor(currentQValues), model.predict(tf.tensor(currentStates)));
  };

  optimizer.minimize(lossFn);
};

const addToReplayMemory = (state, action, reward, nextState, done) => {
  if (replayMemory.length > deepLearning.replayMemorySize) {
    replayMemory.shift();
  }
  replayMemory.push({ state, action, reward, nextState, done });
};

const sampleFromReplayMemory = (batchSize) => {
  const batch = [];
  for (let i = 0; i < batchSize; i++) {
    const randomIndex = Math.floor(Math.random() * replayMemory.length);
    batch.push(replayMemory[randomIndex]);
  }
  return batch;
};

export {
  createQNetwork,
  selectEpsilonGreedyAction,
  learnFromMemory,
  addToReplayMemory,
  sampleFromReplayMemory
};
