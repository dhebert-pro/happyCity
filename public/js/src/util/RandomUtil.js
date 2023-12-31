const shuffle = (arr) => {
  if (!arr) {
    return arr;
  }
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled;
}

const getRandomElements = (arr, n) => {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, n);
}

const getRandomElement = (arr) => {
  if (!arr) {
    return arr;
  }
  const shuffled = shuffle(arr);
  return shuffled.slice(0, 1)[0];
}

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { 
  shuffle,
  getRandomElements,
  getRandomElement,
  getRandomNumber,
};