import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function longestConsecutive(nums) {" },
  { line: 2, text: "  if (nums.length === 0) return 0;" },
  { line: 3, text: "  const set = new Set(nums);" },
  { line: 4, text: "  let maxSequence = 0;" },
  { line: 5, text: "  for (const num of set) {" },
  { line: 6, text: "    if (!set.has(num - 1)) {" },
  { line: 7, text: "      let current = num;" },
  { line: 8, text: "      let length = 1;" },
  { line: 9, text: "      while (set.has(current + 1)) {" },
  { line: 10, text: "        current++;" },
  { line: 11, text: "        length++;" },
  { line: 12, text: "      }" },
  { line: 13, text: "      maxSequence = Math.max(maxSequence, length);" },
  { line: 14, text: "    }" },
  { line: 15, text: "  }" },
  { line: 16, text: "  return maxSequence;" },
  { line: 17, text: "}" },
];

export default source;
