class Solution____ {

  maxArea(heights: number[]): number {
    let left = 0;
    let right = heights.length - 1;
    let maxArea = 0;
    while (left < right) {
      let height = Math.min(heights[left], heights[right]);
      let width = right - left;
      let area = height * width;
      //? get rhe maxArea
      maxArea = Math.max(area, maxArea);
      //if left height is smaller than right height ,
      // move the left one and vice versa
      if (heights[left] < heights[right]) left++;
      else right--;
    }
    return maxArea;
  }
}

// Container With Most Water
// You may choose any two bars to form a container. Return the maximum amount of water a container can store.

// Example 1:
// Input: height = [1,7,2,5,4,7,3,6]
// Output: 36

// Example 2:
// Input: height = [2,2,2]
// Output: 4

// Constraints:

// 2 <= height.length <= 1000
// 0 <= height[i] <= 1000
