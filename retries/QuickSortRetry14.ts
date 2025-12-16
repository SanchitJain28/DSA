function QuickSortRetry14(array: number[], left = 0, right = array.length - 1) {
  let i = left;
  let j = right;
  const pivot = array[Math.floor((left + right) / 2)];

  while (i <= j) {
    while (array[i] < pivot) i++;
    while (array[j] > pivot) j--;

    if (i <= j) {
      [array[i], array[j]] = [array[j], array[i]];
      i++;
      j--;
    }
  }

  if (left < j) QuickSortRetry14(array, left, j);
  if (i < right) QuickSortRetry14(array, i, right);

  return array;
}
