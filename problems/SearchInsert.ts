// 🧩 Problem — Search Insert Position

// Given a sorted array of distinct integers nums and a target,
// return the index if the target is found.

// If not, return the index where it would be inserted in order.

// You must write it in O(log n) time.

// 🧪 Example 1
// nums = [1,3,5,6]
// target = 5

// Output: 2

// 🧪 Example 2
// nums = [1,3,5,6]
// target = 2

// Output: 1

// (2 would go between 1 and 3)

// 🧪 Example 3
// nums = [1,3,5,6]
// target = 7

// Output: 4

// (7 would go at the end)

// 🧪 Example 4
// nums = [1,3,5,6]
// target = 0

// Output: 0

// (0 would go at the beginning)

// That’s the trick.

// 🎯 Function Signature
function searchInsert(nums: number[], target: number): number {
  if(nums[0] > target) return 0
  let left = 0;
  let right = nums.length - 1;
  let result = -1 
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = nums[mid];
    if (midElement === target) {
      return result
    } else if (midElement > target) {
      right = mid - 1;
      result = right
    } else {
      left = mid + 1;
      result = left
    }
  }
  return result
}
