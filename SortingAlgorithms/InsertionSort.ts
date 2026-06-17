// [10,3,7,1,5]
function InsertionSort_(arrayparam: number[]) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
  }
  return array;
}

console.log("FINAL SORTED:", InsertionSort_([
  99, 23, 45, 12, 67, 5, 34, 88, 1, 76, 
  54, 90, 32, 18, 11, 3, 2, 77, 49, 100,
  87, 65, 29, 41, 9, 6, 7, 19, 20, 15
]));

// function InsertionSort(array){
//     for(let i=1 ; i< array.length;i++){
//         let key = array[i]
//         let j = i -1 
//         while(j>=0 && array[j] > key){
//             array[j+1]=array[j]
//             j--
//         }

//         array[j+1]=key
//     }
//     return array
// }