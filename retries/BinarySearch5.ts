function BinarySearchRetry5(nums: number[], target: number) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = nums[mid];
    if (midElement > target) {
      right = mid - 1;
    } else if (midElement < target) {
      left = mid + 1;
    } else {
      return mid;
    }
  }
  return -1;
}

console.log(BinarySearchRetry5([1, 2, 3, 4, 5], 5));
