function shipWithinDays(weights: number[], days: number): number {
  let left = Math.max(...weights);
  let right = 0;
  for (let weight of weights) right += weight;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    let reqDays = getTotalDays(weights, mid);
    if (reqDays > days) left = mid + 1;
    else right = mid;
  }
  function getTotalDays(weights: number[], capacity: number): number {
    let totalDays = 1;
    let currentWeight = 0;
    for (let weight of weights) {
      if (currentWeight + weight > capacity) {
        totalDays++;
        currentWeight = 0;
      }
      currentWeight += weight;
    }
    return totalDays;
  }
  return left;
}

console.log(shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5));
