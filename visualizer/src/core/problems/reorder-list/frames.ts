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
      codeLine: 2,
      explanation: "List is empty. Returning.",
      structures: {
        linkedList: {
          nodes: [{ id: "null-0", val: "null", x: 100, y: 50, isNull: true }],
          edges: [],
          pointers: {},
        },
      },
      variables: {},
    });
    return builder.getFrames();
  }

  const nodes: ListNode[] = [];
  for (let i = 0; i < values.length; i++) {
    const node = new ListNode(values[i], `node-${i}`);
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

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    activeNodeId: string | null,
  ) => {
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

  buildFrame("Initialization", 1, "Initialize reorderList.", head.id);

  if (values.length <= 2) {
    buildFrame(
      "Finished",
      2,
      "List length <= 2 requires no reordering. Returning.",
      head.id,
    );
    return builder.getFrames();
  }

  buildFrame(
    "Phase 1: Find Middle",
    3,
    "Set slow and fast pointers to head to find split point.",
    head.id,
  );

  while (fast.next !== null && fast.next.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    buildFrame(
      "Find Middle",
      7,
      `Advancing slow to Node(${slow?.val}) and fast to Node(${fast?.val}).`,
      slow?.id || null,
    );
  }

  second = slow!.next;
  slow!.next = null; // Sever list into two

  buildFrame(
    "Split Halves",
    9,
    `Severed list at slow.next = null. First half ends at Node(${slow?.val}), second half starts at Node(${second?.val}).`,
    second?.id || null,
  );

  slow = null;
  fast = null;

  buildFrame(
    "Phase 2: Reverse Second Half",
    11,
    "Begin in-place reversal of the second half list.",
    second?.id || null,
  );

  while (second !== null) {
    next = second.next;
    second.next = prev;
    prev = second;
    second = next;

    buildFrame(
      "Reverse Step",
      15,
      `Reversing pointer: Node(${prev.val}) points to previous node.`,
      prev.id,
    );
  }

  second = prev;
  prev = null;
  next = null;
  first = head;

  buildFrame(
    "Phase 3: Merge Halves",
    20,
    `Both halves ready: first half starts at Node(${first.val}), reversed second half starts at Node(${second?.val}). Interleaving nodes.`,
    first.id,
  );

  while (second !== null && first !== null) {
    const firstNext: ListNode | null = first.next;
    const secondNext: ListNode | null = second.next;

    first.next = second;
    second.next = firstNext;

    buildFrame(
      "Interleave Nodes",
      26,
      `Connected Node(${first!.val}) -> Node(${second.val}) -> ${
        firstNext ? `Node(${firstNext.val})` : "null"
      }.`,
      second.id,
    );

    first = firstNext;
    second = secondNext;

    buildFrame(
      "Advance Merge Pointers",
      28,
      "Advanced first and second pointers to next pair.",
      first ? first.id : null,
    );
  }

  first = null;
  second = null;

  buildFrame(
    "Finished",
    30,
    "Reorder complete! List successfully transformed in-place.",
    head.id,
  );

  return builder.getFrames();
}

export default generateFrames;
