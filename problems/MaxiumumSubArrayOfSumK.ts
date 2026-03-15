// 🧩 Problem: Maximum Sum Subarray of Size K
// Statement

// Given an array of integers nums and an integer k,
// find the maximum sum of any contiguous subarray of size k.

// Example 1
// Input:  nums = [2, 1, 5, 1, 3, 2], k = 3
// Output: 9
// Explanation: Subarray [5, 1, 3] has the maximum sum.

// Example 2
// Input: nums = [1, 9, -1, -2, 7, 3, -1, 2], k = 4
// Output: 13
// Explanation: Subarray [9, -1, -2, 7] has the maximum sum.

// Constraints

// 1 ≤ k ≤ nums.length

// -10⁴ ≤ nums[i] ≤ 10⁴

// Function Signature
// function maxSumSubarray(nums: number[], k: number): number

function maxSumSubArrayBruteForceMethod(nums: number[], k: number) {
  //calculate all the subarray then store in the maximum variable
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length - k + 1; i++) {
    for (let j = i; j < nums.length && j - i < k; j++) {
      let subarray = nums.slice(i, j + 1);
      let sum = 0;
      for (let s = 0; s < subarray.length; s++) {
        sum += subarray[s];
      }

      if (sum > maxSum) {
        maxSum = sum;
      }
    }
  }
  return maxSum;
}

function maxSumSubArrayBruteForceOptimized(nums: number[], k: number) {
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length - k; i++) {
    let currentSum = 0;
    for (let j = i; j < i + k; j++) {
      currentSum += nums[j];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
  }
  return maxSum;
}

// console.log(maxSumSubArrayBruteForceOptimized([1, 9, -1, -2, 7, 3, -1, 2], 4));

function maxSumSubArray(nums: number[], k: number) {
  let i = 0;
  let j = k - 1;
  let maxSum = -Infinity;
  let sum = 0;
  for (let s = 0; s < k; s++) {
    sum += nums[s];
  }
  while (j < nums.length) {
    sum -= nums[i];
    i++;
    j++;
    sum += nums[j];

    if (sum > maxSum) {
      maxSum = sum;
    }
  }
  return maxSum;
}

function maxSumSubArrayCorrected(nums : number[], k : number) {
  let maxSum = 0 
  let windowSum = 0
  for(let i = 0; i < k; i++){
    windowSum+=nums[i]
  }
  maxSum = windowSum;
  for(let i =k ; i <nums.length ;i++){
    windowSum+=nums[i]
    windowSum-=nums[i-k]
    maxSum= Math.max(maxSum, windowSum);
  }
  return maxSum
}

console.log(maxSumSubArray([1, 9, -1, -2, 7, 3, -1, 2], 4));
