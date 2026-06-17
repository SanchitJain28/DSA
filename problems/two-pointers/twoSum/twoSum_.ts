// numbers = [2,7,11,15], target = 9
// → [1,2]

function twoSum(array: number[], target: number) {
  let i = 0;
  let j = array.length - 1;
  while (i < j) {
    let sum = array[i] + array[j];
    if (sum === target) {
      return [i, j];
    } else if (sum > target) {
      j--;
    } else {
      i++;
    }
  }
  return [-1, -1]
}
