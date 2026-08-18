export const searchInsertCode = [
  { line: 1, text: "function searchInsert(nums: number[], target: number): number {" },
  { line: 2, text: "  let left = 0;" },
  { line: 3, text: "  let right = nums.length - 1;" },
  { line: 4, text: "  while (left <= right) {" },
  { line: 5, text: "    let mid = Math.floor((left + right) / 2);" },
  { line: 6, text: "    if (nums[mid] < target) left = mid + 1;" },
  { line: 7, text: "    else if (nums[mid] > target) right = mid - 1;" },
  { line: 8, text: "    else return mid;" },
  { line: 9, text: "  }" },
  { line: 10, text: "  return left;" },
  { line: 11, text: "}" },
];
