const removeFirstItemByProperty = (arr, propName, targetName) => {
  const index = arr.findIndex(item => item[propName] === targetName);
  const itemFound = (index !== -1);
  if (itemFound) {
    arr.splice(index, 1);
  }
  return itemFound;
}

export {
  removeFirstItemByProperty
}