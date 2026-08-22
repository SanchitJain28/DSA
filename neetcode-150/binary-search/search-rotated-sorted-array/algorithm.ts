function searchRotated(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] < nums[right]) right = mid;
    else left = mid + 1;
  }
  let minIndex = left;
  if (target >= nums[left] && target <= nums[nums.length - 1]) {
    right = nums.length - 1;
  } else {
    left = 0;
    right = minIndex - 1;
  }

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] < target) left = mid + 1;
    else if (nums[mid] > target) right = mid - 1;
    else return mid;
  }
  return -1;
}
