// Problem — First and Last Position of Element in Sorted Array

// Given a sorted array nums and a target,
// return the starting and ending position of target.

// If target is not found, return [-1, -1].

// 🧪 Example 1
// nums = [5,7,7,8,8,10]
// target = 8

// Output: [3, 4]

// 🧪 Example 2
// nums = [5,7,7,8,8,10]
// target = 6

// Output: [-1, -1]

// 🧪 Example 3
// nums = [1]
// target = 1

// Output: [0, 0]

// 🧠 Important Insight

// You cannot solve this with one binary search.

// You need:

// One search for first occurrence

// One search for last occurrence

// They are slightly different.

// 🎯 Function Signature
function searchRange(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  let first = -1;
  let last = -1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = nums[mid];
    if (midElement === target) {
      right = mid - 1;
      first = mid;
    } else if (midElement > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  left = 0;
  right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = nums[mid];
    if (midElement === target) {
      first = mid;
      left = mid + 1;
    } else if (midElement > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return [first, last];
}
