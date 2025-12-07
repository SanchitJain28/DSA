function QuickSortRetry6(array: number[], left = 0, right = array.length - 1) {
  let i = left;
  let j = right;
  let pivotElement = array[Math.floor((left + right) / 2)]; 

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

  if (left < j) QuickSortRetry6(array, left, j);
  if (i < right) QuickSortRetry6(array, i, right);

  return array
}

console.log(QuickSortRetry6([9,8,6,5,4,3,2,1]))