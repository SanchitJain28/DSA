import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function findMin(nums) {" },
  { line: 2, text: "  let left = 0;" },
  { line: 3, text: "  let right = nums.length - 1;" },
  { line: 4, text: "  while (left < right) {" },
  { line: 5, text: "    const mid = Math.floor((left + right) / 2);" },
  { line: 6, text: "    if (nums[mid] > nums[right]) {" },
  { line: 7, text: "      left = mid + 1;" },
  { line: 8, text: "    } else {" },
  { line: 9, text: "      right = mid;" },
  { line: 10, text: "    }" },
  { line: 11, text: "  }" },
  { line: 12, text: "  return nums[left];" },
  { line: 13, text: "}" },
];

export default source;
