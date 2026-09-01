import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function reverseString(" },
  { line: 2, text: "  s: string[]," },
  { line: 3, text: "  left: number = 0," },
  { line: 4, text: "  right: number = s.length - 1" },
  { line: 5, text: "): void {" },
  { line: 6, text: "  if (left > right) return;" },
  { line: 7, text: "  let temp = s[left];" },
  { line: 8, text: "  s[left] = s[right];" },
  { line: 9, text: "  s[right] = temp;" },
  { line: 10, text: "  return reverseString(s, left + 1, right - 1);" },
  { line: 11, text: "}" },
];

export default source;
