// Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.

import { ListNode } from "../intro/algorithm";

function partition(head: ListNode | null, x: number): ListNode | null {
  if (!head || !head.next) return head;
  const dummyLess = new ListNode(-1);
  const dummyMore = new ListNode(-1);

  let t1 = dummyLess;
  let t2 = dummyMore;
  let curr = head;

  while (curr) {
    if (curr.val < x) {
      t1.next = curr;
      t1 = curr;
    } else {
      t2.next = curr;
      t2 = curr;
    }
    curr = curr.next!;
  }
  t2.next = null;
  t1.next = dummyMore.next;
  return dummyLess.next;
}
// You should preserve the original relative order of the nodes in each of the two partitions.

// Example 1:
// Input: head = [1,4,3,2,5,2], x = 3
// Output: [1,2,2,4,3,5]

// Example 2:
// Input: head = [2,1], x = 2
// Output: [1,2]
