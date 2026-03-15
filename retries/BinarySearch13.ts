function BinarySearch13(nums: number[], target: number) {
  let i = 0;
  let j = nums.length - 1;

  while (i <= j) {
    let mid = Math.floor((i + j) / 2);
    let midElement = nums[mid];
    if (midElement === target) {
      return mid;
    } else if (midElement > target) {
      j = mid - 1;
    } else {
      i = mid + 1;
    }
  }
  return -1;
}
