let array = [5, 3, 4, 1];

//FOR ASCENDING ORDER
function BubbleSort(arrayParam) {
  let array = arrayParam;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length -i; j++) {
      const element = array[j];
      let adjacentElement = array[j + 1];
      if (element > adjacentElement) {
        let temp = array[j];
        array[j] = array[j + 1];//[3,3,4,1]
        array[j+1] = temp;[3,5,4,1]
      }
    }
  }
  return array;
}

console.log(BubbleSort([5, 3, 4, 1]));


//FOR DESCENDING ORDER
function BubbleSortDesc(arrayParam) {
  let array = arrayParam;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length -i; j++) {
      const element = array[j];
      let adjacentElement = array[j + 1];
      if (element < adjacentElement) {
        let temp = array[j];
        array[j] = array[j + 1];//[3,3,4,1]
        array[j+1] = temp;//[3,5,4,1]
      }
    }
  }
  return array;
}

console.log(BubbleSortDesc([1,4,2,4,3,6,5,6,2,4,5,6,7,8,5,3,2,2,4,5,6]));
