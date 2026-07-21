import { ListNode } from "../intro/algorithm";

function mergeTwoListsUnoptimized(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  let array: number[] = [];
  let current = list1;
  while (current !== null) {
    array.push(current.val);
    current = current.next;
  }
  current = list2;
  while (current !== null) {
    array.push(current.val);
    current = current.next;
  }
  array.sort((a, b) => a - b);
  return convertArrayToLinkedList(array);
}

function convertArrayToLinkedList(arr: number[]): ListNode | null {
  if (arr.length <= 0) return null;
  let head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}

function mergeTwoListsOptimized(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  let dummy = new ListNode(-1);
  let tail = dummy;

  let t1 = list1;
  let t2 = list2;

  while (t1 !== null && t2 !== null) {
    if (t1.val <= t2.val) {
      tail.next = t1;
      t1 = t1.next;
    } else {
      tail.next = t2;
      t2 = t2.next;
    }
    tail = tail.next;
  }

  if (t1 !== null) tail.next = t1;
  else tail.next = t2;

  return dummy.next;
}

// You are given the heads of two sorted linked lists list1 and list2.

// Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

// Return the head of the merged linked list.

// Example 1:
// Input: list1 = [1,2,4], list2 = [1,3,4]
// Output: [1,1,2,3,4,4]

// Example 2:
// Input: list1 = [], list2 = []
// Output: []

// Example 3:
// Input: list1 = [], list2 = [0]
// Output: [0]
