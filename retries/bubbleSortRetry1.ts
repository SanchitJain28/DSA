//let array = [9,8,7,6,5,4,3,2,1]

function bubbleSortRetry1(array: number[]) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i- 1; j++) {
      if (array[j] > array[j + 1]) {
        let temp = array[j + 1];
        array[j + 1] = array[j];
        array[j] = temp;
      }
    }
  }
  return array
}
console.log(bubbleSortRetry1([9,8,7,6,5,4,3,2,1]))