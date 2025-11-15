function insertionSort(array : number[]) {
  //[9,8,7,6,5,4,3,2,1]
  for (let i = 1; i < array.length; i++) {
    let key = array[i];

    let j = i -1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = key;
  }
  return array
}

console.log(insertionSort([9,8,7,6,5,4,3,2,1]))
