function mergeSort(array) {
  let sortedArray = [];
  for (let i = 0; i < array.length; i++) {
    sortedArray.push([array[i]]);
  }

  while (sortedArray.length > 1) {
    let nextRound = [];
    for (let i = 0; i < sortedArray.length; i += 2) {
      let arr1 = sortedArray[i];
      let arr2 = sortedArray[i + 1];
      if (arr2) {
        let result = merge(arr1, arr2);
        nextRound.push(result);
      } else {
        nextRound.push(arr1);
      }
    }
    sortedArray = nextRound;
  }

  function merge(arr1, arr2) {
    let i = 0;
    let j = 0;
    let result = [];
    for (; i < arr1.length && j < arr2.length; ) {
      if (arr1[i] > arr2[j]) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }

    for (; i < arr1.length; i++) {
      result.push(arr1[i]);
    }

    for (; j < arr2.length; j++) {
      result.push(arr2[j]);
    }

    return result;
  }

  return sortedArray[0];
}

console.log(mergeSort([9, 8, 7, 6, 5, 4, 3, 2, 1]));
