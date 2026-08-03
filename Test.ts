// function RunTest() {
//   //TEST HERE
//   let testVariable = Array.from({ length: 10 }, (e, index) => index);

import { addTwoNumbers } from "./neetcode-150/linked-list/add-two-numbers/algorithm";
import { sampleLinkedList } from "./neetcode-150/linked-list/intro/algorithm";

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
// const values = new Map([
//       ["I",1],
//       ["V",5],
//       ["X",10],
//       ["L",50],
//       ["C",100],
//       ["D",500],
//       ["M",1000]
//     ])
//     console.log(values)

// let originalArray = [1, 2, 3, 4, 5];
// let anotherArray = originalArray;
// anotherArray[anotherArray.length - 1] = 10;
// console.log("Original Array : ", originalArray);
// console.log("Another Array : ", anotherArray);

// let obj1 = { name: "NAME" };
// let obj2 = obj1;
// obj2.name = "OTHER";
// console.log("Object 1 : ", obj1);
// console.log("Object 2 : ", obj2);
// // obj1.name is also "OTHER" — same object in memory

// obj1 === obj2; // true, same reference

// let obj3 = { name: "NAME" };
// console.log("Object 3 ", obj3);
// obj1 === obj3; // false — different object, even though content is identical

function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  let final: number[] = [];
  for (let num of nums) freq.set(num, (freq.get(num)! ?? 0) + 1);
  let result: number[][] = [];
  for (let [num, f] of freq) result.push([num, f]);
  console.log("Resultant : ", result);
  result.sort((a, b) => b[1] - a[1]);
  console.log("Sorted Result : ", result);
  for (let i = 0; i < k; i++) final.push(result[i][0]);
  return final;
}

console.log(topKFrequent([1, 1, 1, 2, 2, 1, 2, 3], 2));
