import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { ListNode } from "../../structures/linked-list/ListNode";
import { computeLayout } from "../../structures/linked-list/layout";

export function generateFrames(data: { values: number[] }): Scene[] {
  const values = data.values;
  const builder = new FrameBuilder<Scene>();

  if (values.length === 0) {
    builder.pushFrame({
      phase: "Empty List",
      codeLine: 1,
      explanation: "List is empty. Returning null.",
      structures: {
        linkedList: {
          nodes: [{ id: "null-0", val: "null", x: 100, y: 50, isNull: true }],
          edges: [],
          pointers: {},
        },
      },
      variables: { slow: "null", fast: "null" },
    });
    return builder.getFrames();
  }

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

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    activeNodeId: string | null,
  ) => {
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
      explanation,
      structures: {
        linkedList: {
          nodes: baseLayout.nodes,
          edges: baseLayout.edges,
          pointers,
          activeNodeId,
        },
      },
      variables,
    });
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    explanation: "Initializing middleNode function with linked list.",
    structures: {
      linkedList: {
        nodes: baseLayout.nodes,
        edges: baseLayout.edges,
        pointers: {},
      },
    },
    variables: { slow: "N/A", fast: "N/A" },
  });

  buildFrame("Setup Slow Pointer", 2, "Set slow pointer to head node.", nodes[0]?.id || null);
  buildFrame("Setup Fast Pointer", 3, "Set fast pointer to head node.", nodes[0]?.id || null);

  while (fastIdx < nodes.length && fastIdx + 1 < nodes.length) {
    buildFrame(
      "Check Loop Condition",
      4,
      `fast (${nodes[fastIdx].val}) and fast.next (${nodes[fastIdx + 1].val}) are both valid. Continue traversing.`,
      nodes[fastIdx].id,
    );

    slowIdx += 1;
    buildFrame(
      "Advance Slow",
      5,
      `Move slow pointer forward by 1 node to Node(${nodes[slowIdx].val}).`,
      nodes[slowIdx].id,
    );

    fastIdx += 2;
    buildFrame(
      "Advance Fast",
      6,
      fastIdx < nodes.length
        ? `Move fast pointer forward by 2 nodes to Node(${nodes[fastIdx].val}).`
        : "Move fast pointer forward by 2 nodes (reached null).",
      fastIdx < nodes.length ? nodes[fastIdx].id : null,
    );
  }

  buildFrame(
    "Loop Terminated",
    4,
    "Fast pointer or fast.next reached null. While loop terminates.",
    null,
  );

  buildFrame(
    "Finished",
    8,
    `Return slow pointer at Node(${slowIdx < nodes.length ? nodes[slowIdx].val : "null"}), which is the middle of the linked list.`,
    slowIdx < nodes.length ? nodes[slowIdx].id : null,
  );

  return builder.getFrames();
}

export default generateFrames;
