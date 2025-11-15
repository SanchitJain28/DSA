// function InsertionSort(array) {
//   for (let i = 0; i < array.length; i++) {
//     let key = array[i],
//       j = i - 1;
//     for (; array[j] > key && j >= 0; j--) {
//       array[j + 1] = array[j];
//     }
//     array[j + 1] = key;
//   }
//   return array;
// }

// function BubbleSort(array) {
//   for (let i = 0; i < array.length; i++) {
//     for (let j = 0; j < array.length - i; j++) {
//       let temp = array[j]; //7
//       if (array[j] > array[j + 1]) {
//         array[j] = array[j + 1];
//         array[j + 1] = temp;
//       }
//     }
//   }
//   return array;
// }
// console.log(BubbleSort([7, 6, 5, 4, 3, 2, 1]));

// function mergeSort(array) {
//   let sortedArray = [];
//   for (let i = 0; i < array.length; i++) {
//     sortedArray.push([array[i]]);
//   }
//   while (sortedArray.length > 1) {
//     let newSet = [];
//     for (let i = 0; i < sortedArray.length; i += 2) {
//       let arr1 = sortedArray[i];
//       let arr2 = sortedArray[i + 1];
//       console.log(arr1, arr2);
//       if (arr2) {
//         let result = merge(arr1, arr2);
//         newSet.push(result);
//       } else {
//         newSet.push(arr1)
//       }
//     }
//     sortedArray = newSet;
//   }

//   //lets make the merging fucntion
//   function merge(arr1, arr2) {
//     let i = 0;
//     let j = 0;
//     let result = [];
//     for (; i < arr1.length && j < arr2.length; ) {
//       if (arr1[i] > arr2[j]) {
//         result.push(arr2[j]);
//         j++;
//       } else {
//         result.push(arr1[i]);
//         i++;
//       }
//     }

//     //PUSH THE RAMING ELEMENTS
//     for (; i < arr1.length; i++) {
//       result.push(arr1[i]);
//     }

//     for (; j < arr2.length; j++) {
//       result.push(arr2[j]);
//     }

//     return result
//   }

//   return sortedArray.flat();
// }
// console.log(mergeSort([7, 6, 5, 4, 3, 2, 1]));

// function InsertionSort(array) {
//   for (let i = 1; i < array.length; i++) {
//     let key = array[i];
//     let j = i - 1;
//     for (; array[j] > key && j >= 0; ) {
//       array[j + 1] = array[j];
//       j--;
//     }
//     array[j + 1] = key;
//   }
//   return array;
// }
// console.log(InsertionSort([7, 6, 5, 4, 3, 2, 1]));
