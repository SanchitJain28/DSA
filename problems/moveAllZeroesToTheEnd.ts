//array , [0,1,0,3,12]
function moveAllZeroes(arr : number[]) {
  let i = 0;
  let j = 0;
  for (; i < arr.length; i++) {
    if (arr[i]) {
      arr[j] = arr[i];
      j++;
    }
  }
  for (; j < arr.length; j++) {
    arr[j] = 0;
  }
  return arr;
}

function TwoSum(arr : number[], target : number) {
  let result = [];
  let i = 0;
  let j = arr.length - 1;
  for (; i < j; ) {
    let sum = arr[i] + arr[j];
    if (sum === target) {
      result.push(i);
      result.push(j);
      return result;
    }

    if (sum > target) {
      j--;
    } else {
      i++;
    }
  }
  return false;
}

console.log(TwoSum([2, 7, 11, 15], 26));
console.log(moveAllZeroes([0, 1, 0, 3, 12]));
