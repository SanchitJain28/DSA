function bubbleSort(array : number[]) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      let firstElement = array[i];
      let secondElement = array[j];
      if (firstElement > secondElement) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
}

function bubbleSortCorrect(array : number[]){
    for(let i =0 ; i < array.length ; i++){
        
    }
}
console.log(bubbleSort([9, 8, 7, 6, 5, 4, 3, 2, 1]));
