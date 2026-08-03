// Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

function topKFrequent(nums: number[], k: number): number[] {
  const map = new Map();
  let result = [];
  for (let i = 0; i < nums.length; i++) {
    if (map.has(nums[i])) {
      map.set(nums[i], map.get(nums[i])! + 1);
    } else {
      map.set(nums[i], 1);
    }
  }
  const sortedArray = [...map.entries()].sort((a, b) => b[1] - a[1]);
  for (let i = 0; i < k; i++) {
    result.push(sortedArray[i][0]);
  }
  return result;
}

topKFrequent([1], 1);
// Example 1:

// Input: nums = [1,1,1,2,2,3], k = 2
// Output: [1,2]

// Example 2:

// Input: nums = [1], k = 1
// Output: [1]

// Example 3:

// Input: nums = [1,2,1,2,1,2,3,1,3,2], k = 2
// Output: [1,2]
