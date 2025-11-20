function quickSort( //[15, 3, 2, 1, 9, 5, 7, 8, 6]
  array: number[],
  left: number = 0,
  right: number = array.length - 1
) {
  let i = left;
  let j = right;
  const pivotIndex = Math.floor((left + right) / 2);
  const pivot = array[pivotIndex];

  while (array[i] < pivot) {
    i++;
  }

  while (array[j] > pivot) {
    j--;
  }

  if(array[i]> array[j]){
    
  }
}
