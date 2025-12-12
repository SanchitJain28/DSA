function QuickSortRetry13(array: number[], left = 0, right = array.length - 1) {
  let i = left;
  let j = right;
  let pivot = array[Math.floor((i + j) / 2)];
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
  if (left < j) QuickSortRetry13(array, left, j);
  if (i < right) QuickSortRetry13(array, i, right);
  return array
}

console.log(QuickSortRetry13([-1, 0, 1, 2, -1, -4]));