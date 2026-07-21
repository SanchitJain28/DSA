// class ListNode {
//   val: number;
//   next: ListNode | null;
//   constructor(val: number) {
//     this.val = val;
//     this.next = null;
//   }
// }

// const head = new ListNode(1);
// head.next = new ListNode(2);
// head.next.next = new ListNode(3);
// head.next.next.next = new ListNode(4);

// //? traversal
// let curr: ListNode | null = head;
// while (curr !== null) {
//   console.log(curr.val);
//   curr = curr.next
// }

export class ListNode {
  public val: number;
  public next: ListNode | null;

  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export function arrayToLinkedList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}
