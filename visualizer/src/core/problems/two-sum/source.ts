import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function twoSum(nums, target) {" },
  { line: 2, text: "  const map = new Map();" },
  { line: 3, text: "  for (let i = 0; i < nums.length; i++) {" },
  { line: 4, text: "    const complement = target - nums[i];" },
  { line: 5, text: "    if (map.has(complement)) {" },
  { line: 6, text: "      return [map.get(complement), i];" },
  { line: 7, text: "    }" },
  { line: 8, text: "    map.set(nums[i], i);" },
  { line: 9, text: "  }" },
  { line: 10, text: "  return [-1, -1];" },
  { line: 11, text: "}" },
];

export default source;
