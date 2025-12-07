function ContainerWithMostWater (height : number[]) {
  let i = 0;
  let j = height.length - 1;
  let area = 0;
  while (i < j) {
    let h = Math.min(height[i], height[j]);
    let w = j - i;
    let containerArea = h * w;

    if (containerArea > area) {
      area = containerArea;
    }

    if (height[i] < height[j]) {
      i++;
    } else {
      j--;
    }
  }

  return area;
};
