// 1. Two Pointers
// Think: "Two people walking on the same path but maybe at different speeds/directions".

// Concept
// You have two indexes (pointers) that move through an array/string to solve problems in O(n) instead of O(n²).
// The pointers can:

// Move toward each other (common in sorting or pair sum problems)

// Move in the same direction (common in merging or traversal)

// Example: Check if array has two numbers that sum to target (Sorted array)

function hasPairWithSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return true;
    if (sum < target) left++; // Need bigger sum
    else right--; // Need smaller sum
  }

  return false;
}

console.log(hasPairWithSum([1, 2, 4, 5, 7], 9)); // true

// 2. Sliding Window
// Think: "A window sliding across an array/string keeping track of what's inside it".

// Concept
// You maintain a range (start and end indexes) that represents your "window" of consideration.
// You expand or shrink the window to meet certain conditions (max sum, substring length, etc.).

Array: [1, 4, 2, 10, 23, 3, 1, 0, 20];
k = 4; //→ we’re looking for the largest sum of 4 consecutive number

// [1, 4, 2, 10] 23  3   1   0   20
//  ↑           ↑
// windowSum = 1 + 4 + 2 + 10 = 17
// maxSum = 17

//  1 [4, 2, 10, 23] 3   1   0   20
//    ↑            ↑
// windowSum = 17 - 1 + 23 = 39
// maxSum = 39

//  1   4 [2, 10, 23, 3] 1   0   20
//      ↑              ↑
// windowSum = 39 - 4 + 3 = 38
// maxSum = 39 (unchanged)

//  1   4   2 [10, 23, 3, 1] 0   20
//          ↑              ↑
// windowSum = 38 - 2 + 1 = 37
// maxSum = 39

function maxSubarraySum(nums, k) {
  let windowSum = 0;
  let maxSum = 0;

  // First window
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  maxSum = windowSum;

  // Slide window
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]; // add next, remove first
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

console.log(maxSubarraySum([1, 4, 2, 10, 23, 3, 1, 0, 20], 4)); // 39

function hasPairWithSum(array, target) {
  let left = 0;
  let right = array.length - 1;
  while (left < right) {
    let sum = array[left] + array[right];
    if (sum === target) return true;

    if (sum < target) left++;
    else right--;
  }
  return false;
}
