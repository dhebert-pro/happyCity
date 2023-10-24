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

export {
  createQNetwork
};
