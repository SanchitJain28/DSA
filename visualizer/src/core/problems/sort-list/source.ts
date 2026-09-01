import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function sortList(head) {" },
  { line: 2, text: "  if (!head || !head.next) return head;" },
  { line: 3, text: "  let slow = head, fast = head;" },
  { line: 4, text: "  while (fast.next && fast.next.next) {" },
  { line: 5, text: "    slow = slow.next;" },
  { line: 6, text: "    fast = fast.next.next;" },
  { line: 7, text: "  }" },
  { line: 8, text: "  const mid = slow.next;" },
  { line: 9, text: "  slow.next = null;" },
  { line: 10, text: "  const left = sortList(head);" },
  { line: 11, text: "  const right = sortList(mid);" },
  { line: 12, text: "  return merge(left, right);" },
  { line: 13, text: "}" },
  { line: 14, text: "" },
  { line: 15, text: "function merge(l1, l2) {" },
  { line: 16, text: "  const dummy = new ListNode(-1);" },
  { line: 17, text: "  let curr = dummy;" },
  { line: 18, text: "  while (l1 && l2) {" },
  { line: 19, text: "    if (l1.val > l2.val) {" },
  { line: 20, text: "      curr.next = l2; l2 = l2.next;" },
  { line: 21, text: "    } else {" },
  { line: 22, text: "      curr.next = l1; l1 = l1.next;" },
  { line: 23, text: "    }" },
  { line: 24, text: "    curr = curr.next;" },
  { line: 25, text: "  }" },
  { line: 26, text: "  curr.next = l1 || l2;" },
  { line: 27, text: "  return dummy.next;" },
  { line: 28, text: "}" },
];

export default source;
