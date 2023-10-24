export default {
  learningRate: 0.001, //Taux d'ajustement des poids
  gamma: 0.99, //Appréciation de la récompense future par rapport à la récompense immédiate
  epsilon: 1, //Taux d'action aléatoire
  epsilonDecay: 0.995, //Taux de réduction d'epsilon
  epsilonMin: 0.01, //Epsilon minimum
  batchSize: 64, //Echantillonnage de la mémoire de replay
  replayMemorySize: 10000 //Taille de la mémoire de replay
}