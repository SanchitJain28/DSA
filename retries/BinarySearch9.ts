function BinarySearchRetry9(array: number[], target: number) {
  let i = 0;
  let j = array.length - 1;
  let result = -1
  while (i <= j) {
    let mid = Math.floor((i + j) / 2);
    let midElement = array[mid];
    if (midElement === target) {
      result = mid 
      j = mid -1
    } else if (midElement > target) {
      j = mid - 1;
    } else if (midElement < target) {
      i = mid + 1;
    }
  }
  return result;
}

console.log(BinarySearchRetry9([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,3,4,5,6,7,8,9],1))