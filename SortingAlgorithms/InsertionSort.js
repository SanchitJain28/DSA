// [10,3,7,1,5]
function InsertionSort(arrayparam) {
    let array = arrayparam;
    for (let i = 1; i < array.length; i++) {
        console.log("ITERATION", i);
        let key = array[i];
        console.log("KEY", key);
        let j = i - 1;

        // shift elements to the right
        while (j >= 0 && array[j] > key) {
            console.log("SHIFT", array[j], "to position", j + 1);
            array[j + 1] = array[j];
            j--;
        }

        // insert the key in the right spot
        console.log("BEFORE",array)
        array[j + 1] = key;
        console.log("Placed KEY", key, "at position", j + 1);
        console.log("Array now:", array, '\n');
    }
    return array;
}

console.log("FINAL SORTED:", InsertionSort([
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