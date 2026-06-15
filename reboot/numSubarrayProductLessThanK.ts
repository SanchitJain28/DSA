// 🟢 Slot 1: The Warm-up (Sliding Window Recall)
// Problem: Subarray Product Less Than K
// (You tackled this right before your break. The sliding logic was solid, 
// but the counting formula at the end was tricky. 
// Let's see if the right - left + 1 logic stuck.)

// Statement
// Given an array of integers nums and an integer k, return the number 
// of contiguous subarrays where the product of all the elements in the 
// subarray is strictly less than k.

// Example 1
// Input: nums = [10, 5, 2, 6], k = 100
// Output: 8

// Example 2
// Input: nums = [1, 2, 3], k = 0
// Output: 0

// Function Signature

// TypeScript
function numSubarrayProductLessThanK(nums: number[], k: number): number {
	if (k <= 1) return 0; 
	let left = 0 
	let right = 0 
	let result = 0 
	let product = 1
	while(right < nums.length){
		product*=nums[right]
		while(product >= k){
			product/=nums[left]
			left++
		}
		result += right -left + 1
		right++
	}
	return result
}
