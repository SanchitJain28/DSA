// function mergeSort(array) {
//   let sortedList = [];
//   for (let i = 0; i < array.length; i++) {
//     sortedList.push([array[i]]);
//   }

//   while (sortedList.length > 1) {
//     let nextRound = [];
//     for (let i = 0; i < sortedList.length; i += 2) {
//       let arr1 = sortedList[i];
//       let arr2 = sortedList[i + 1];
//       if (arr2) {
//         let result = merge(arr1, arr2);
//         nextRound.push(result);
//       } else {
//         nextRound.push(arr1);
//       }
//     }
//     sortedList = nextRound;
//   }

//   //let me merge this mothefukers
//   function merge(arr1, arr2) {
//     let results = [];
//     let i = 0;
//     let j = 0;

//     for (; i < arr1.length && j < arr2.length; ) {
//       //[6, 1, 7, 3, 5, 2, 4]
//       if (arr1[i] > arr2[j]) {
//         results.push(arr2[j]);
//         j++;
//       } else {
//         results.push(arr1[i]);
//         i++;
//       }
//     }

//     for (; i < arr1.length; ) {
//       results.push(arr1[i]);
//       i++;
//     }

//     for (; j < arr2.length; ) {
//       results.push(arr2[j]);
//       j++;
//     }

//     return results;
//   }

//   return sortedList.flat();
// }

// console.log(mergeSort([6, 1, 7, 3, 5, 2, 4]));

function mergeSortAlgorithm(array: number[]) {
  let sortedArray: number[][] = [];
  for (let i = 0; i < array.length; i++) {
    sortedArray.push([array[i]]);
  }

  for (; sortedArray.length > 1; ) {
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
  function merge(arr1: number[], arr2: number[]) {
    console.log(arr1, arr2);
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

    for (; i < arr1.length; ) {
      results.push(arr1[i]);
      i++;
    }

    for (; j < arr2.length; ) {
      results.push(arr2[j]);
      j++;
    }

    return results;
  }
  return sortedArray.flat();
}
console.log(mergeSortAlgorithm([6, 1, 7, 3, 5, 2, 4]));
