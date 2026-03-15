// 🧩 Find Peak Element
// Given an integer array nums, find a peak element and return its index.
// A peak element is strictly greater than its neighbors.

// You may assume:
// nums[-1] = -∞
// nums[n] = -∞

// Return any peak.

// Time complexity must be O(log n).

// Example 1
// nums = [1,2,3,1]
// Output: 2

// Example 2
// nums = [1,2,1,3,5,6,4]
// Output: 1 or 5

function findPeakElement(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > nums[mid + 1]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left
}
