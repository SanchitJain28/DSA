function BubbleSortRetry2(array: number[]) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i; j++) {
      if (array[j] > array[j + 1]) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}
console.log(BubbleSortRetry2([1,4,4,2,4,1,1,4,5,6,8,6,5,87,0,7,6,5,6,8,5,4,3,5,7,4,3,6,7,3,2,1,5,6,8,3,3,6,7,4,4,56,5,5,7,4,3,6,7,8,5,4,7,6,5,5,7,4,3,2,2,4,5,6,7,8,9,6,65,5,4,4,3,3,4,5,6,67,7,7,6,5,4,4,3,3,3,5,6,7,8,9,0,8,7,7,6,5,45,4,3,3,2,2,2,4,4,5,6,6,7,7,5,5,5,5,76,5,4,4,4,4,4,4,4,4,6,5,3,3,3,5,6,7,4,3,4,6]));
