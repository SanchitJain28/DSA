// 🧩 Max Consecutive Ones III
// 📘 Problem Statement

// You are given a binary array nums (containing only 0s and 1s) and an integer k.
// You may flip at most k zeros to ones.
// Return the maximum number of consecutive 1’s in the array after performing at most k flips.

// 🧪 Example 1
// Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
// Output: 6
// Explanation:
// Flip two zeros → longest consecutive 1s becomes 6

// 🧪 Example 2
// Input: nums = [0,0,1,1,1,0,0], k = 0
// Output: 3

// 🧪 Example 3
// Input: nums = [1,1,1,1], k = 1
// Output: 4

// 📌 Constraints

// 1 ≤ nums.length ≤ 10^5

// nums[i] is either 0 or 1

// 0 ≤ k ≤ nums.length

// 🧠 Function Signature
function longestOnes(nums: number[], k: number): number {
  let left = 0;
  let right = 0;
  let maxLen = 0;
  let freq = 0;
  while (right < nums.length) {
    if (!nums[right]) {
      freq++;
    }
    while (freq > k) {
      if (!nums[left]) {
        freq--;
      }
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
    right++;
  }
  return maxLen;
}

console.log(longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2));
