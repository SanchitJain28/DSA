function threeSumRetry3(nums: number[]) {
  let result: number[][] = [];
  nums.sort((a, b) => a - b);
  let n = nums.length;

  for (let i = 0; i < n - 2; i++) {
  	if(i > 0 && nums[i]===nums[i-1]) continue;
    let j = i + 1;
    let k = n - 1;
    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k];
      if (sum === 0) {
        result.push([nums[i], nums[j], nums[k]]);
        j++;
        k--;
      } else if (sum > 0) {
        k--;
      } else {
        j++;
      }
    }
  }
  return result;
}
