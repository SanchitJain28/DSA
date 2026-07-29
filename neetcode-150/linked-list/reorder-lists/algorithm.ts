import { ListNode } from "../intro/algorithm";

function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;

  let slow: ListNode = head;
  let fast: ListNode = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  
  let second: ListNode | null = slow.next;
  slow.next = null;
  let prev: ListNode | null = null;
  while (second !== null) {
    const next: ListNode | null = second.next;
    second.next = prev;
    prev = second;
    second = next;
  }
  second = prev;
  let first: ListNode | null = head;
  while (second !== null) {
    let firstNext: ListNode | null = first.next!;
    let secondNext: ListNode | null = second.next;
    first.next = second;
    second.next = firstNext;
    first = firstNext;
    second = secondNext;
  }
} 

// You are given the head of a singly linked-list. The list can be represented as:

// L0 → L1 → … → Ln - 1 → Ln
// Reorder the list to be on the following form:

// L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …
// You may not modify the values in the list's nodes. Only nodes themselves may be changed.

// Example 1:
// Input: head = [1,2,3,4]
// Output: [1,4,2,3]

// Example 2:
// Input: head = [1,2,3,4,5]
// Output: [1,5,2,4,3]
