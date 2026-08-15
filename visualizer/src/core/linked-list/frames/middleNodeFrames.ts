import { ListNode } from "../ListNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";
import { FrameBuilder } from "../../shared/FrameBuilder";

export function generateFrames(values: number[]): Frame[] {
  const builder = new FrameBuilder<Frame>();
  
  // Build the linked list
  let head: ListNode | null = null;
  let curr: ListNode | null = null;
  const nodes: ListNode[] = [];
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const node = new ListNode(val, `node-${i}`);
    nodes.push(node);
    if (!head) {
      head = node;
      curr = head;
    } else {
      curr!.next = node;
      curr = node;
    }
  }

  const baseLayout = computeLayout([{ head }], nodes);

  let slowIdx = 0;
  let fastIdx = 0;

  const buildFrame = (phase: string, codeLine: number, message: string, activeNodeId: string | null) => {
    const pointers: Record<string, string> = {};
    const variables: Record<string, string> = {};

    if (slowIdx < nodes.length) {
      pointers["slow"] = nodes[slowIdx].id;
      variables["slow"] = `Node(${nodes[slowIdx].val})`;
    } else {
      variables["slow"] = "null";
    }

    if (fastIdx < nodes.length) {
      pointers["fast"] = nodes[fastIdx].id;
      variables["fast"] = `Node(${nodes[fastIdx].val})`;
    } else {
      variables["fast"] = "null";
    }

    builder.pushFrame({
      phase,
      codeLine,
      message,
      variables,
      pointers,
      activeNodeId,
      layout: baseLayout,
    });
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Initializing middleNode function.",
    variables: { slow: "N/A", fast: "N/A" },
    pointers: {},
    activeNodeId: null,
    layout: baseLayout,
  });

  builder.executeCall(`middleNode([${values.join(",")}])`, () => {
    buildFrame("Setup Pointers", 2, "Set slow pointer to head.", nodes[0]?.id || null);
    buildFrame("Setup Pointers", 3, "Set fast pointer to head.", nodes[0]?.id || null);

    while (fastIdx < nodes.length && fastIdx + 1 < nodes.length) {
      buildFrame(
        "Loop Condition", 
        4, 
        `fast (${nodes[fastIdx].val}) and fast.next (${nodes[fastIdx + 1].val}) are both not null.`, 
        nodes[fastIdx].id
      );

      slowIdx += 1;
      buildFrame("Advance Slow", 5, `Move slow pointer forward by 1 node.`, nodes[slowIdx].id);

      fastIdx += 2;
      buildFrame(
        "Advance Fast", 
        6, 
        `Move fast pointer forward by 2 nodes.`, 
        fastIdx < nodes.length ? nodes[fastIdx].id : null
      );
    }

    buildFrame(
      "Loop End", 
      4, 
      "Fast pointer or its next node is null. Loop ends.", 
      null
    );
  });

  buildFrame(
    "Finished", 
    8, 
    `Return slow pointer, which is at the middle node (${slowIdx < nodes.length ? nodes[slowIdx].val : 'null'}).`, 
    slowIdx < nodes.length ? nodes[slowIdx].id : null
  );

  return builder.getFrames();
}
