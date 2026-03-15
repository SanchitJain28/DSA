function moveAllEvenNumbersToTheEnd(array: number[]) {
  let i = 0;
  let j = 0;
  let evenNumbers = [];
  while (i < array.length) {
    if (array[i] % 2 === 1) {
      array[j] = array[i];
      j++;
    } else {
      evenNumbers.push(array[i]);
    }
    i++;
  }
  let evenArrayIndex = 0;
  while (j < array.length) {
    array[j] = evenNumbers[evenArrayIndex];
    j++;
    evenArrayIndex++;
  }
  return array;
}
console.log(moveAllEvenNumbersToTheEnd([1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15]));
