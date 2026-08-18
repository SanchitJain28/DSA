function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let maxSequence = 0;

  for (const num of set) {
    if (!set.has(num - 1)) {
      let current = num;
      let length = 1;
      while (set.has(current + 1)) {
        current++;
        length++;
      }
      maxSequence = Math.max(maxSequence, length);
    }
  }

  return maxSequence;
}

console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));
// Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.

// You must write an algorithm that runs in O(n) time.

// Example 1:
// Input: nums = [100,4,200,1,3,2]
// Output: 4

// Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.

// Example 2:
// Input: nums = [0,3,7,2,5,8,4,6,0,1]
// Output: 9

// Example 3:
// Input: nums = [1,0,1,2]
// Output: 3
