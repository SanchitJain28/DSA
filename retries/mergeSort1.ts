function mergeSort1(array : number[]) {
  //[9,8,7,6,5,4,3,2]
  let sortedArray: number[] []= [];
  //DIVIDE
  for (let i = 0; i < array.length; i++) {
    sortedArray.push([array[i]]);
  }

  while (sortedArray.length > 1) {
    let nextRound = [];
    for (let i = 0; i < sortedArray.length; i += 2) {
      let arr1 = sortedArray[i];
      let arr2 = sortedArray[i+1]
      if (arr2) {
        let arr2 = sortedArray[i + 1];
        let result = merge(arr1, arr2);
        nextRound.push(result);
      } else {
        nextRound.push(arr1);
      }
    }
    sortedArray = nextRound;
  }

  function merge(arr1: number[], arr2: number[]) {
    let result = [];
    let i = 0;
    let j = 0;
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
console.log(mergeSort1([9,8,7,6,5,4,3,2,1]))