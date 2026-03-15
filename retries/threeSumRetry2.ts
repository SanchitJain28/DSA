// Statement :
// Given an integer array nums, return all the unique triplets
// [nums[i], nums[j], nums[k]] such that:

// i ≠ j ≠ k
// nums[i] + nums[j] + nums[k] = 0

// Example 1
// Input:  nums = [-1,0,1,2,-1,-4]
// Output: [[-1,-1,2],[-1,0,1]]

// Example 2
// Input: nums = [0,1,1]
// Output: []

// Example 3
// Input: nums = [0,0,0]
// Output: [[0,0,0]]

function threeSumBruteForce(nums: number[]) {
  let result: number[][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        let sum = nums[i] + nums[j] + nums[k];
        if (sum === 0) {
          const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = triplet.join(",");
          if (!seen.has(key)) {
            seen.add(key);
            result.push(triplet);
          }
        }
      }
    }
  }
  return result;
}

function threeSumOptimized(nums: number[]) {
  let result: number[][] = [];
  nums.sort((a, b) => a - b);
  let n = nums.length;
  //we have to fix one number
  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let j = i + 1;
    let k = n - 1;
    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k];
      if (sum === 0) {
        result.push([nums[i], nums[j], nums[k]]);
        while (j < k && nums[j] === nums[j + 1]) {
          j++;
        }
        while (j < k && nums[k] === nums[k - 1]) {
          k--;
        }
        j++;
        k--;
      } else if (sum < 0) {
        j++;
      } else {
        k--;
      }
    }
  }
  return result;
}
