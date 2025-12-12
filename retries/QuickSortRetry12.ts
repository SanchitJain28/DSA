function QuickSortRetry12(array: number[], left = 0, right = array.length - 1) {
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
      [array[i], array[j]] = [array[j], array[i]];
      i++;
      j--;
    }
  }
  if (left < j) QuickSortRetry12(array, left, j);
  if (i < right) QuickSortRetry12(array, i, right);

  return array;
}
console.log(QuickSortRetry12([10,9,8,7,6,5,4,3,2,1]))