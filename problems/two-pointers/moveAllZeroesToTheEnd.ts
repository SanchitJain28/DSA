//array , [0,1,0,3,12]

function moveAllZeroesToTheEndRetry(array: number[]) {
  let i = 0;
  let j = 0;
  while (i < array.length) {
    if (array[i]) {
      array[j] = array[i];
      j++;
    }
    i++;
  }
  while (j < array.length) {
    array[j] = 0;
    j++;
  }

  return array;
}

console.log(moveAllZeroesToTheEndRetry([0, 1, 0, 3, 0, 12, 0, 1, 0, 2, 0]));
