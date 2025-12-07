function QuickSortRetry4(array: number[], left = 0, right = array.length - 1) {
  let i = left;
  let j = right;
  let pivot = Math.floor((i + j) / 2);
  let pivotElement = array[pivot];
  while (i <= j) {
    while (array[i] < pivotElement) {
      i++;
    }

    while (array[j] > pivotElement) {
      j--;
    }

    if (i <= j) {
      [array[i], array[j]] = [array[j], array[i]];
      i++;
      j--;
    }
  }

  if (left < i) QuickSort(array, left , i);
  if (right > j) QuickSort(array, j ,right);
}
