//[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
function removeTheDuplicatesAndPreserveOrderAndReturnLength(array) {
  let result = [];
  let i = 0;
  let j = 0;
  for (; i < array.length; i++) {
    if (result.indexOf(array[i]) === -1) {
      result.push(array[i]);
    }
  }
  return result
}
console.log(removeTheDuplicatesAndPreserveOrderAndReturnLength([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]))