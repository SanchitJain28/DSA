// 🧩 Next Medium Problem
// 🔥 Subarray Product Less Than K
// Statement

// Given an array of positive integers nums and an integer k,
// return the number of contiguous subarrays where the product of
// all elements is strictly less than k.

// Example 1
// Input: nums = [10, 5, 2, 6], k = 100
// Output: 8

// Explanation:
// Subarrays:
// [10]
// [5]
// [2]
// [6]
// [10,5]
// [5,2]
// [2,6]
// [5,2,6]

// Example 2
// Input: nums = [1,2,3], k = 0
// Output: 0

// Constraints

// 1 ≤ nums.length ≤ 3 * 10⁴

// 1 ≤ nums[i] ≤ 1000

// 0 ≤ k ≤ 10⁶

// Function Signature
// Input: nums = [10, 5, 2, 6],
function numSubarrayProductLessThanK(nums: number[], k: number): number {
  if (k <= 1) return 0;
  let left = 0;
  let right = 0;
  let product = 1;
  let result = 0;
  while (right < nums.length) {
    product *= nums[right];
    while (product >= k) {
      product /= nums[left];
      left++;
    }
    if (product < k) {
      result += right - left + 1;
    }
    right++;
  }
  return result;
}
console.log(numSubarrayProductLessThanK([10, 5, 2, 6], 100));
