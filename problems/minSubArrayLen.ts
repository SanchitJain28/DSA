// 🧩 Easy Sliding Window — Minimum Size Subarray Sum
// Statement
// Given an array of positive integers nums and a positive integer target,
// return the minimum length of a contiguous subarray whose
// sum is greater than or equal to target.

// If there is no such subarray, return 0.

// Example 1
// Input:  target = 7, nums = [2,3,1,2,4,3]
// Output: 2
// Explanation: The subarray [4,3] has the minimal length.

// Example 2
// Input: target = 4, nums = [1,4,4]
// Output: 1

// Example 3
// Input: target = 11, nums = [1,1,1,1,1,1,1,1]
// Output: 0

// Constraints
// 1 ≤ nums.length ≤ 10⁵
// 1 ≤ nums[i] ≤ 10⁴
// 1 ≤ target ≤ 10⁹

// Function Signature
function minSubArrayLen(target: number, nums: number[]): number {
  let i = 0;
  let j = 0;
  let minLen = Infinity;
  let sum = nums[0];
  while (j < nums.length) {
    let newMinLength = 0;
    if (sum < target) {
      j++;
      sum += nums[j];
    } else {
      sum -= nums[i];
      i++;
    }
    newMinLength = j - i + 1;
    if (sum >= target) minLen = Math.min(minLen, newMinLength);
  }
  return minLen;
}
function minSubArrayLenCorrected(target : number , nums : number[]) : number {
  let i =0 
  let j = 0 
  let minLen = Infinity
  let sum = 0
  while(j < nums.length){
    sum+=nums[j]
    while(sum>=target){
      minLen = Math.min(minLen , j-i+1)
      sum-=nums[i]
      i++
    }
    j++
  }
  return minLen === Infinity ? 0 : minLen
}


console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]));
