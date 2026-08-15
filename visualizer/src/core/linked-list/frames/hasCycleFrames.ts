import { ListNode } from "../ListNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";

export function generateHasCycleFrames(): Frame[] {
  const frames: Frame[] = [];
  const nodes: ListNode[] = [];

  // Create list: 3 -> 2 -> 0 -> -4
  const node1 = new ListNode(3, "3");
  const node2 = new ListNode(2, "2");
  const node3 = new ListNode(0, "0");
  const node4 = new ListNode(-4, "-4");

  node1.next = node2;
  node2.next = node3;
  node3.next = node4;
  // Create cycle: -4 -> 2
  node4.next = node2;

  nodes.push(node1, node2, node3, node4);
  const head = node1;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  frames.push({
    layout: computeLayout([{ head }], nodes),
    activeNodeId: "",
    pointers: {},
    variables: { slow: "null", fast: "null" },
    message:
      "Initial list with a cycle (tail node -4 connects back to node 2).",
    codeLine: 1,
    phase: "Initialization",
    callStack: ["hasCycle(head)"],
  });

  frames.push({
    layout: computeLayout([{ head }], nodes),
    activeNodeId: slow?.id || "",
    pointers: { slow: slow?.id || "" },
    variables: { slow: slow ? `Node(${slow.val})` : "null", fast: "null" },
    message: "Initialize slow pointer at head.",
    codeLine: 2,
    phase: "Initialization",
    callStack: ["hasCycle(head)"],
  });

  frames.push({
    layout: computeLayout([{ head }], nodes),
    activeNodeId: fast?.id || "",
    pointers: { slow: slow?.id || "", fast: fast?.id || "" },
    variables: {
      slow: slow ? `Node(${slow.val})` : "null",
      fast: fast ? `Node(${fast.val})` : "null",
    },
    message: "Initialize fast pointer at head.",
    codeLine: 3,
    phase: "Initialization",
    callStack: ["hasCycle(head)"],
  });

  while (fast !== null && fast.next !== null) {
    frames.push({
      layout: computeLayout([{ head }], nodes),
      activeNodeId: fast.id,
      pointers: { slow: slow?.id || "", fast: fast.id },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
      message: "Check loop condition: fast and fast.next are not null.",
      codeLine: 4,
      phase: "Traversal",
      callStack: ["hasCycle(head)"],
    });

    slow = slow!.next;
    frames.push({
      layout: computeLayout([{ head }], nodes),
      activeNodeId: slow?.id || "",
      pointers: { slow: slow?.id || "", fast: fast.id },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
      message: "Move slow pointer one step forward.",
      codeLine: 5,
      phase: "Traversal",
      callStack: ["hasCycle(head)"],
    });

    fast = fast.next.next;
    frames.push({
      layout: computeLayout([{ head }], nodes),
      activeNodeId: fast?.id || "",
      pointers: { slow: slow?.id || "", fast: fast?.id || "" },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
      message: "Move fast pointer two steps forward.",
      codeLine: 6,
      phase: "Traversal",
      callStack: ["hasCycle(head)"],
    });

    frames.push({
      layout: computeLayout([{ head }], nodes),
      activeNodeId: slow?.id || "",
      pointers: { slow: slow?.id || "", fast: fast?.id || "" },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
      message: `Check if slow === fast (${slow?.id === fast?.id}).`,
      codeLine: 7,
      phase: "Traversal",
      callStack: ["hasCycle(head)"],
    });

    if (slow === fast) {
      frames.push({
        layout: computeLayout([{ head }], nodes),
        activeNodeId: slow?.id || "",
        pointers: { slow: slow?.id || "", fast: fast?.id || "" },
        variables: {
          slow: slow ? `Node(${slow.val})` : "null",
          fast: fast ? `Node(${fast.val})` : "null",
        },
        message: "Slow and fast pointers met! Cycle detected, returning true.",
        codeLine: 7,
        phase: "Return",
        callStack: ["hasCycle(head)"],
      });
      return frames;
    }
  }

  frames.push({
    layout: computeLayout([{ head }], nodes),
    activeNodeId: "",
    pointers: { slow: slow?.id || "", fast: fast?.id || "" },
    variables: {
      slow: slow ? `Node(${slow.val})` : "null",
      fast: fast ? `Node(${fast.val})` : "null",
    },
    message:
      "Fast pointer reached the end. No cycle detected, returning false.",
    codeLine: 9,
    phase: "Return",
    callStack: ["hasCycle(head)"],
  });

  return frames;
}
