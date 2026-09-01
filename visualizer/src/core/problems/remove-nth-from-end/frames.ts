import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { ListNode } from "../../structures/linked-list/ListNode";
import { computeLayout } from "../../structures/linked-list/layout";

export function generateFrames(data: {
  values: number[];
  n: number;
}): Scene[] {
  const { values, n } = data;
  const builder = new FrameBuilder<Scene>();

  // Guard: empty list
  if (!values || values.length === 0) {
    builder.pushFrame({
      phase: "Empty List",
      codeLine: 1,
      explanation: "Linked list is empty. Returning null.",
      structures: {
        linkedList: {
          nodes: [{ id: "null_0", val: "null", x: 100, y: 70, isNull: true }],
          edges: [],
          pointers: {},
        },
      },
      variables: { n },
    });
    return builder.getFrames();
  }

  // Validate n (1 <= n <= length)
  const safeN = Math.max(1, Math.min(n, values.length));

  // Initialize nodes: index 0 is dummy, indices 1..values.length are data nodes
  const dummy = new ListNode(-1, "dummy");
  const nodes: ListNode[] = [dummy];
  let curr = dummy;

  for (let i = 0; i < values.length; i++) {
    const node = new ListNode(values[i], `node-${i}`);
    nodes.push(node);
    curr.next = node;
    curr = node;
  }

  const getNodeValStr = (idx: number) => {
    if (idx >= nodes.length) return "null";
    if (idx === 0) return "Dummy";
    return `Node(${nodes[idx].val})`;
  };

  let slowIdx = 0;
  let fastIdx = 0;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    activeNodeId: string | null,
    extraPointers?: Record<string, string>,
  ) => {
    const layout = computeLayout([{ head: nodes[0], label: "dummy" }], nodes);

    const pointers: Record<string, string> = { ...extraPointers };
    const variables: Record<string, string | number> = {
      n: safeN,
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
      explanation,
      structures: {
        linkedList: {
          nodes: layout.nodes,
          edges: layout.edges,
          pointers,
          activeNodeId,
        },
      },
      variables,
    });
  };

  // Step 1: Initialization
  buildFrame(
    "Initialization",
    2,
    `Create a dummy node pointing to head Node(${values[0]}) to handle edge cases like removing the head.`,
    "dummy",
  );

  // Step 2: Init Fast and Slow pointers at dummy
  buildFrame("Init Fast Pointer", 3, "Initialize fast pointer at dummy node.", "dummy");
  buildFrame("Init Slow Pointer", 4, "Initialize slow pointer at dummy node.", "dummy");

  // Step 3: Advance Fast pointer by n + 1 steps (from i = 0 to i = safeN)
  // This creates a gap of exactly n nodes between slow and fast.
  for (let step = 1; step <= safeN + 1; step++) {
    fastIdx += 1;
    const fastDesc = getNodeValStr(fastIdx);

    buildFrame(
      "Advance Fast Pointer",
      6,
      `Advance fast pointer (step ${step}/${safeN + 1}) to ${fastDesc} to establish a gap of ${safeN} nodes.`,
      fastIdx < nodes.length ? nodes[fastIdx].id : null,
    );
  }

  buildFrame(
    "Gap Established",
    7,
    `Fast is now at ${getNodeValStr(fastIdx)}, positioned ${safeN + 1} steps ahead of slow (at ${getNodeValStr(slowIdx)}).`,
    fastIdx < nodes.length ? nodes[fastIdx].id : null,
  );

  // Step 4: Advance both slow and fast simultaneously until fast reaches null (past last node)
  while (fastIdx < nodes.length) {
    buildFrame(
      "Check Fast Pointer",
      8,
      `fast (${getNodeValStr(fastIdx)}) is not null. Advance both slow and fast pointers forward by 1 step.`,
      fastIdx < nodes.length ? nodes[fastIdx].id : null,
    );

    slowIdx += 1;
    fastIdx += 1;

    buildFrame(
      "Advance Both Pointers",
      10,
      `Slow moved to ${getNodeValStr(slowIdx)}, fast moved to ${getNodeValStr(fastIdx)}.`,
      slowIdx < nodes.length ? nodes[slowIdx].id : null,
    );
  }

  // Step 5: Fast is at null
  buildFrame(
    "Fast Reached End",
    8,
    `Fast has reached null. Slow is now at ${getNodeValStr(slowIdx)}, positioned directly before the ${safeN}-th node from the end.`,
    nodes[slowIdx].id,
  );

  // Step 6: Identify target node to remove
  const targetIdx = slowIdx + 1;
  const targetNode = nodes[targetIdx];
  const targetValStr = targetNode ? `Node(${targetNode.val})` : "null";

  buildFrame(
    "Identify Target Node",
    12,
    `Target node to remove is slow.next (${targetValStr}). Preparing to bypass it.`,
    targetNode?.id || null,
    targetNode ? { target: targetNode.id } : {},
  );

  // Step 7: Rewire slow.next = slow.next.next (unlink targetNode)
  if (targetNode) {
    nodes[slowIdx].next = targetNode.next;
    targetNode.next = null; // Sever target node's outgoing link

    const nextAfterTarget = nodes[slowIdx].next;
    const nextValStr = nextAfterTarget ? `Node(${nextAfterTarget.val})` : "null";

    buildFrame(
      "Unlink & Bypass",
      12,
      `Set slow.next = slow.next.next. ${getNodeValStr(slowIdx)} now points directly to ${nextValStr}, bypassing ${targetValStr}.`,
      nodes[slowIdx].id,
    );
  }

  // Step 8: Final frame - return dummy.next
  const newHead = dummy.next;
  buildFrame(
    "Finished",
    13,
    `Node ${targetValStr} removed successfully. Return dummy.next (${newHead ? `Node(${newHead.val})` : "null"}) as the new head.`,
    newHead?.id || null,
  );

  return builder.getFrames();
}

export default generateFrames;
