//[1, -2, 3, -4, 5]
//[-2, -4, 1, 3, 5]

function moveAllNegativesToTheFront(array: number[]) {
  let j = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] < 0) {
      let temp = array[i];
      for (let k = i; k > j; k--) {
        array[k] = array[k - 1];
      }
      array[j]=temp 
      j++
    }
  }
  return array;
}
