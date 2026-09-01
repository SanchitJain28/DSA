import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function removeNthFromEnd(head, n) {" },
  { line: 2, text: "  const dummy = new ListNode(0, head);" },
  { line: 3, text: "  let fast = dummy;" },
  { line: 4, text: "  let slow = dummy;" },
  { line: 5, text: "  for (let i = 0; i <= n; i++) {" },
  { line: 6, text: "    fast = fast.next;" },
  { line: 7, text: "  }" },
  { line: 8, text: "  while (fast) {" },
  { line: 9, text: "    slow = slow.next;" },
  { line: 10, text: "    fast = fast.next;" },
  { line: 11, text: "  }" },
  { line: 12, text: "  slow.next = slow.next.next;" },
  { line: 13, text: "  return dummy.next;" },
  { line: 14, text: "}" },
];

export default source;
