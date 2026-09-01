import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function sortedSquares(nums) {" },
  { line: 2, text: "  const n = nums.length;" },
  { line: 3, text: "  const result = new Array(n);" },
  { line: 4, text: "  let left = 0, right = n - 1, pos = n - 1;" },
  { line: 5, text: "  while (left <= right) {" },
  { line: 6, text: "    const leftSq = nums[left] ** 2;" },
  { line: 7, text: "    const rightSq = nums[right] ** 2;" },
  { line: 8, text: "    if (leftSq > rightSq) {" },
  { line: 9, text: "      result[pos] = leftSq;" },
  { line: 10, text: "      left++;" },
  { line: 11, text: "    } else {" },
  { line: 12, text: "      result[pos] = rightSq;" },
  { line: 13, text: "      right--;" },
  { line: 14, text: "    }" },
  { line: 15, text: "    pos--;" },
  { line: 16, text: "  }" },
  { line: 17, text: "  return result;" },
  { line: 18, text: "}" },
];

export default source;
