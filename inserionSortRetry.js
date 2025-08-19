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

function BubbleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i; j++) {
      let temp = array[j]; //7
      if (array[j] > array[j + 1]) {
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}
console.log(BubbleSort([7, 6, 5, 4, 3, 2, 1]));
