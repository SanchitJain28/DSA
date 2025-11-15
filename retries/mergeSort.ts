function mergeSort(array : number[]) {
  let sortedArray: number[][] = [];
  //DIVIDE
  for (let i = 0; i < array.length; i++) {
    sortedArray.push([array[i]]);
  }

  //lets join
  while (sortedArray.length > 1) {
    let nextRound = [];
    for (let i = 0; i < sortedArray.length; i += 2) {
      let firstArray = sortedArray[i];
      let secondArray = sortedArray[i + 1];
      if (secondArray) {
        let result = merge(firstArray, secondArray);
        nextRound.push(result);
      } else {
        nextRound.push(firstArray);
      }
    }
    sortedArray = nextRound;
  }

  //MERGING
  function merge(arr1 : number[], arr2 : number[]) {
    let results = [];
    let i = 0;
    let j = 0;

    for (; i < arr1.length && j < arr2.length; ) {
      if (arr1[i] > arr2[j]) {
        results.push(arr2[j]);
        j++;
      } else {
        results.push(arr1[i]);
        i++;
      }
    }

    for (; i < arr1.length; i++) {
      results.push(arr1[i]);
    }

    for (; j < arr2.length; j++) {
      results.push(arr2[j]);
    }

    return results;
  }

  return sortedArray[0];
}

console.log(mergeSort([9, 8, 7, 6, 5, 4, 3, 2, 1]));

function InsertionSort(array :number[]) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {array[j + 1] = array[j];j--;}
    array[j+1] = key
  }
  return array
}

console.log(InsertionSort([9,8,7,6,5,4,3,2,11]))