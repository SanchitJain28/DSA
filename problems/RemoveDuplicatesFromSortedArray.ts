// [1,1,2,2,3]
// → [1,2,3]
function RemoveDuplicatesFromSortedArray(array: number[]) {
  let j = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== array[j]) {
      j++;
      array[j] = array[i];
    }
  }
  return j + 1;
}
