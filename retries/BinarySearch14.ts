function BinarySearch14(nums: number[], target: number) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = nums[mid];
    if (midElement === target) {
      return mid;
    } else if (midElement > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return -1;
}
