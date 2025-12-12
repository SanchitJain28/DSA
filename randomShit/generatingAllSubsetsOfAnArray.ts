//[9,7,6,5,4,3,2,1]

function generateAllSubsetsOfAnArray(array: number[]) {
  const subsetsOfArray: number[][] = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length + 1; j++) {
      let subarray = array.slice(i, j);
      subsetsOfArray.push(subarray);
    }
  }
  return subsetsOfArray;
}
console.log(generateAllSubsetsOfAnArray([9, 7, 6, 5, 4, 3, 2, 1]));
console.log(generateAllSubsetsOfAnArray([9, 7, 6, 5, 4, 3, 2, 1]).length);
function generateAllSubsetsOfAnArray1(array: number[]) {
  const subsetsOfArray: number[][] = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i; j++) {
      let subarray = array.slice(j, j + 1 + i);
      subsetsOfArray.push(subarray);
    }
  }
  return subsetsOfArray;
}
console.log(
  generateAllSubsetsOfAnArray1([
    9, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 90,
  ])
);
console.log(
  generateAllSubsetsOfAnArray1([
    9, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 90,
  ]).length
);
