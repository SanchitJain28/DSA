// const queue : number[] =[1,2,3,4]
// //? Remove first element and returns that element
// const shift = queue.shift()
// //? Add a new element in the front
// const unshift = queue.unshift(2)
// console.log("Updated Queue : \n", queue ,"\n");
// console.log("Shifted (removed) : \n",shift, "\n");
// console.log("Unshifted (added) : \n", unshift, "\n");

import { MaxHeap } from "./neetcode-150/heap/intro/algorithm";

// import { MinHeap } from "./neetcode-150/heap/intro/algorithm";

// function longestConsecutive(nums: number[]): number {
//   nums.sort((a, b) => a - b);
//   let sequenceLength = 0;
//   let maxSequence = 0;
//   for (let i = 0; i < nums.length; i++) {
//     let val = Math.abs(nums[i] - nums[i + 1]);
//     if (!val) continue;
//     if (val === 1) {
//       sequenceLength++;
//     } else {
//       sequenceLength = 0;
//     }
//     maxSequence = Math.max(sequenceLength, maxSequence);
//   }
//   return maxSequence + 1;
// }

// console.log(longestConsecutive([1, 0, 1, 2]));

// function allSubarrays(nums: number[]): number[][] {
//   const result: number[][] = [];
//   for (let i = 0; i < nums.length; i++) {
//     for (let j = i; j < nums.length; j++) {
//       result.push(nums.slice(i, j + 1));
//     }
//   }
//   return result;
// }

// console.log(allSubarrays([1, 2, 3]));

// function subarraySum(nums: number[], k: number): number {
//   let result = 0;
//   for (let i = 0; i < nums.length; i++) {
//     for (let j = i; j < nums.length; j++) {
//       let sum = 0;
//       for (let x = i; x < j + 1; x++) sum += nums[x];
//       if (sum === k) result++;
//     }
//   }
//   return result;
// }

// console.log(subarraySum([1, 1, 1], 2));

// const heap = new MinHeap()
// heap.size()

// function groupAnagrams__(strs: string[]): string[][] {
//   const map = new Map<string, string[]>();
//   for (const str of strs) {
//     const count = new Array(26).fill(0);

//     for (const char of str) count[char.charCodeAt(0) - 97]++;

//     const key = count.join("#");

//     if (!map.has(key)) map.set(key, []);

//     map.get(key)!.push(str);
//   }
//   return [...map.values()];
// }

const maxHeap = new MaxHeap([2, 7, 4, 1, 8, 1]);
console.log(maxHeap);
console.log("Max element : " ,maxHeap.peek())
console.log("Popped element :", maxHeap.poll())
console.log("Updated heap : " , maxHeap)