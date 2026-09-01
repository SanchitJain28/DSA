import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function isValid(s) {" },
  { line: 2, text: "  const stack = [];" },
  { line: 3, text: "  const map = { ')': '(', '}': '{', ']': '[' };" },
  { line: 4, text: "  for (let i = 0; i < s.length; i++) {" },
  { line: 5, text: "    const char = s[i];" },
  { line: 6, text: "    if (char in map) {" },
  { line: 7, text: "      const top = stack.length > 0 ? stack.pop() : '#';" },
  { line: 8, text: "      if (top !== map[char]) {" },
  { line: 9, text: "        return false;" },
  { line: 10, text: "      }" },
  { line: 11, text: "    } else {" },
  { line: 12, text: "      stack.push(char);" },
  { line: 13, text: "    }" },
  { line: 14, text: "  }" },
  { line: 15, text: "  return stack.length === 0;" },
  { line: 16, text: "}" },
];

export default source;
