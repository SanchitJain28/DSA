// function RunTest() {
//   //TEST HERE
//   let testVariable = Array.from({ length: 10 }, (e, index) => index);

//   testVariable.forEach((e) => {
//     console.log(e);
//   });
// }

// RunTest();

// let array = Array.from({ length: 100 }, (_, index) => {
//   return index;
// });
// console.log(array);
// console.log(Array.isArray(array))
// console.log(new Array("a"))
// for(element of array){
//     console.log(element)
// }

// const map = new Map()
// map.set(1,"Sanchit Jain")
// map.set(2, "Sanchez")
// map.set({a:"Sanchit"},"Jain")

// const mapValue1= map.get(1)

// const iterator = map.entries()
// console.log(iterator.next().value)
// for (const element of iterator) {
//     console.log(element[0])
// }

// console.log(mapValue1)
// console.log(map)

// function BubbleSort(array) {
//   //[4,7,1,9,5,3,6]
//   for (let i = 0; i < array.length; i++) {
//     for (let j = 0; j < array.length - i ; j++) {
//       if (array[j] > array[j + 1]) {
//         let temp = array[j];
//         array[j] = array[j + 1]; //[4,1,1.....]
//         array[j + 1] = temp;
//       }
//     }
//   }
//   return array;
// }
// console.time("bubbleSortTime");
// console.log(BubbleSort([9,8,7,6,5,4,3,2,1]));
// console.timeEnd("bubbleSortTime");

// function InsertionSort(array) {
//   for (let i = 1; i < array.length; i++) {
//     let key = array[i];
//     let j = i - 1; //[4,7,1,9,5,3,6]

//     while (j >= 0 && array[j] > key) {
//       array[j + 1] = array[j];
//       j--;
//     }

//     array[j + 1] = key;
//   }
//   return array;
// }
// console.log(InsertionSort([4,7,1,9,5,3,6]))

// for (;;) console.log();

// const items = { name: "ARRAY" };
// console.log(Array.from(items, (e) => e.name));
const values = new Map([
      ["I",1],
      ["V",5],
      ["X",10],
      ["L",50],
      ["C",100],
      ["D",500],
      ["M",1000]
    ])
    console.log(values)