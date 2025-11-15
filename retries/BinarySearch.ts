//[1,2,3,4,5,6,7,8,9],4
function BinarySearch1(array : number[], target : number) {

  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midElement = array[mid]
    if(midElement === target){
        return mid
    }else if(midElement > target){
        right = mid - 1
    }else {
        left = mid +1 
    }
  }

  return -1 
}
console.log(BinarySearch1([1, 2, 3, 4, 5, 6, 7, 8, 9], 9));