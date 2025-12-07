function QuickSortRetry8(array: number[], left = 0, right = array.length - 1) {
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
  console.log({
    i,
    j,
    left,
    right,
    pivot,
  });
  if (left < j) {
    console.log(`1 : QuickSortRetry8([${array}],${left},${j}) : ${array.slice(left, j + 1)}`);
    QuickSortRetry8(array, left, j);
  }
  if (i < right) {
    console.log(`2 : QuickSortRetry8([${array}],${i},${right}) : ${array.slice(i, right + 1)}`);
    QuickSortRetry8(array, i, right);
  }


  return array;
}
console.log(QuickSortRetry8([6, 3, 2, 1, 9, 5, 7, 8, 15]));
