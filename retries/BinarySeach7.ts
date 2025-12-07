function BinarySeachRetry7(array : number[], target : number) {
  let i = 0;
  let j = array.length - 1;
  while (i <= j) {
    let mid = Math.floor((i + j) / 2);
    let midElement = array[mid];
    if (midElement === target) {
      return mid;
    } else if (midElement > target) {
      j = mid - 1;
    } else if(midElement < target) {
      i = mid + 1;
    }
  }
  return -1;
}
console.log(BinarySeachRetry7([9,8,7,6,5,4,3,2,1].sort((a,b) => a - b), 7))
