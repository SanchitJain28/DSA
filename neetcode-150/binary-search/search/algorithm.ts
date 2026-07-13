class Solution_______ {
  search(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (nums[mid] < target) {
        left = mid + 1;
      } else if (nums[mid] > target) {
        right = mid - 1;
      } else {
        return mid;
      }
    }
    return -1;
  }
}

// You are given an array of distinct integers nums, sorted in ascending order, and an integer target.

// Implement a function to search for target within nums. If it exists, then return its index, otherwise, return -1.

// Example 1:

// Input: nums = [-1,0,2,4,6,8], target = 4

// Output: 3
// Example 2:

// Input: nums = [-1,0,2,4,6,8], target = 3

// Output: -1
// Constraints:
