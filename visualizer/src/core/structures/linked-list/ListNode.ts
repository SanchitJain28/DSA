export class ListNode {
  val: number;
  next: ListNode | null;
  id: string;

  constructor(val: number = 0, id?: string, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
    this.id = id || `node-${Math.random().toString(36).substr(2, 9)}`;
  }
}
