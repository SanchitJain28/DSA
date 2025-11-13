function containerWithMostWater(height) {
  let maxArea = 0;
  let left = 0;
  let right = height.length - 1;
  while (i < j) {
    let h = Math.min(height[i],height[j])
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
