function SumTarget(array, target) {
  let result = [];
  let i = 0;
  let j = array.length - 1;
  for (; i < j; ) {
    let sum = array[i] + array[j];
    if (sum === target) {
      result.push(i);
      result.push(j);
      return result;
    }
    if (sum < target) i++;
    else j--;
  }
  return false;
}
console.log(SumTarget([2, 7, 11, 15], 17));
