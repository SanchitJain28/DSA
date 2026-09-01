import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function containsDuplicate(nums) {" },
  { line: 2, text: "  const map = new Map();" },
  { line: 3, text: "  for (let i = 0; i < nums.length; i++) {" },
  { line: 4, text: "    if (map.has(nums[i])) {" },
  { line: 5, text: "      return true;" },
  { line: 6, text: "    }" },
  { line: 7, text: "    map.set(nums[i], true);" },
  { line: 8, text: "  }" },
  { line: 9, text: "  return false;" },
  { line: 10, text: "}" },
];

export default source;
