import { createLogger } from "../../../utils/logger";

class ListNode_ {
  val: number;
  next: ListNode_ | null;

  constructor(val?: number, next?: ListNode_ | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

const logger = createLogger("reverse-linked-list.log");

function reverseList(head: ListNode_ | null): ListNode_ | null {
  let prev: ListNode_ | null = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}

// Create: 1 -> 2 -> 3 -> 4
const head = new ListNode_(1);
head.next = new ListNode_(2);
head.next.next = new ListNode_(3);
head.next.next.next = new ListNode_(4);

// Reverse the list
const reversedHead = reverseList(head);

// Print the reversed list
let curr = reversedHead;
while (curr !== null) {
  logger(curr.val);
  curr = curr.next;
}