function QuickSortRetry(
  array: number[],
  left: number = 0,
  right: number = array.length - 1
) {
  let i = left;
  let j = right;
  let pivotIndex = Math.floor((i + j) / 2);
  let pivot = array[pivotIndex];
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

  if(left < j) QuickSortRetry(array, left, j)
  if(right > i) QuickSortRetry(array, i, right)

  return array
}
console.log(QuickSortRetry([9,5,3,2,4,6,3,4,5,67,8,8,6,5,4,3,2,21,4,6,6,32,2,54,6,3,2,1]))