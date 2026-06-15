function binarySearch(array: number[], target: number) {
  array.sort((a, b) => a - b);
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

  return -1
}
