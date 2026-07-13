//? brute force solution
function dailyTemperatures(temperatures: number[]): number[] {
  let result: number[] = [];
  let left: number = 0;
  while (left < temperatures.length) {
    let days = 0;
    let right: number = left + 1;
    //? we have found the warm temperature
    while (right < temperatures.length) {
      if (temperatures[right] > temperatures[left]) {
        days = right - left;
        break;
      }
      right++;
    }
    left++;
    result.push(days);
  }
  return result;
}

function dailyTemperatures_(temperatures: number[]): number[] {
  const result = new Array(temperatures.length).fill(0);
  const stack: number[] = []; // Stores indices

  for (let i = 0; i < temperatures.length; i++) {
    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      
      const prevIndex = stack.pop()!;
      result[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }

  return result;
}

console.log(dailyTemperatures_([30, 38, 30, 36, 35, 40, 28]));
// Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.

// Example 1:

// Input: temperatures = [73,74,75,71,69,72,76,73]
// Output: [1,1,4,2,1,1,0,0]
// Example 2:

// Input: temperatures = [30,40,50,60]
// Output: [1,1,1,0]
// Example 3:

// Input: temperatures = [30,60,90]
// Output: [1,1,0]
