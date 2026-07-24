import { ListNode } from "../intro/algorithm";

function isPalindrome(head: ListNode | null): boolean {
  if (!head || !head.next) return true;
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  let right = slow.next;
  slow.next = null;
  let prev = null;
  while (right) {
    const next = right.next;
    right.next = prev;
    prev = right;
    right = next;
  }
  right = prev;
  let left = head;
  while (right) {
    if (left.val !== right.val) return false;
    left = left.next!;
    right = right.next;
  }
  return true;
}

// Given the head of a singly linked list, return true if it is a palindrome or false otherwise.

// Example 1:
// Input: head = [1,2,2,1]
// Output: true

// Example 2:
// Input: head = [1,2]
// Output: false
