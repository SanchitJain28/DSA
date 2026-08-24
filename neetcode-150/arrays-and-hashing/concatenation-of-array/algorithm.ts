function getConcatenation(nums: number[]): number[] {
  const n = nums.length;
  const ans = Array(n * 2).fill(0);
  for (let i = 0; i < nums.length; i++) {
    ans[i] = nums[i];
    ans[i + n] = nums[i];
  }
  return ans;
}
