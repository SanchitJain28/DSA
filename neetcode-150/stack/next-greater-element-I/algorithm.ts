function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const nextGreater = new Map<number, number>();
  const stack: number[] = [];

  console.log("Initializing", { nextGreater, stack });

  for (const num of nums2) {
    console.log("Number : ", num);
    console.log("Stack Length : ", stack.length);
    console.log(
      `stack[${stack.length - 1}] i.e ${stack[stack.length - 1]} < ${num} : `,
      stack[stack.length - 1] < num,
    );
    //? if stack is not empty , means checking for the next element , and the last element of the stack
    while (stack.length && stack[stack.length - 1] < num) {
      const poppedValue = stack.pop()!;
      console.log("Popped Value : " , poppedValue)
      nextGreater.set(poppedValue, num);
      console.log("Updated Map" , nextGreater)
      console.log("*****\n")
    }
    stack.push(num);
    console.log("Stack after push : ", stack);
    console.log("------\n\n")
  }

  return nums1.map((num) => nextGreater.get(num) ?? -1);
}

console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2]))
// The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.

// You are given two distinct 0-indexed integer arrays nums1 and nums2, where nums1 is a subset of nums2.

// For each 0 <= i < nums1.length, find the index j such that nums1[i] == nums2[j] and determine the next greater element of nums2[j] in nums2. If there is no next greater element, then the answer for this query is -1.

// Return an array ans of length nums1.length such that ans[i] is the next greater element as described above.

// Example 1:

// Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
// Output: [-1,3,-1]
// Explanation: The next greater element for each value of nums1 is as follows:
// - 4 is underlined in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.
// - 1 is underlined in nums2 = [1,3,4,2]. The next greater element is 3.
// - 2 is underlined in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.
// Example 2:

// Input: nums1 = [2,4], nums2 = [1,2,3,4]
// Output: [3,-1]
// Explanation: The next greater element for each value of nums1 is as follows:
// - 2 is underlined in nums2 = [1,2,3,4]. The next greater element is 3.
// - 4 is underlined in nums2 = [1,2,3,4]. There is no next greater element, so the answer is -1.
