// var threeSum = function (nums) {
//   for (let i = 0; i < nums.length; i++) {
//     for (let j = i + 1; j < nums.length; j++) {
//       for (let k = j + 1; k < nums.length; k++) {
//         if (nums[i] + nums[j] + nums[k]) {
//           const array = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
//         }
//       }
//     }
//   }
// };

// const array = [9, 8, 7, 6, 4, 341, 21, 41, 2];
// array.sort((a, b) => a - b);
// console.log(array);

//THIS THING NOT WORK LIKE THAT
// const nestedArray = [
//   [1, 8, 9],
//   [7, 0, 5],
// ];
// nestedArray.sort((a, b) => a - b);
// console.log(nestedArray);

//[-1,0,1,2,-1,-4]
function threeSum(nums) {
  let triplets = [];
  nums.sort((a, b) => a - b);
  let n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    const seen = new Set();

    for (let j = i + 1; j < n; j++) {
      //1, 1<6;1++ /2 , 2<6, 2++
      const compliment = -(nums[i] + nums[j]); //-(-1 + 0) = 1 | -(-1 +1)= 0
      if (seen.has(compliment)) {
        triplets.push([nums[i], compliment, nums[j]].sort((a, b) => a - b)); //-1,0,1
      }
      seen.add(nums[j]); //0
    }
  }

  return triplets;
}
console.log(threeSum([-1, 0, 1, 2, -1, -4]));

const threeSumCopy = function (nums) {
  const results = [];

  if (nums.length < 3) return results;

  nums = nums.sort((a, b) => a - b);
  let target = 0;

  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > target) break;

    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let j = i + 1;

    let k = nums.length - 1;

    while (j < k) {
      let sum = nums[i] + nums[j] + nums[k];
      if (sum === target) {
        results.push([nums[i], nums[j], nums[k]]);

        while (nums[j] === nums[j + 1]) j++;
        while (nums[k] === nums[k - 1]) k--;

        j++;
        k--;
      } else if (sum < target) {
        j++;
      } else {
        k--;
      }
    }
  }

  return results;
};

const threeSumCopyBMe = (nums) => {
  const results = [];
  if (nums.length < 3) return results;

  nums.sort((a, b) => a - b);
  let n = nums.length;
  let target = 0;

  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > target) break;

    if (i > 0 && nums[i] == nums[i - 1]) continue;
    let j = i + 1;
    let k = n - 1;

    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k];
      if (sum === target) {
        results.push([nums[i], nums[j], nums[k]]);
        while (nums[j] === nums[j + 1]) j++;
        while (nums[k] === nums[k - 1]) k--;

        j++;
        k--;
      } else if (sum < target) {
        j++;
      } else {
        k--;
      }
    }
  }

  return results;
};

console.log(threeSumCopyBMe([-1, 0, 1, 2, -1, -4]));
