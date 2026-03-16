function containerWithMostWater(height : number[]) {
  let maxArea = 0;
  let left = 0;
  let right = height.length - 1;
  while (left < right) {
    let h = Math.min(height[left],height[right])
    let w = right - left 
    let area = h * w
    if(area > maxArea){
        maxArea = area
    }

    if(height[left] > height[right]){
      right--
    }else {
      left++ 
    }
  }

  return maxArea
}
