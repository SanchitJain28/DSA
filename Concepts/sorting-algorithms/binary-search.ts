// array [1,2,3,5,6,7,8,9,10] // 7
// mid element - > 0 + 7 /2 = 3.5 - > 3
// mid element - > 0 + 8 /2 = 4 - > 4

function BinarySearch(nums: number[], target: number) {
  nums.sort((a, b) => a - b);
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = nums[mid];

    if (midElement < target) {
      left = mid + 1;
    } else if (midElement > target) {
      right = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}


console.log(BinarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 9));
