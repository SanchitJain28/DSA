import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function hasCycle(head) {" },
  { line: 2, text: "  let slow = head;" },
  { line: 3, text: "  let fast = head;" },
  { line: 4, text: "  while (fast !== null && fast.next !== null) {" },
  { line: 5, text: "    slow = slow.next;" },
  { line: 6, text: "    fast = fast.next.next;" },
  { line: 7, text: "    if (slow === fast) return true;" },
  { line: 8, text: "  }" },
  { line: 9, text: "  return false;" },
  { line: 10, text: "}" },
];

export default source;
