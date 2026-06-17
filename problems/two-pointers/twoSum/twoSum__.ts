function twoSum(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let sum = nums[left] + nums[right];
    if (sum < target) {
      left++;
    } else if (sum > target) {
      right--;
    } else {
      return [left, right];
    }
  }
  return [-1 , -1];
}
// Input: ((nums = [2, 7, 11, 15]), (target = 9));
