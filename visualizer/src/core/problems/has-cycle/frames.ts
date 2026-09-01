import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { ListNode } from "../../structures/linked-list/ListNode";
import { computeLayout } from "../../structures/linked-list/layout";

export function generateFrames(data: {
  values: number[];
  pos: number;
}): Scene[] {
  const { values = [3, 2, 0, -4], pos = 1 } = data;
  const builder = new FrameBuilder<Scene>();

  if (values.length === 0) {
    builder.pushFrame({
      phase: "Empty List",
      codeLine: 1,
      explanation: "List is empty. hasCycle returns false.",
      structures: {
        linkedList: {
          nodes: [{ id: "null-0", val: "null", x: 100, y: 50, isNull: true }],
          edges: [],
          pointers: {},
        },
      },
      variables: { slow: "null", fast: "null", result: "false" },
    });
    return builder.getFrames();
  }

  const nodes: ListNode[] = [];
  for (let i = 0; i < values.length; i++) {
    const node = new ListNode(values[i], `node_${i}`);
    nodes.push(node);
    if (i > 0) {
      nodes[i - 1].next = node;
    }
  }

  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }

  const head = nodes[0];
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  const layout = computeLayout([{ head }], nodes);

  const cycleMsg =
    pos >= 0 && pos < nodes.length
      ? `List initialized with a cycle: tail node ${values[nodes.length - 1]} connects back to node ${values[pos]}.`
      : "List initialized without a cycle (tail points to null).";

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    explanation: cycleMsg,
    structures: {
      linkedList: {
        nodes: layout.nodes,
        edges: layout.edges,
        pointers: {},
      },
    },
    variables: { slow: "null", fast: "null" },
  });

  builder.pushFrame({
    phase: "Init Slow Pointer",
    codeLine: 2,
    explanation: "Initialize slow pointer at head.",
    structures: {
      linkedList: {
        nodes: layout.nodes,
        edges: layout.edges,
        pointers: { slow: slow?.id || "" },
        activeNodeId: slow?.id || "",
      },
    },
    variables: { slow: slow ? `Node(${slow.val})` : "null", fast: "null" },
  });

  builder.pushFrame({
    phase: "Init Fast Pointer",
    codeLine: 3,
    explanation: "Initialize fast pointer at head.",
    structures: {
      linkedList: {
        nodes: layout.nodes,
        edges: layout.edges,
        pointers: { slow: slow?.id || "", fast: fast?.id || "" },
        activeNodeId: fast?.id || "",
      },
    },
    variables: {
      slow: slow ? `Node(${slow.val})` : "null",
      fast: fast ? `Node(${fast.val})` : "null",
    },
  });

  let stepCount = 0;
  const maxSteps = values.length * 3 + 10;

  while (fast !== null && fast.next !== null && stepCount < maxSteps) {
    stepCount++;

    builder.pushFrame({
      phase: "Loop Condition",
      codeLine: 4,
      explanation: "Check loop condition: fast and fast.next are not null.",
      structures: {
        linkedList: {
          nodes: layout.nodes,
          edges: layout.edges,
          pointers: { slow: slow?.id || "", fast: fast.id },
          activeNodeId: fast.id,
        },
      },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
    });

    slow = slow!.next;
    builder.pushFrame({
      phase: "Advance Slow",
      codeLine: 5,
      explanation: `Move slow pointer one step forward to Node(${slow?.val}).`,
      structures: {
        linkedList: {
          nodes: layout.nodes,
          edges: layout.edges,
          pointers: { slow: slow?.id || "", fast: fast.id },
          activeNodeId: slow?.id || "",
        },
      },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
    });

    fast = fast.next.next;
    builder.pushFrame({
      phase: "Advance Fast",
      codeLine: 6,
      explanation: fast
        ? `Move fast pointer two steps forward to Node(${fast.val}).`
        : "Fast pointer moved two steps and reached null.",
      structures: {
        linkedList: {
          nodes: layout.nodes,
          edges: layout.edges,
          pointers: { slow: slow?.id || "", fast: fast ? fast.id : "" },
          activeNodeId: fast ? fast.id : "",
        },
      },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
    });

    builder.pushFrame({
      phase: "Check Equality",
      codeLine: 7,
      explanation: `Check if slow === fast (${slow === fast}).`,
      structures: {
        linkedList: {
          nodes: layout.nodes,
          edges: layout.edges,
          pointers: { slow: slow?.id || "", fast: fast ? fast.id : "" },
          activeNodeId: slow?.id || "",
        },
      },
      variables: {
        slow: slow ? `Node(${slow.val})` : "null",
        fast: fast ? `Node(${fast.val})` : "null",
      },
    });

    if (slow === fast && fast !== null && slow !== null) {
      builder.pushFrame({
        phase: "Cycle Detected",
        codeLine: 7,
        explanation: `Pointers met at Node(${slow.val})! Cycle detected. Returning true.`,
        structures: {
          linkedList: {
            nodes: layout.nodes,
            edges: layout.edges,
            pointers: { slow: slow.id, fast: fast.id },
            activeNodeId: slow.id,
          },
        },
        variables: {
          slow: `Node(${slow.val})`,
          fast: `Node(${fast.val})`,
          result: "true (Cycle)",
        },
      });
      return builder.getFrames();
    }
  }

  builder.pushFrame({
    phase: "No Cycle",
    codeLine: 9,
    explanation: "Fast pointer reached null. No cycle detected. Returning false.",
    structures: {
      linkedList: {
        nodes: layout.nodes,
        edges: layout.edges,
        pointers: { slow: slow?.id || "", fast: fast ? fast.id : "" },
      },
    },
    variables: {
      slow: slow ? `Node(${slow.val})` : "null",
      fast: fast ? `Node(${fast.val})` : "null",
      result: "false (No Cycle)",
    },
  });

  return builder.getFrames();
}

export default generateFrames;
