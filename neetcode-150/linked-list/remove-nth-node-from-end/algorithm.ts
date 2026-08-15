import { ListNode, sampleLinkedList } from "../intro/algorithm";

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const nodes: ListNode[] = [];
  let current = head;
  while (current) {
    nodes.push(current);
    current = current.next;
  }
  const removedIndex = nodes.length - n;

  if (removedIndex === 0) return head!.next;

  const prev = nodes[removedIndex - 1];
  prev.next = nodes[removedIndex].next;

  return head;
}

function removeNthFromEndOptimal(
  head: ListNode | null,
  n: number,
): ListNode | null {
  const dummy = new ListNode(0, head);
  let slow = dummy;
  let fast = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next!;
  while (fast) {
    slow = slow.next!;
    fast = fast.next!;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}

console.log(removeNthFromEnd(sampleLinkedList(1, 2, 3, 4, 5), 1));

// Given the head of a linked list, remove the nth node from the end of the list and return its head.

// Example 1:
// Input: head = [1,2,3,4,5], n = 2
// Output: [1,2,3,5]

// Example 2:
// Input: head = [1], n = 1
// Output: []

// Example 3:
// Input: head = [1,2], n = 1
// Output: [1]
