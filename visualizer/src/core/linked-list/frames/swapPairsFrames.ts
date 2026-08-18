import { ListNode } from "../ListNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";
import { FrameBuilder } from "../../shared/FrameBuilder";

export function generateFrames(values: number[]): Frame[] {
  const builder = new FrameBuilder<Frame>();

  // Initialize the list
  const dummy = new ListNode(-1, "dummy");
  const nodes: ListNode[] = [dummy];
  let curr = dummy;

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const node = new ListNode(val, `node-${i}`);
    nodes.push(node);
    curr.next = node;
    curr = node;
  }

  // Pointer variables (keeping track of the node IDs or null)
  let prev: ListNode | null = dummy;
  let left: ListNode | null = dummy.next;
  let right: ListNode | null = null;
  let nextPair: ListNode | null = null;

  const buildFrame = (phase: string, codeLine: number, message: string, activeNodeId: string | null) => {
    // Dynamically compute the layout based on the current structure starting from dummy
    const layout = computeLayout([{ head: dummy, label: "dummy" }], nodes);

    const pointers: Record<string, string> = {};
    const variables: Record<string, string> = {
      prev: prev ? (prev.id === "dummy" ? "Dummy" : `Node(${prev.val})`) : "null",
      left: left ? `Node(${left.val})` : "null",
      right: right ? `Node(${right.val})` : "null",
      nextPair: nextPair ? `Node(${nextPair.val})` : "null",
    };

    if (prev) pointers["prev"] = prev.id;
    if (left) pointers["left"] = left.id;
    if (right) pointers["right"] = right.id;
    if (nextPair) pointers["nextPair"] = nextPair.id;

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
    message: "Initializing swapPairs function.",
    variables: { prev: "N/A", left: "N/A", right: "N/A", nextPair: "N/A" },
    pointers: {},
    activeNodeId: null,
    layout: computeLayout([{ head: dummy, label: "dummy" }], nodes),
  });

  builder.executeCall(`swapPairs([${values.join(",")}])`, () => {
    buildFrame("Initialize Variables", 2, "Create dummy node.", dummy.id);
    buildFrame("Initialize Variables", 3, "Point dummy.next to the head.", dummy.next?.id || null);
    buildFrame("Initialize Variables", 4, "Set prev pointer to dummy.", dummy.id);
    buildFrame("Initialize Variables", 5, "Set left pointer to head.", left?.id || null);

    while (left && left.next) {
      buildFrame("Loop Condition", 7, `left and left.next are both valid. We have a pair to swap.`, left.id);

      right = left.next;
      buildFrame("Setup Pointers", 8, `Identify the right node of the pair.`, right.id);

      nextPair = right.next;
      buildFrame("Setup Pointers", 9, `Identify the next pair (right.next).`, nextPair?.id || null);

      right.next = left;
      buildFrame("Swap Nodes", 11, `right.next = left: Point the second node of the pair back to the first.`, right.id);

      left.next = nextPair;
      buildFrame("Swap Nodes", 12, `left.next = nextPair: Point the first node to the remaining list.`, left.id);

      prev!.next = right;
      buildFrame("Swap Nodes", 13, `prev.next = right: Point the previous node to the new head of this swapped pair.`, prev!.id);

      prev = left;
      buildFrame("Advance Pointers", 15, `prev = left: Advance the prev pointer to prepare for the next pair.`, prev.id);

      left = nextPair;
      buildFrame("Advance Pointers", 16, `left = nextPair: Advance the left pointer to the next pair.`, left?.id || null);
    }

    if (left) {
      buildFrame("Loop Condition", 7, `left.next is null. No more pairs to swap. Loop ends.`, left.id);
    } else {
      buildFrame("Loop Condition", 7, `left is null. No more nodes to process. Loop ends.`, null);
    }
  });

  builder.pushFrame({
    phase: "Finished",
    codeLine: 19,
    message: `Return dummy.next as the new head of the list.`,
    variables: {
      prev: prev ? ((prev as ListNode).id === "dummy" ? "Dummy" : `Node(${(prev as ListNode).val})`) : "null",
      left: left ? `Node(${(left as ListNode).val})` : "null",
      right: right ? `Node(${(right as ListNode).val})` : "null",
      nextPair: nextPair ? `Node(${(nextPair as ListNode).val})` : "null",
    },
    pointers: {},
    activeNodeId: dummy.next?.id || null,
    layout: computeLayout([{ head: dummy, label: "dummy" }], nodes),
  });

  return builder.getFrames();
}
