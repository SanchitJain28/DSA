// Input: nums = [1, 9, -1, -2, 7, 3, -1, 2], k = 4

function makeAllTheSubArrays(array: number[]) {
  let subArrays = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = i; j < array.length; j++) {
      let subarray = array.slice(i, j+1);
      subArrays.push(subarray);
    }
  }
  return subArrays;
}

console.log(makeAllTheSubArrays([1, 9, -1, -2, 7, 3, -1, 2]));