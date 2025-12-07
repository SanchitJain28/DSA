function QuickSortRetry2(array: number[], left = 0, right = 0) {
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
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    if (left < i) QuickSortRetry2(array, left, i);
    if (right > j) QuickSortRetry2(array, j, right);
  }
}
