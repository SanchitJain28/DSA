// 🟢 Slot 1: The Warm-up (Two Pointers Recall)
// Problem: 3Sum

// Statement
// Given an integer array nums, return all the unique triplets
// [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k,
// and nums[i] + nums[j] + nums[k] == 0.

// Notice that the solution set must not contain duplicate triplets.

// Example 1
// Input: nums = [-1,0,1,2,-1,-4]
// Output: [[-1,-1,2],[-1,0,1]]
// Explanation:
// nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
// nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
// nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
// The distinct triplets are [-1,0,1] and [-1,-1,2].

// Example 2
// Input: nums = [0,1,1]
// Output: []
// Explanation: The only possible triplet does not sum up to 0.

// Example 3
// Input: nums = [0,0,0]
// Output: [[0,0,0]]

// Constraints

// 3 <= nums.length <= 3000

// -10^5 <= nums[i] <= 10^5

// Function Signature

// TypeScript
function threeSum(nums: number[]): number[][] {
  //sort the array
  let result: number[][] = [];
  if (nums.length < 3) return result;
  nums.sort((a, b) => a - b);
  let n = nums.length;
  let target = 0;
  for (let i = 0; i < n - 2; i++) {
    //? Early return 
    if (nums[i] > target) break;

    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let j = i + 1;
    let k = n - 1;
    while (j < k) {
      let sum = nums[i] + nums[j] + nums[k];
      if (sum === target) {
        //? no need to sort as this is already sorted 
        result.push([nums[i], nums[j], nums[k]]);
        //! I am still confused here, how the fuck this removes duplicates 
        //! only this part is hard for me , else is easy in this
        while (j < k && nums[j] == nums[j + 1]) {
          j++;
        }
        while (j < k && nums[k] == nums[k - 1]) {
          k--;
        }
        j++;
        k--;
      } else if (sum > target) {
        k--;
      } else {
        j++;
      }
    }
  }
  return result;
}
