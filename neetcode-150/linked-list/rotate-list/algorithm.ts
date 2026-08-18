export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next || k === 0) return head;

  // Step 1: Count length and find tail
  let length = 1;
  let tail = head;
  while (tail.next) {
    tail = tail.next;
    length++;
  }

  // Step 2: Normalize k
  k = k % length;
  if (k === 0) return head;

  // Step 3: Connect tail to head to form a circular ring
  tail.next = head;

  // Step 4: Find new tail: (length - k) steps from head
  let stepsToNewTail = length - k;
  let newTail = head;
  for (let i = 1; i < stepsToNewTail; i++) {
    newTail = newTail.next!;
  }

  // Step 5: Break the ring
  const newHead = newTail.next;
  newTail.next = null;

  return newHead;
}

// Given the head of a linked list, rotate the list to the right by k places.

// Example 1:
// Input: head = [1,2,3,4,5], k = 2
// Output: [4,5,1,2,3]

// Example 2:
// Input: head = [0,1,2], k = 4
// Output: [2,0,1]
