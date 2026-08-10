export class ListNode {
  val: number;
  next: ListNode | null;
  id: string;

  constructor(val: number, id: string, next?: ListNode | null) {
    this.val = val;
    this.id = id;
    this.next = next === undefined ? null : next;
  }
}
