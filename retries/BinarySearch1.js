function BinarySearch(nums, target) {
  //[1,2,3,4,6,7,8,9] , 7
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
console.log(BinarySearch([1, 2, 3, 4, 6, 7, 8, 9], 9));
