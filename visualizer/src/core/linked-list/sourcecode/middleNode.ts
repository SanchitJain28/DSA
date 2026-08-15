export const middleNodeCode = [
  { line: 1, text: "function middleNode(head: ListNode | null): ListNode | null {" },
  { line: 2, text: "  let slow = head;" },
  { line: 3, text: "  let fast = head;" },
  { line: 4, text: "  while (fast && fast.next) {" },
  { line: 5, text: "    slow = slow!.next;" },
  { line: 6, text: "    fast = fast.next.next;" },
  { line: 7, text: "  }" },
  { line: 8, text: "  return slow;" },
  { line: 9, text: "}" },
];
