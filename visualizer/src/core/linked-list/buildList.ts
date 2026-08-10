import { ListNode } from "./ListNode";

export function buildUnsortedList(): ListNode {
  const node4 = new ListNode(4, "node-4");
  const node2 = new ListNode(2, "node-2");
  const node1 = new ListNode(1, "node-1");
  const node3 = new ListNode(3, "node-3");

  node4.next = node2;
  node2.next = node1;
  node1.next = node3;

  return node4;
}
