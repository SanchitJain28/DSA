import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function reorderList(head) {" },
  { line: 2, text: "  if (!head || !head.next) return;" },
  { line: 3, text: "  let slow = head, fast = head;" },
  { line: 4, text: "  while (fast.next && fast.next.next) {" },
  { line: 5, text: "    slow = slow.next;" },
  { line: 6, text: "    fast = fast.next.next;" },
  { line: 7, text: "  }" },
  { line: 8, text: "  let second = slow.next;" },
  { line: 9, text: "  slow.next = null;" },
  { line: 10, text: "  let prev = null;" },
  { line: 11, text: "  while (second) {" },
  { line: 12, text: "    const next = second.next;" },
  { line: 13, text: "    second.next = prev;" },
  { line: 14, text: "    prev = second;" },
  { line: 15, text: "    second = next;" },
  { line: 16, text: "  }" },
  { line: 17, text: "  second = prev;" },
  { line: 18, text: "  let first = head;" },
  { line: 19, text: "  while (second) {" },
  { line: 20, text: "    let firstNext = first.next;" },
  { line: 21, text: "    let secondNext = second.next;" },
  { line: 22, text: "    first.next = second;" },
  { line: 23, text: "    second.next = firstNext;" },
  { line: 24, text: "    first = firstNext;" },
  { line: 25, text: "    second = secondNext;" },
  { line: 26, text: "  }" },
  { line: 27, text: "}" },
];

export default source;
