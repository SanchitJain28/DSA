function BinarySearch5(array : number[], target: number) {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = array[mid];
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

console.log(BinarySearch5([1, 2, 3, 4, 5, 6, 7, 8, 9], 9));
