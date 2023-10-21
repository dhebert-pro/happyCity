const removeFirstItemByProperty = (arr, propName, targetName) => {
  const index = arr.findIndex(item => item[propName] === targetName);
  if (index !== -1) {
    return arr.splice(index, 1)[0];
  }
  return undefined;
}

export {
  removeFirstItemByProperty
}