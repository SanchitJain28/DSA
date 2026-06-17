// [1,8,6,2,5,4,8,3,7]
// → 49

function maxArea___(array: number[]): number {
  let i = 0;
  let j = array.length - 1;
  let maxArea = 0;
  while (i < j) {
    let height = Math.min(array[i], array[j]);
    let width = j - i;
    let area = height * width;
    if (area > maxArea) {
      maxArea = area;
    }

    if (array[i] < array[j]) {
      i++;
    } else {
      j--;
    }
  }
  return maxArea;
}
