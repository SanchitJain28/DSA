import { ListNode } from "../ListNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";
import { FrameBuilder } from "../../shared/FrameBuilder";

export function generateFrames(values: number[]): Frame[] {
  const builder = new FrameBuilder<Frame>();

  const nodes: ListNode[] = [];

  if (values.length === 0) return [];

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const node = new ListNode(val, `node-${i}`);
    nodes.push(node);
    if (i > 0) {
      nodes[i - 1].next = node;
    }
  }
  const head = nodes[0];

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  let second: ListNode | null = null;
  let prev: ListNode | null = null;
  let first: ListNode | null = null;
  let next: ListNode | null = null;
  let firstNext: ListNode | null = null;
  let secondNext: ListNode | null = null;

  const buildFrame = (phase: string, codeLine: number, message: string, activeNodeId: string | null) => {
    // Generate the heads array for layout engine. We pass head and second because second gets detached!
    const lists = [];
    if (head) lists.push({ head, label: "head" });
    if (second) lists.push({ head: second, label: "second" });
    if (prev) lists.push({ head: prev, label: "prev" });

    const layout = computeLayout(lists, nodes);

    const pointers: Record<string, string> = {};
    const variables: Record<string, string> = {
      slow: slow ? `Node(${slow.val})` : "null",
      fast: fast ? `Node(${fast.val})` : "null",
      second: second ? `Node(${second.val})` : "null",
      prev: prev ? `Node(${prev.val})` : "null",
      first: first ? `Node(${first.val})` : "null",
    };

    if (slow) pointers["slow"] = slow.id;
    if (fast) pointers["fast"] = fast.id;
    if (second) pointers["second"] = second.id;
    if (prev) pointers["prev"] = prev.id;
    if (first) pointers["first"] = first.id;
    if (next) pointers["next"] = next.id;

    builder.pushFrame({
      phase,
      codeLine,
      message,
      variables,
      pointers,
      activeNodeId,
      layout,
    });
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Initializing reorderList function.",
    variables: { slow: "N/A", fast: "N/A", second: "N/A", prev: "N/A", first: "N/A" },
    pointers: {},
    activeNodeId: null,
    layout: computeLayout([{ head, label: "head" }], nodes),
  });

  builder.executeCall(`reorderList([${values.join(",")}])`, () => {
    if (!head || !head.next) {
      buildFrame("Base Case", 2, "List is empty or has only one element. Nothing to reorder.", head?.id || null);
      return;
    }
    
    buildFrame("Find Middle", 4, "Initialize slow pointer to head.", slow!.id);
    buildFrame("Find Middle", 5, "Initialize fast pointer to head.", fast!.id);

    while (fast !== null && fast.next !== null && fast.next.next !== null) {
      buildFrame("Find Middle", 6, `fast.next and fast.next.next are not null. Advance pointers.`, fast.id);
      
      slow = slow!.next!;
      buildFrame("Find Middle", 7, `Advance slow pointer by 1.`, slow.id);
      
      fast = fast.next.next;
      buildFrame("Find Middle", 8, `Advance fast pointer by 2.`, fast.id);
    }
    
    buildFrame("Find Middle", 6, `Loop finishes. slow is now at the middle of the list.`, slow!.id);

    second = slow!.next;
    buildFrame("Split List", 11, `Initialize second half pointer.`, second?.id || null);

    slow!.next = null;
    buildFrame("Split List", 12, `Break the list into two halves by setting slow.next to null.`, slow!.id);

    prev = null;
    buildFrame("Reverse Second Half", 13, `Initialize prev pointer to null for reversing the second half.`, null);

    while (second !== null) {
      buildFrame("Reverse Second Half", 14, `second is not null. Reverse next node.`, second.id);
      
      next = second.next;
      buildFrame("Reverse Second Half", 15, `Store second.next in next.`, next?.id || null);
      
      second.next = prev;
      buildFrame("Reverse Second Half", 16, `Point second.next backwards to prev.`, second.id);
      
      prev = second;
      buildFrame("Reverse Second Half", 17, `Move prev to second.`, prev.id);
      
      second = next;
      buildFrame("Reverse Second Half", 18, `Move second to next.`, second?.id || null);
    }
    
    buildFrame("Reverse Second Half", 14, `second is null. Reversal of the second half is complete.`, null);

    second = prev;
    next = null; // Clear next
    buildFrame("Merge Halves", 20, `Set second back to prev (the new head of the reversed second half).`, second!.id);

    first = head;
    buildFrame("Merge Halves", 21, `Initialize first pointer to the head of the first half.`, first.id);

    while (second !== null) {
      buildFrame("Merge Halves", 22, `second is not null. Merge one node from each half.`, second.id);

      firstNext = first!.next!;
      buildFrame("Merge Halves", 23, `Store first.next.`, firstNext?.id || null);
      
      secondNext = second.next;
      buildFrame("Merge Halves", 24, `Store second.next.`, secondNext?.id || null);
      
      first!.next = second;
      buildFrame("Merge Halves", 25, `Link first node to second node.`, first!.id);
      
      second.next = firstNext;
      buildFrame("Merge Halves", 26, `Link second node to the next node in the first half.`, second.id);
      
      first = firstNext;
      buildFrame("Merge Halves", 27, `Advance first pointer.`, first?.id || null);
      
      second = secondNext;
      buildFrame("Merge Halves", 28, `Advance second pointer.`, second?.id || null);
    }
    
    buildFrame("Merge Halves", 22, `second is null. Merging complete!`, null);
  });

  builder.pushFrame({
    phase: "Finished",
    codeLine: 30,
    message: `The list has been successfully reordered in-place.`,
    variables: {
        slow: slow ? `Node(${(slow as ListNode).val})` : "null",
        fast: fast ? `Node(${(fast as ListNode).val})` : "null",
        second: second ? `Node(${(second as ListNode).val})` : "null",
        prev: prev ? `Node(${(prev as ListNode).val})` : "null",
        first: first ? `Node(${(first as ListNode).val})` : "null",
    },
    pointers: {},
    activeNodeId: head.id,
    layout: computeLayout([{ head, label: "head" }], nodes),
  });

  return builder.getFrames();
}
