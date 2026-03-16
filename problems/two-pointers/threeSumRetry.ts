//[-1,0,1,2,-1,-4]
//[-4, -1, -1, 0, 1, 2];
const threeSumRetry = function (nums: number[]) {
  let triplets: number[][] = [];

  if (nums.length < 3) return triplets;
  nums.sort((a, b) => a - b);

  let n = nums.length;
  let target = 0;

  for (let i = 0; i < n -2 ; i++) {
    let j = i + 1;
    let k = n - 1;
    while (j < k) {
      let sumNeeded = -(nums[i] + nums[j]);
      let set = new Set();
      if (set.has(sumNeeded)) {
        triplets.push([nums[i], nums[j], nums[k]].sort((a, b) => a - b));
      }
      set.add(nums[j]);
      j++;
    }
  }

  return triplets;
};
