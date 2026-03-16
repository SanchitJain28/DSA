function binarySearch(array: number[], target: number) {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    let midElement = array[mid];
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

function binarySearchFindFirst(array: number[], target: number) {
  let left = 0;
  let right = array.length - 1;
  let result = -1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (array[mid] === target) {
      result = mid;
      right = mid - 1;
    } else if (array[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return result;
}
console.log(binarySearchFindFirst([1, 2, 3, 3, 3, 3, 4, 5, 6], 3));

function binarySearchFindLast(array: number[], target: number) {
  let left = 0;
  let right = array.length - 1;
  let result = -1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (array[mid] === target) {
      result = mid;
      left = mid + 1;
    } else if (array[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return result;
}

console.log(binarySearchFindLast([1, 2, 3, 3, 3, 3, 4, 5, 6], 3))