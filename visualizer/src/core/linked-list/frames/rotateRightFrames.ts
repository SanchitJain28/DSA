import { FrameBuilder } from "@/core/shared/FrameBuilder";
import { type Frame, type LayoutNode, type LayoutEdge } from "../types";

export function generateFrames(values: number[], k: number): Frame[] {
  const builder = new FrameBuilder<Frame>();

  if (values.length === 0) {
    builder.pushFrame({
      phase: "Empty List",
      codeLine: 2,
      message: "The linked list is empty. Returning null.",
      variables: {
        k: String(k),
        length: "0",
        "k % length": "0",
        stepsToNewTail: "0",
        newHead: "null",
      },
      pointers: {},
      layout: {
        nodes: [{ id: "null_0", val: "null", x: 100, y: 120, isNull: true }],
        edges: [],
      },
    });
    return builder.getFrames();
  }

  const n = values.length;
  const SPACING = 130;
  const START_X = 60;
  const Y = 140;

  // Build node layouts
  const makeNodes = (): LayoutNode[] => {
    const nodes: LayoutNode[] = values.map((val, idx) => ({
      id: `node_${idx}`,
      val,
      x: START_X + idx * SPACING,
      y: Y,
    }));
    nodes.push({
      id: `null_end`,
      val: "∅",
      x: START_X + n * SPACING,
      y: Y,
      isNull: true,
    });
    return nodes;
  };

  const makeEdges = (isCircular: boolean, severedTailIdx: number | null = null): LayoutEdge[] => {
    const edges: LayoutEdge[] = [];
    const NODE_RADIUS = 28;
    const ARROW_OFFSET = 32;

    for (let i = 0; i < n - 1; i++) {
      if (severedTailIdx === i) {
        // Pointing to null
        continue;
      }
      edges.push({
        id: `edge_${i}_${i + 1}`,
        x1: START_X + i * SPACING + NODE_RADIUS,
        y1: Y,
        x2: START_X + (i + 1) * SPACING - ARROW_OFFSET,
        y2: Y,
      });
    }

    if (isCircular) {
      if (severedTailIdx !== n - 1) {
        // Edge from tail (n - 1) back to head (0)
        edges.push({
          id: `edge_circle`,
          x1: START_X + (n - 1) * SPACING,
          y1: Y,
          x2: START_X,
          y2: Y,
        });
      }
    } else {
      // Normal edge to null at end (null node is 16px radius)
      edges.push({
        id: `edge_null`,
        x1: START_X + (n - 1) * SPACING + NODE_RADIUS,
        y1: Y,
        x2: START_X + n * SPACING - 20,
        y2: Y,
        isNull: true,
      });
    }

    return edges;
  };

  const getVariables = (
    lengthVal: number,
    kVal: number,
    kMod: number | null,
    stepsVal: number | null,
    newHeadVal: string
  ) => ({
    k: String(kVal),
    length: String(lengthVal),
    "k % length": kMod !== null ? String(kMod) : "—",
    stepsToNewTail: stepsVal !== null ? String(stepsVal) : "—",
    newHead: newHeadVal,
  });

  // 1. Initialization
  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: `Initialized rotateRight with list [${values.join(" → ")}] and shift k = ${k}.`,
    variables: getVariables(1, k, null, null, "null"),
    pointers: { HEAD: "node_0", TAIL: "node_0" },
    layout: { nodes: makeNodes(), edges: makeEdges(false) },
  });

  if (n <= 1 || k === 0) {
    builder.pushFrame({
      phase: "Edge Case",
      codeLine: 2,
      message:
        n <= 1
          ? "List has at most 1 node. No rotation needed, returning head."
          : "Shift k = 0. No rotation needed, returning head.",
      variables: getVariables(n, k, 0, 0, `Node(${values[0]})`),
      pointers: { HEAD: "node_0" },
      layout: { nodes: makeNodes(), edges: makeEdges(false) },
    });
    return builder.getFrames();
  }

  // 2. Count Length & Find Tail
  let length = 1;
  for (let i = 0; i < n - 1; i++) {
    builder.pushFrame({
      phase: "Finding Tail",
      codeLine: 4,
      message: `Scanning linked list: tail is at node ${values[i]}. Checking if tail.next exists.`,
      variables: getVariables(length, k, null, null, "null"),
      pointers: { HEAD: "node_0", TAIL: `node_${i}` },
      layout: { nodes: makeNodes(), edges: makeEdges(false) },
    });

    length++;
    builder.pushFrame({
      phase: "Advancing Tail",
      codeLine: 5,
      message: `Advanced tail to node ${values[i + 1]}. Length is now ${length}.`,
      variables: getVariables(length, k, null, null, "null"),
      pointers: { HEAD: "node_0", TAIL: `node_${i + 1}` },
      layout: { nodes: makeNodes(), edges: makeEdges(false) },
    });
  }

  // 3. Normalize k
  const effectiveK = k % length;
  builder.pushFrame({
    phase: "Normalize Shift",
    codeLine: 8,
    message: `Calculated effective shift: k = ${k} % ${length} = ${effectiveK}.`,
    variables: getVariables(length, k, effectiveK, null, "null"),
    pointers: { HEAD: "node_0", TAIL: `node_${n - 1}` },
    layout: { nodes: makeNodes(), edges: makeEdges(false) },
  });

  if (effectiveK === 0) {
    builder.pushFrame({
      phase: "No Rotation Needed",
      codeLine: 9,
      message: `Effective shift is 0 (full rotation). List remains unchanged. Returning head.`,
      variables: getVariables(length, k, effectiveK, 0, `Node(${values[0]})`),
      pointers: { HEAD: "node_0", TAIL: `node_${n - 1}` },
      layout: { nodes: makeNodes(), edges: makeEdges(false) },
    });
    return builder.getFrames();
  }

  // 4. Form Circular Ring (tail.next = head)
  builder.pushFrame({
    phase: "Form Circular Ring",
    codeLine: 10,
    message: `Connected tail (node ${values[n - 1]}) back to head (node ${values[0]}) to form a circular ring!`,
    variables: getVariables(length, k, effectiveK, null, "null"),
    pointers: { HEAD: "node_0", TAIL: `node_${n - 1}` },
    layout: { nodes: makeNodes(), edges: makeEdges(true) },
  });

  // 5. Find New Tail: length - effectiveK steps from head
  const stepsToNewTail = length - effectiveK;
  builder.pushFrame({
    phase: "Calculate New Tail Steps",
    codeLine: 11,
    message: `Steps to new tail: length - k = ${length} - ${effectiveK} = ${stepsToNewTail}. Starting newTail traversal from head.`,
    variables: getVariables(length, k, effectiveK, stepsToNewTail, "null"),
    pointers: { HEAD: "node_0", TAIL: `node_${n - 1}`, NEWTAIL: "node_0" },
    layout: { nodes: makeNodes(), edges: makeEdges(true) },
  });

  let newTailIdx = 0;
  for (let step = 1; step < stepsToNewTail; step++) {
    newTailIdx++;
    builder.pushFrame({
      phase: "Step to New Tail",
      codeLine: 13,
      message: `Step ${step}: moved newTail pointer to node ${values[newTailIdx]}.`,
      variables: getVariables(length, k, effectiveK, stepsToNewTail, "null"),
      pointers: { HEAD: "node_0", TAIL: `node_${n - 1}`, NEWTAIL: `node_${newTailIdx}` },
      layout: { nodes: makeNodes(), edges: makeEdges(true) },
    });
  }

  // 6. Identify newHead = newTail.next
  const newHeadIdx = (newTailIdx + 1) % n;
  builder.pushFrame({
    phase: "Identify New Head",
    codeLine: 15,
    message: `Identified new head: newTail.next is node ${values[newHeadIdx]}.`,
    variables: getVariables(length, k, effectiveK, stepsToNewTail, `Node(${values[newHeadIdx]})`),
    pointers: {
      HEAD: "node_0",
      NEWTAIL: `node_${newTailIdx}`,
      NEWHEAD: `node_${newHeadIdx}`,
    },
    layout: { nodes: makeNodes(), edges: makeEdges(true) },
  });

  // 7. Break the Ring: newTail.next = null
  builder.pushFrame({
    phase: "Break Circular Ring",
    codeLine: 16,
    message: `Severed connection: newTail.next = null (broke link from node ${values[newTailIdx]} to node ${values[newHeadIdx]}).`,
    variables: getVariables(length, k, effectiveK, stepsToNewTail, `Node(${values[newHeadIdx]})`),
    pointers: {
      NEWTAIL: `node_${newTailIdx}`,
      NEWHEAD: `node_${newHeadIdx}`,
    },
    layout: { nodes: makeNodes(), edges: makeEdges(true, newTailIdx) },
  });

  // 8. Result complete
  const rotatedValues: number[] = [];
  for (let i = 0; i < n; i++) {
    rotatedValues.push(values[(newHeadIdx + i) % n]);
  }

  builder.pushFrame({
    phase: "Complete",
    codeLine: 17,
    message: `Rotation complete! New list order: [${rotatedValues.join(" → ")}]. Returning newHead (node ${values[newHeadIdx]}).`,
    variables: getVariables(length, k, effectiveK, stepsToNewTail, `Node(${values[newHeadIdx]})`),
    pointers: {
      NEWHEAD: `node_${newHeadIdx}`,
      TAIL: `node_${newTailIdx}`,
    },
    layout: { nodes: makeNodes(), edges: makeEdges(true, newTailIdx) },
  });

  return builder.getFrames();
}
