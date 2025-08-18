function InsertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i]; //5
    let j = i - 1; //10>5 ,,[10,5]->[10,10]
    for (; array[j] > key && j >= 0; j--) {
      array[j + 1] = array[j];
    }
    array[j + 1] = key; ///[5,10]
  }
  return array;
}

console.log(InsertionSort([1, 5, 6, 7, 8, 1, 2, 4]));
