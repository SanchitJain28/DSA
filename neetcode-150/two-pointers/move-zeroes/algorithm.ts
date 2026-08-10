/**
 Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums: number[]): void {
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right]) {
      nums[left] = nums[right];
      left++;
    }
  }
  while (left < nums.length) {
    nums[left] = 0;
    left++;
  }
}
