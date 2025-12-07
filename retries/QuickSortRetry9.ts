function QuickSort9Retry(array: number[], left = 0, right = array.length - 1) {
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
  if (left < j) QuickSort9Retry(array, left, j);
  if (i< right) QuickSort9Retry(array,i ,right);
  
  return array
}
console.log(QuickSort9Retry([1,5,6,3,3,5,6,3,3,6,6,3,6,3,5,56,3,3,5,6,7,8,8,5,4,7,7,5]))