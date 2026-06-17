function maxArea_____(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;
  while (left < right) {
    let h = Math.min(height[left], height[right]);
    let w = right - left;
    maxArea = Math.max(maxArea, h * w);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxArea;
}
