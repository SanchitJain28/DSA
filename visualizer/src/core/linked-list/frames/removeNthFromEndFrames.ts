import { ListNode } from "../ListNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";
import { FrameBuilder } from "../../shared/FrameBuilder";

export function generateFrames(values: number[], n: number): Frame[] {
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

  // Helper to safely get node ID or null string representation
  const getNodeId = (idx: number) => (idx < nodes.length ? nodes[idx].id : null);
  const getNodeValStr = (idx: number) => (idx < nodes.length ? (nodes[idx].val === -1 && nodes[idx].id === "dummy" ? "Dummy" : `Node(${nodes[idx].val})`) : "null");

  // State variables for the algorithm
  let slowIdx = 0; // Starts at dummy (index 0)
  let fastIdx = 0; // Starts at dummy (index 0)

  // Layout function dynamically computes the layout based on the current structure
  // The first node is always the dummy, which points to the head.
  const buildFrame = (
    phase: string,
    codeLine: number,
    message: string,
    activeNodeId: string | null,
  ) => {
    const layout = computeLayout([{ head: nodes[0], label: "dummy" }], nodes);

    const pointers: Record<string, string> = {};
    const variables: Record<string, string> = {
      n: String(n),
      slow: getNodeValStr(slowIdx),
      fast: getNodeValStr(fastIdx),
    };

    if (slowIdx < nodes.length) {
      pointers["slow"] = nodes[slowIdx].id;
    }
    if (fastIdx < nodes.length) {
      pointers["fast"] = nodes[fastIdx].id;
    }

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
    message: "Initializing removeNthFromEndOptimal function.",
    variables: { n: String(n), slow: "N/A", fast: "N/A" },
    pointers: {},
    activeNodeId: null,
    layout: computeLayout([{ head: nodes[0], label: "dummy" }], nodes),
  });

  builder.executeCall(
    `removeNthFromEndOptimal([${values.join(",")}], ${n})`,
    () => {
      buildFrame(
        "Initialize Dummy",
        2,
        "Create a dummy node pointing to the head of the list.",
        dummy.id,
      );
      buildFrame(
        "Setup Pointers",
        3,
        "Set slow pointer to the dummy node.",
        dummy.id,
      );
      buildFrame(
        "Setup Pointers",
        4,
        "Set fast pointer to the dummy node.",
        dummy.id,
      );

      for (let i = 0; i <= n; i++) {
        buildFrame(
          "Advance Fast",
          6,
          `Advance fast pointer to maintain a gap of ${n} nodes. (Step ${i} of ${n})`,
          getNodeId(fastIdx),
        );
        fastIdx += 1;
        buildFrame(
          "Advance Fast",
          7,
          `fast pointer moves forward.`,
          getNodeId(fastIdx),
        );
      }

      // Explicitly show loop end
      buildFrame(
        "Advance Fast",
        6,
        `fast pointer is now ${n} nodes ahead of slow. Loop ends.`,
        getNodeId(fastIdx),
      );

      while (fastIdx < nodes.length) {
        buildFrame(
          "Loop Condition",
          10,
          `fast (${getNodeValStr(fastIdx)}) is not null.`,
          getNodeId(fastIdx),
        );

        slowIdx += 1;
        buildFrame(
          "Advance Slow",
          11,
          `Move slow pointer forward by 1 node.`,
          getNodeId(slowIdx),
        );

        fastIdx += 1;
        buildFrame(
          "Advance Fast",
          12,
          `Move fast pointer forward by 1 node.`,
          getNodeId(fastIdx),
        );
      }

      buildFrame("Loop End", 10, "Fast pointer is null. Loop ends.", null);

      // Node removal
      const targetIdx = slowIdx + 1;
      if (targetIdx < nodes.length) {
        buildFrame(
          "Remove Node",
          15,
          `Target node identified: ${getNodeValStr(targetIdx)}. Setting slow.next to slow.next.next.`,
          getNodeId(slowIdx),
        );

        // Update logic structure
        nodes[slowIdx].next = nodes[targetIdx].next;

        buildFrame(
          "Remove Node",
          15,
          `Node ${getNodeValStr(targetIdx)} has been bypassed and removed from the list.`,
          null,
        );
      }
    },
  );

  // Recompute layout for the final frame since the list structure has changed
  builder.pushFrame({
    phase: "Finished",
    codeLine: 17,
    message: `Return dummy.next as the new head of the list.`,
    variables: {
      n: String(n),
      slow: getNodeValStr(slowIdx),
      fast: getNodeValStr(fastIdx),
    },
    pointers: {},
    activeNodeId: dummy.next?.id || null,
    layout: computeLayout([{ head: nodes[0], label: "dummy" }], nodes),
  });

  return builder.getFrames();
}
