import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function rotateRight(head, k) {" },
  { line: 2, text: "  if (!head || !head.next || k === 0) return head;" },
  { line: 3, text: "  let length = 1, tail = head;" },
  { line: 4, text: "  while (tail.next) {" },
  { line: 5, text: "    tail = tail.next;" },
  { line: 6, text: "    length++;" },
  { line: 7, text: "  }" },
  { line: 8, text: "  k = k % length;" },
  { line: 9, text: "  if (k === 0) return head;" },
  { line: 10, text: "  tail.next = head;" },
  { line: 11, text: "  let stepsToNewTail = length - k, newTail = head;" },
  { line: 12, text: "  for (let i = 1; i < stepsToNewTail; i++) {" },
  { line: 13, text: "    newTail = newTail.next;" },
  { line: 14, text: "  }" },
  { line: 15, text: "  const newHead = newTail.next;" },
  { line: 16, text: "  newTail.next = null;" },
  { line: 17, text: "  return newHead;" },
  { line: 18, text: "}" },
];

export default source;
