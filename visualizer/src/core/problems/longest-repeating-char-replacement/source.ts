import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function characterReplacement(s, k) {" },
  { line: 2, text: "  const count = new Map();" },
  { line: 3, text: "  let maxFreq = 0;" },
  { line: 4, text: "  let longest = 0;" },
  { line: 5, text: "  let left = 0;" },
  { line: 6, text: "  for (let right = 0; right < s.length; right++) {" },
  { line: 7, text: "    const char = s[right];" },
  { line: 8, text: "    count.set(char, (count.get(char) || 0) + 1);" },
  { line: 9, text: "    maxFreq = Math.max(maxFreq, count.get(char));" },
  { line: 10, text: "    while ((right - left + 1) - maxFreq > k) {" },
  { line: 11, text: "      count.set(s[left], count.get(s[left]) - 1);" },
  { line: 12, text: "      left++;" },
  { line: 13, text: "    }" },
  { line: 14, text: "    longest = Math.max(longest, right - left + 1);" },
  { line: 15, text: "  }" },
  { line: 16, text: "  return longest;" },
  { line: 17, text: "}" },
];

export default source;
