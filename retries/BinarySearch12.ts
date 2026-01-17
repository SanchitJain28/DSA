function BinarySearchRetry12(array: number[], target: number) {
  let i = 0;
  let j = array.length - 1;
  let result =-1
  while (i <= j) {
    let mid = Math.floor((i + j) / 2);
    let midElement = array[mid];
    if (midElement === target) {
      result = mid
      i = mid +1
    } else if (midElement > target) {
      j = mid - 1;
    } else {
      i = mid + 1;
    }
  }

  return result
}

console.log(
  BinarySearchRetry12(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 14],
    14
  )
);
