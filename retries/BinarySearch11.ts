function BinarySearch(array: number[], target: number): number {
  let i = 0;
  let j = array.length - 1;
  while (i <= j) {
    let mid = Math.floor((i + j) / 2);
    let midElement = array[mid];
    if (midElement === target) {
      return mid;
    } else if (midElement < target) {
      i = mid + 1;
    } else {
      j = mid - 1;
    }
  }

  return -1;
}

function RecursiveBinarySearch(
  array: number[],
  target: number,
  left = 0,
  right = array.length - 1
) {
  if (left > right) return -1;
  let mid = Math.floor((left + right) / 2);
  let midElement = array[mid];
  if (midElement === target) return mid;
  if (midElement < target) {
    return RecursiveBinarySearch(array, target, mid + 1, right);
  } else {
    return RecursiveBinarySearch(array, target, left, mid - 1);
  }
}

console.log(BinarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 6));
