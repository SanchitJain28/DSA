function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let right = 0;
  let minLength = Infinity;
  let sum = 0;
  while (right < nums.length) {
    sum += nums[right];
    while (sum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      sum -= nums[left];
      left++;
    }
    right++;
  }
  return minLength === Infinity ? 0 : minLength;
}
