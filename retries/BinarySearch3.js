function BinarySearch(nums, target) {
  //[1,2,3,5,6,7,8,9] ,9
  nums.sort((a, b) => a - b);
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2); //3
    let midElement = nums[mid]; //5
    if (midElement > target) {
    } else if (midElement < target) {
      //5 < 9
      left = mid + 1;
    }
  }
}
