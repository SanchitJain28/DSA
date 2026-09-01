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
      variables: { result: "null" },
    });
    return builder.getFrames();
  }

  // Create dummy node and original list
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

  let prevNode: ListNode | null = dummy;
  let leftNode: ListNode | null = dummy.next;
  let rightNode: ListNode | null = null;
  let nextPairNode: ListNode | null = null;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    activeNodeId: string | null,
  ) => {
    const layout = computeLayout([{ head: dummy, label: "dummy" }], nodes);

    const pointers: Record<string, string> = {};
    if (prevNode) pointers["prev"] = prevNode.id;
    if (leftNode) pointers["left"] = leftNode.id;
    if (rightNode) pointers["right"] = rightNode.id;
    if (nextPairNode) pointers["nextPair"] = nextPairNode.id;

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
      variables: {
        prev: prevNode ? (prevNode.val === -1 ? "Dummy" : `Node(${prevNode.val})`) : "null",
        left: leftNode ? `Node(${leftNode.val})` : "null",
        right: rightNode ? `Node(${rightNode.val})` : "null",
        nextPair: nextPairNode ? `Node(${nextPairNode.val})` : "null",
      },
    });
  };

  buildFrame("Initialization", 2, "Create dummy node pointing to the head of the list.", "dummy");
  buildFrame("Setup Pointers", 4, "Set prev pointer to dummy.", dummy.id);
  buildFrame("Setup Pointers", 5, "Set left pointer to head.", leftNode ? leftNode.id : null);

  while (leftNode && leftNode.next) {
    buildFrame("Check Loop Condition", 7, "left and left.next both exist. We have a pair to swap.", leftNode.id);

    rightNode = leftNode.next;
    buildFrame("Identify Right Node", 8, `Identify right node of the pair: Node(${rightNode.val}).`, rightNode.id);

    nextPairNode = rightNode.next;
    buildFrame(
      "Identify Next Pair",
      9,
      `Identify start of next pair: ${nextPairNode ? `Node(${nextPairNode.val})` : "null"}.`,
      nextPairNode ? nextPairNode.id : null,
    );

    // Step 1: right.next = left (Backward arrow from second node to first)
    rightNode.next = leftNode;
    buildFrame(
      "Rewire: right.next = left",
      11,
      `right.next = left: Point Node(${rightNode.val}) back to Node(${leftNode.val}).`,
      rightNode.id,
    );

    // Step 2: left.next = nextPair (First node points to remainder)
    leftNode.next = nextPairNode;
    buildFrame(
      "Rewire: left.next = nextPair",
      12,
      `left.next = nextPair: Point Node(${leftNode.val}) forward to ${
        nextPairNode ? `Node(${nextPairNode.val})` : "null"
      }.`,
      leftNode.id,
    );

    // Step 3: prev.next = right (Prev points to new pair head)
    prevNode.next = rightNode;
    buildFrame(
      "Rewire: prev.next = right",
      13,
      `prev.next = right: Point prev (${
        prevNode.val === -1 ? "Dummy" : `Node(${prevNode.val})`
      }) to Node(${rightNode.val}). Pair swap complete!`,
      prevNode.id,
    );

    // Advance prev to left (which is now the tail of the swapped pair)
    prevNode = leftNode;
    buildFrame(
      "Advance prev Pointer",
      15,
      `prev = left: Advance prev pointer to Node(${prevNode.val}) to prepare for next pair.`,
      prevNode.id,
    );

    // Advance left to nextPair
    leftNode = nextPairNode;
    rightNode = null;
    nextPairNode = null;
    buildFrame(
      "Advance left Pointer",
      16,
      `left = nextPair: Advance left pointer to ${
        leftNode ? `Node(${leftNode.val})` : "null"
      }.`,
      leftNode ? leftNode.id : null,
    );
  }

  if (leftNode) {
    buildFrame("Loop End", 7, `left.next is null. Single remaining node cannot be paired. Loop ends.`, leftNode.id);
  } else {
    buildFrame("Loop End", 7, "left is null. All pairs processed. Loop ends.", null);
  }

  // Final return
  buildFrame(
    "Finished",
    18,
    `Pairwise swap complete. Returning dummy.next (${
      dummy.next ? `Node(${dummy.next.val})` : "null"
    }) as new head.`,
    dummy.next ? dummy.next.id : null,
  );

  return builder.getFrames();
}

export default generateFrames;
