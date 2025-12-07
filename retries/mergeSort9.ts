function mergeSort(array: number[]) {
  let sortedArray : number[][]= [];
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
    sortedArray = nextRound
  }

  function merge(arr1: number[], arr2: number[]) {
    let i = 0;
    let j = 0;
    let result = [];
    while (i < arr1.length && j < arr2.length) {
      if (arr1[i] > arr2[j]) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
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

  return sortedArray[0]
}

console.log(mergeSort([9,5,3,2,4,6,3,4,5,67,8,8,6,5,4,3,2,21,4,6,6,32,2,54,6,3,2,1]))