import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function search(nums, target) {" },
  { line: 2, text: "  let left = 0, right = nums.length - 1;" },
  { line: 3, text: "  // Phase 1: Find pivot (minimum index)" },
  { line: 4, text: "  while (left < right) {" },
  { line: 5, text: "    const mid = Math.floor((left + right) / 2);" },
  { line: 6, text: "    if (nums[mid] < nums[right]) right = mid;" },
  { line: 7, text: "    else left = mid + 1;" },
  { line: 8, text: "  }" },
  { line: 9, text: "  const minIdx = left;" },
  { line: 10, text: "  // Phase 2: Select subarray" },
  { line: 11, text: "  if (target >= nums[minIdx] && target <= nums[nums.length - 1]) {" },
  { line: 12, text: "    left = minIdx; right = nums.length - 1;" },
  { line: 13, text: "  } else {" },
  { line: 14, text: "    left = 0; right = minIdx - 1;" },
  { line: 15, text: "  }" },
  { line: 16, text: "  // Phase 3: Binary search" },
  { line: 17, text: "  while (left <= right) {" },
  { line: 18, text: "    const mid = Math.floor((left + right) / 2);" },
  { line: 19, text: "    if (nums[mid] === target) return mid;" },
  { line: 20, text: "    else if (nums[mid] < target) left = mid + 1;" },
  { line: 21, text: "    else right = mid - 1;" },
  { line: 22, text: "  }" },
  { line: 23, text: "  return -1;" },
  { line: 24, text: "}" },
];

export default source;
