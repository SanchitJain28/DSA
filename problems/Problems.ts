//ZIGZAG
// function zigZagProblem() {
//   let array = Array.from(
//     { length: 10 },
//     (e, index) => `I am sanchit jain ${index + 1}`
//   );
//   console.log(array);
// }
// zigZagProblem();

function MaxNumber(numArr : number[]) {
  let maxNumber = 0;
  for (let i = 0; i < numArr.length; i++) {
    if (numArr[i] > maxNumber) {
      maxNumber = numArr[i];
    }
  }
  return maxNumber;
}

console.log(MaxNumber([1, 2, 3, 85, 19, 10, 9, 8, -5, -999, 99999999]));

//CONATINER WITH THE MOST WATER - FIRST
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height : number[]) {
  let right = height.length - 1; //8
  let maxVolume = 0; //0
  for (let i = 0; i < height.length; i++) {
    let volOfCon = 0; //0 ,
    for (let j = i; j < right; j++) {
      //j =0 , j=1
      let startingPoint = height[j]; //0 -> 1 ,1 -> 8
      let endingPoint = height[right]; //8 -> 7 , 8 -> 7
      let lengthOfContainer = right - j; //8-0-1=7 , 8 - 1 -1 =6
      if (startingPoint < endingPoint) {
        //1 < 7 -> TRUE , 8 < 7 , FALSE
        volOfCon = startingPoint * lengthOfContainer; //1 * 7 = 7
      } else {
        // FALSE,  7 * 6 =42
        volOfCon = endingPoint * lengthOfContainer;
      }
      // 7 >0 , TRUE, 42 > 7 , TRUE
      if (volOfCon > maxVolume) {
        maxVolume = volOfCon; // 7 , 42
      }
    }
    right--; //8 - 1 = 7,7
  }
  return maxVolume;
};

//through two pointer

function maxHeight(height : number[]) {
  let maxArea = 0;
  for (let left = 0, right = height.length - 1; left < right; ) {
    let h = Math.min(height[left], height[right]);
    let w = right - left;
    let area = h * w;
    if (area > maxArea) {
      maxArea = area;
    }

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}
