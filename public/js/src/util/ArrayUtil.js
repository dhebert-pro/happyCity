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

const sortByProperty = (array, property) => {
  return array.sort((a, b) => {
    if (typeof a[property] === 'string') {
      return a[property].localeCompare(b[property]);
    } else {
      return a[property] - b[property];
    }
  });
}

function sortByMethod(array, methodName) {
  const result = [...array];
  result.sort((a, b) => a[methodName]() - b[methodName]());
  return result;
}

function countOccurrences(arr, target) {
  return arr.filter(item => item === target).length;
}

function removeAt(array, index) {
  return array.splice(index, 1)[0];
}

export {
  removeFirstItemByProperty,
  getFirstItemByProperty,
  sortByProperty,
  sortByMethod,
  countOccurrences,
  removeAt
}