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

class Solution_______ {
  /**
   * @param {number[]} temperatures
   * @return {number[]}
   */
  dailyTemperatures(temperatures: number[]): number[] {}
}

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
