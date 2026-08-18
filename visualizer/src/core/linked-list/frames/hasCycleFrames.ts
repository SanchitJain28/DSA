import { ListNode } from "../ListNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";

export function generateHasCycleFrames(
  values: number[] = [3, 2, 0, -4],
  pos: number = 1
): Frame[] {
  const frames: Frame[] = [];

  if (values.length === 0) {
    frames.push({
      layout: { nodes: [], edges: [] },
      activeNodeId: "",
      pointers: {},
      variables: { slow: "null", fast: "null" },
      message: "List is empty, hasCycle returns false.",
      codeLine: 1,
      phase: "Initialization",
    });
    return frames;
  }

  const nodes: ListNode[] = [];
  for (let i = 0; i < values.length; i++) {
    const node = new ListNode(values[i], `node_${i}`);
    nodes.push(node);
    if (i > 0) {
      nodes[i - 1].next = node;
    }
  }

  // If pos is valid, connect tail to nodes[pos]
  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }

  const head = nodes[0];
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  const cycleMsg =
    pos >= 0 && pos < nodes.length
      ? `List initialized with a cycle: tail node ${values[nodes.length - 1]} connects back to node ${values[pos]}.`
      : "List initialized without a cycle (tail points to null).";

  frames.push({
    layout: computeLayout([{ head }], nodes),
    activeNodeId: "",
    pointers: {},
    variables: { slow: "null", fast: "null" },
    message: cycleMsg,
    codeLine: 1,
    phase: "Initialization",
  });

  frames.push({
    layout: computeLayout([{ head }], nodes),
    activeNodeId: slow?.id || "",
    pointers: { slow: slow?.id || "" },
    variables: { slow: slow ? `Node(${slow.val})` : "null", fast: "null" },
    message: "Initialize slow pointer at head.",
    codeLine: 2,
    phase: "Initialization",
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
  });

  let stepCount = 0;
  const maxSteps = values.length * 3 + 10;

  while (fast !== null && fast.next !== null && stepCount < maxSteps) {
    stepCount++;

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
      message: `Move slow pointer one step forward to Node(${slow?.val}).`,
      codeLine: 5,
      phase: "Traversal",
    });

    fast = fast.next.next;
    frames.push({
      layout: computeLayout([{ head }], nodes),
      activeNodeId: fast?.id || "",
      pointers: { slow: slow?.id || "", fast: fast ? fast.id : "" },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
      message: fast
        ? `Move fast pointer two steps forward to Node(${fast.val}).`
        : "Fast pointer moved two steps and reached null.",
      codeLine: 6,
      phase: "Traversal",
    });

    frames.push({
      layout: computeLayout([{ head }], nodes),
      activeNodeId: slow?.id || "",
      pointers: { slow: slow?.id || "", fast: fast ? fast.id : "" },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
      message: `Check if slow === fast (${slow === fast}).`,
      codeLine: 7,
      phase: "Traversal",
    });

    if (slow === fast && fast !== null && slow !== null) {
      frames.push({
        layout: computeLayout([{ head }], nodes),
        activeNodeId: slow.id,
        pointers: { slow: slow.id, fast: fast.id },
        variables: {
          slow: `Node(${slow.val})`,
          fast: `Node(${fast.val})`,
        },
        message: `Pointers met at Node(${slow.val})! Cycle detected, returning true.`,
        codeLine: 7,
        phase: "Cycle Detected",
      });
      return frames;
    }
  }

  frames.push({
    layout: computeLayout([{ head }], nodes),
    activeNodeId: "",
    pointers: { slow: slow?.id || "", fast: fast ? fast.id : "" },
    variables: {
      slow: slow ? `Node(${slow.val})` : "null",
      fast: fast ? `Node(${fast.val})` : "null",
    },
    message: "Fast pointer reached null. No cycle detected, returning false.",
    codeLine: 9,
    phase: "No Cycle",
  });

  return frames;
}
