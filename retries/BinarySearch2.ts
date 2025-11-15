function BinarySearch3(array : number[], target : number) {
  //[1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9]
  let left = 0;
  let right = array.length - 1;
  let result = -1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = array[mid];
    if (midElement < target) {
      left = mid + 1;
    } else if (midElement > target) {
      right = mid - 1;
    } else {
      result = mid;
      right = mid - 1;
    }
  }
  return result;
}

console.log(BinarySearch3([1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9], 5));
