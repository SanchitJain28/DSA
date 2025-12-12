function QuickSortRetry11(array: number[], left = 0, right = array.length - 1) {
  let i = left;
  let j = right;
  let pivot = array[Math.floor((left + right) / 2)];
  while (i <= j) {
    while (array[i] < pivot) {
      i++;
    }
    while (array[j] > pivot) {
      j--;
    }
    if (i <= j) {
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp
      i++;
      j--;
    }
  }
  if (left < j) QuickSortRetry11(array, left, j);
  if (right > i) QuickSortRetry11(array, i, right);
  return array;
}

console.log(QuickSortRetry11([9, 8, 7, 6, 5, 4, 3, 32, 1]));
