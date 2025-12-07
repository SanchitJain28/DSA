function mergeSortRetry10(array: number[]) {
  let sortedArray: number[][] = [];
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

  function merge(arr1: number[], arr2: number[]) {
    let i = 0;
    let j = 0;
    let result = [];
    while (i < arr1.length && j < arr2.length) {
      if (arr1[i] < arr2[j]) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
      }
    }

    while (i < arr1.length) {
      result.push(arr1[i]);
      i++;
    }

    while (j < arr2.length) {
      result.push(arr2[j]);
      j++;
    }

    return result;
  }

  return sortedArray[0];
}

console.log(
  mergeSortRetry10([
    1, 2, 4, 5, 76, 4, 3, 6, 4, 6, 4, 4, 4, 6, 4, 4, 6, 4, 3, 3, 3, 333, 5, 3,
    5, 4, 5, 4, 6, 4, 4, 6, 4, 4, 5, 4, 4, 5, 4, 4, 5, 3, 3,

    5, 6, 7, 8, 8,

    6, 5, 5, 5, 67, 5, 5, 6, 7, 5, 5, 7, 5, 5, 6, 5, 4,

    3,

    3, 4, 55, 6, 5, 5, 5, 6, 5, 4, 5, 5, 5, 5, 6, 6, 4, 4, 4, 4, 4, 6, 6, 7, 7,
    8, 8, 8, 8, 9, 9,

    78, 7, 6, 5, 5, 4, 4, 3, 3, 23, 2, 2,

    2, 22,

    2, 43, 4,

    55,
  ])
);
