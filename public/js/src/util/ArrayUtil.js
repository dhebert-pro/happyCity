const removeFirstItemByProperty = (arr, propName, targetName) => {
  const index = arr.findIndex(item => item[propName] === targetName);
  if (index !== -1) {
    return arr.splice(index, 1)[0];
  }
  return undefined;
}

const getFirstItemByProperty = (arr, propName, targetName) => {
  return arr.find(item => item[propName] === targetName);
}

export {
  removeFirstItemByProperty,
  getFirstItemByProperty
}