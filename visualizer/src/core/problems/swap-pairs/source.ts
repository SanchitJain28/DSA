import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function swapPairs(head) {" },
  { line: 2, text: "  const dummy = new ListNode(0);" },
  { line: 3, text: "  dummy.next = head;" },
  { line: 4, text: "  let prev = dummy;" },
  { line: 5, text: "  let left = head;" },
  { line: 6, text: "" },
  { line: 7, text: "  while (left && left.next) {" },
  { line: 8, text: "    const right = left.next;" },
  { line: 9, text: "    const nextPair = right.next;" },
  { line: 10, text: "" },
  { line: 11, text: "    right.next = left;" },
  { line: 12, text: "    left.next = nextPair;" },
  { line: 13, text: "    prev.next = right;" },
  { line: 14, text: "" },
  { line: 15, text: "    prev = left;" },
  { line: 16, text: "    left = nextPair;" },
  { line: 17, text: "  }" },
  { line: 18, text: "  return dummy.next;" },
  { line: 19, text: "}" },
];

export default source;
