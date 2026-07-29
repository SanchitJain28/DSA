import { createLogger } from "../../../utils/logger";
import { ListNode, sampleLinkedList } from "../intro/algorithm";

const logger = createLogger("reverse-linked-list.log");

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr !== null) {
    //? Save the next node
    const next = curr.next;
    //? remove the link to previous
    curr.next = prev;
    //? move previous ahead
    prev = curr;
    //? move current ahead
    curr = next;
  }

  return prev;
}
const reversedHead = reverseList(sampleLinkedList(1,2,3,4));

let curr = reversedHead;
while (curr !== null) {
  logger(curr.val);
  curr = curr.next;
}