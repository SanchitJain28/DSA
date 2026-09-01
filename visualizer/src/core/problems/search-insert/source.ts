import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function searchInsert(nums, target) {" },
  { line: 2, text: "  let left = 0;" },
  { line: 3, text: "  let right = nums.length - 1;" },
  { line: 4, text: "  while (left <= right) {" },
  { line: 5, text: "    const mid = Math.floor((left + right) / 2);" },
  { line: 6, text: "    if (nums[mid] < target) {" },
  { line: 7, text: "      left = mid + 1;" },
  { line: 8, text: "    } else if (nums[mid] > target) {" },
  { line: 9, text: "      right = mid - 1;" },
  { line: 10, text: "    } else {" },
  { line: 11, text: "      return mid;" },
  { line: 12, text: "    }" },
  { line: 13, text: "  }" },
  { line: 14, text: "  return left;" },
  { line: 15, text: "}" },
];

export default source;
