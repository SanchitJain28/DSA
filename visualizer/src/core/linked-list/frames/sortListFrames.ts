import { ListNode } from "../ListNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";

export function generateFrames(head: ListNode | null): Frame[] {
  const frames: Frame[] = [];
  const callStack: string[] = [];

  function addFrame(
    phase: string,
    codeLine: number,
    message: string,
    activeNodeId: string | null,
    locals: Record<string, ListNode | null>
  ) {
    const lists = Object.entries(locals)
      .filter(([_, node]) => node !== null)
      .map(([label, head]) => ({ head, label }));

    const variables: Record<string, string> = {};
    const pointers: Record<string, string> = {};
    for (const [k, v] of Object.entries(locals)) {
      if (v) {
        variables[k] = `Node(${v.val})`;
        pointers[k] = v.id;
      } else {
        variables[k] = "null";
      }
    }

    frames.push({
      callStack: [...callStack],
      activeNodeId,
      phase,
      codeLine,
      message,
      variables,
      pointers,
      layout: computeLayout(lists),
    });
  }

  function sortList(node: ListNode | null, contextPrefix = ""): ListNode | null {
    callStack.push(`sortList(${node ? node.val : "null"})`);
    
    const locals: Record<string, ListNode | null> = { head: node };
    
    addFrame("Sort", 1, `Call sortList with head ${node ? node.val : "null"}`, node?.id || null, locals);

    if (!node || !node.next) {
      addFrame("Base Case", 2, `List has 0 or 1 node, returning.`, node?.id || null, locals);
      callStack.pop();
      return node;
    }

    let slow = node;
    let fast = node;
    locals.slow = slow;
    locals.fast = fast;

    addFrame("Initialize", 3, `Initialize slow and fast pointers to head.`, slow.id, locals);

    while (fast.next && fast.next.next) {
      addFrame("Loop", 5, `Checking if fast.next and fast.next.next exist.`, fast.id, locals);
      
      slow = slow.next!;
      locals.slow = slow;
      addFrame("Move Slow", 6, `slow moves 1 step to ${slow.val}.`, slow.id, locals);

      fast = fast.next.next;
      locals.fast = fast;
      addFrame("Move Fast", 7, `fast moves 2 steps to ${fast.val}.`, fast.id, locals);
    }
    
    addFrame("Loop End", 8, `Loop ends. slow is at mid point ${slow.val}.`, slow.id, locals);

    const mid = slow.next;
    locals.mid = mid;
    addFrame("Split", 9, `mid is set to slow.next (${mid?.val}).`, mid?.id || null, locals);

    slow.next = null;
    addFrame("Split", 10, `Disconnect left half from right half (slow.next = null).`, slow.id, locals);

    addFrame("Recurse Left", 11, `Recursively sort the left half.`, node.id, locals);
    const left = sortList(node, contextPrefix + "L");
    locals.left = left;

    addFrame("Recurse Right", 12, `Recursively sort the right half.`, mid?.id || null, locals);
    const right = sortList(mid, contextPrefix + "R");
    locals.right = right;

    addFrame("Merge", 13, `Merge the two sorted halves.`, null, locals);
    const result = merge(left, right);
    
    callStack.pop();
    return result;
  }

  function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    callStack.push(`merge(${l1 ? l1.val : "null"}, ${l2 ? l2.val : "null"})`);
    const locals: Record<string, ListNode | null> = { l1, l2 };

    const dummy = new ListNode(-1, `dummy-${Math.random()}`);
    locals.dummy = dummy;
    let curr = dummy;
    locals.curr = curr;

    addFrame("Merge Init", 16, `Initialize dummy node and curr pointer.`, dummy.id, locals);

    while (l1 && l2) {
      addFrame("Merge Loop", 19, `Compare l1 (${l1.val}) and l2 (${l2.val}).`, curr.id, locals);
      
      if (l1.val > l2.val) {
        addFrame("Merge Condition", 20, `l1 is greater than l2.`, l2.id, locals);
        curr.next = l2;
        addFrame("Merge Link", 21, `Link curr.next to l2 (${l2.val}).`, curr.id, locals);
        l2 = l2.next;
        locals.l2 = l2;
        addFrame("Merge Advance", 22, `Advance l2.`, l2?.id || null, locals);
      } else {
        addFrame("Merge Condition", 23, `l1 is less than or equal to l2.`, l1.id, locals);
        curr.next = l1;
        addFrame("Merge Link", 24, `Link curr.next to l1 (${l1.val}).`, curr.id, locals);
        l1 = l1.next;
        locals.l1 = l1;
        addFrame("Merge Advance", 25, `Advance l1.`, l1?.id || null, locals);
      }
      
      curr = curr.next!;
      locals.curr = curr;
      addFrame("Merge Advance", 27, `Advance curr to ${curr.val}.`, curr.id, locals);
    }

    addFrame("Merge Remainder", 29, `Attach any remaining nodes from l1 or l2 to curr.next.`, curr.id, locals);
    curr.next = l1 ?? l2;

    addFrame("Merge Return", 30, `Return dummy.next as the merged head.`, dummy.next?.id || null, locals);
    
    callStack.pop();
    return dummy.next;
  }

  sortList(head);
  return frames;
}
