function maxSumSubBruteForce(nums: number[], k: number) {
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length - k; i++) {
    let currentSum = 0;
    console.log("SUBARRAY",nums.slice(i,i+k))
    for (let j = i; j < i + k; j++) {
      currentSum += nums[j];
    }
    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
  }
  return maxSum;
}

console.log(maxSumSubBruteForce([1, 9, -1, -2, 7, 3, -1, 2],4));