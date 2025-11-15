function mergeSort4(arr: number[]) {
  let sortedArray: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    sortedArray.push([arr[i]]);
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

  function merge(arr1: number[], arr2: number[]) {
    let i = 0;
    let j = 0;
    let result = [];
    for (; i < arr1.length && j < arr2.length; ) {
      if (arr1[i] < arr2[j]) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
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
console.log(mergeSort4([9, 8, 7, 6, 5, 4, 3, 2, 1]));
