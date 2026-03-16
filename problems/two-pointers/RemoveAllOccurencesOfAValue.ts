// nums = [3,2,2,3], val = 3
// → [2,2]
function RemoveAllOccurencesOfAValue(array: number[], value: number) {
  let j = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== value) {
      array[j] = array[i]; // [array[j]] = [array[i]]
      j++;
    }
  }
  console.log(array);
  return j;
}

console.log(RemoveAllOccurencesOfAValue([3, 2, 2, 3], 3));
