import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { type LayoutNode, type LayoutEdge } from "../../structures/linked-list/types";

export function generateFrames(data: {
  values: number[];
  k: number;
}): Scene[] {
  const { values, k } = data;
  const builder = new FrameBuilder<Scene>();

  if (values.length === 0) {
    builder.pushFrame({
      phase: "Empty List",
      codeLine: 2,
      explanation: "The linked list is empty. Returning null.",
      structures: {
        linkedList: {
          nodes: [{ id: "null_0", val: "null", x: 100, y: 50, isNull: true }],
          edges: [],
          pointers: {},
        },
      },
      variables: {
        k,
        length: 0,
        "k % length": 0,
      },
    });
    return builder.getFrames();
  }

  const n = values.length;
  const SPACING = 130;
  const START_X = 60;
  const Y = 70;

  const makeNodes = (): LayoutNode[] => {
    const nodes: LayoutNode[] = values.map((val, idx) => ({
      id: `node_${idx}`,
      val,
      x: START_X + idx * SPACING,
      y: Y,
    }));
    nodes.push({
      id: `null_end`,
      val: "null",
      x: START_X + n * SPACING,
      y: Y,
      isNull: true,
    });
    return nodes;
  };

  const makeEdges = (
    isCircular: boolean,
    severedTailIdx: number | null = null,
  ): LayoutEdge[] => {
    const edges: LayoutEdge[] = [];
    const NODE_RADIUS = 28;
    const ARROW_OFFSET = 32;

    for (let i = 0; i < n - 1; i++) {
      if (severedTailIdx === i) continue;
      edges.push({
        id: `edge_${i}_${i + 1}`,
        x1: START_X + i * SPACING + NODE_RADIUS,
        y1: Y,
        x2: START_X + (i + 1) * SPACING - ARROW_OFFSET,
        y2: Y,
      });
    }

    if (isCircular) {
      edges.push({
        id: `edge_circle_${n - 1}_0`,
        x1: START_X + (n - 1) * SPACING,
        y1: Y,
        x2: START_X,
        y2: Y,
      });
    } else if (severedTailIdx === null) {
      edges.push({
        id: `edge_${n - 1}_null`,
        x1: START_X + (n - 1) * SPACING + NODE_RADIUS,
        y1: Y,
        x2: START_X + n * SPACING - 20,
        y2: Y,
        isNull: true,
      });
    }

    return edges;
  };

  const makeFinalRotatedLayout = (newHeadIdx: number): { nodes: LayoutNode[]; edges: LayoutEdge[] } => {
    const rotatedValues: { val: number; origIdx: number }[] = [];
    for (let i = 0; i < n; i++) {
      const idx = (newHeadIdx + i) % n;
      rotatedValues.push({ val: values[idx], origIdx: idx });
    }

    const nodes: LayoutNode[] = rotatedValues.map((item, posIdx) => ({
      id: `node_${item.origIdx}`,
      val: item.val,
      x: START_X + posIdx * SPACING,
      y: Y,
    }));

    nodes.push({
      id: `null_end`,
      val: "null",
      x: START_X + n * SPACING,
      y: Y,
      isNull: true,
    });

    const edges: LayoutEdge[] = [];
    const NODE_RADIUS = 28;
    const ARROW_OFFSET = 32;

    for (let i = 0; i < n; i++) {
      const isNull = i === n - 1;
      edges.push({
        id: `edge_final_${i}`,
        x1: START_X + i * SPACING + NODE_RADIUS,
        y1: Y,
        x2: START_X + (i + 1) * SPACING - (isNull ? 20 : ARROW_OFFSET),
        y2: Y,
        isNull,
      });
    }

    return { nodes, edges };
  };

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    pointers: Record<string, string>,
    isCircular = false,
    severedTailIdx: number | null = null,
    activeNodeId: string | null = null,
    overrideLayout?: { nodes: LayoutNode[]; edges: LayoutEdge[] },
    variables: Record<string, string | number> = {},
  ) => {
    const layout = overrideLayout || {
      nodes: makeNodes(),
      edges: makeEdges(isCircular, severedTailIdx),
    };

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
        k,
        length: n,
        ...variables,
      },
    });
  };

  buildFrame(
    "Initialization",
    1,
    `Start rotateRight with k = ${k}.`,
    { head: "node_0" },
    false,
    null,
    "node_0",
  );

  if (n === 1 || k === 0) {
    buildFrame(
      "No-Op Check",
      2,
      n === 1
        ? "List has only 1 node. Rotating returns the same list."
        : "k = 0, no rotations needed. Returning head.",
      { head: "node_0" },
      false,
      null,
      "node_0",
      undefined,
      { result: `Node(${values[0]})` },
    );
    return builder.getFrames();
  }

  for (let i = 0; i < n; i++) {
    buildFrame(
      "Find Tail & Length",
      4,
      `Traversing list to find tail and calculate total length (length = ${i + 1}).`,
      { head: "node_0", tail: `node_${i}` },
      false,
      null,
      `node_${i}`,
      undefined,
      { length: i + 1 },
    );
  }

  const effectiveK = k % n;
  buildFrame(
    "Calculate Effective k",
    8,
    `Compute effective rotations: k % length = ${k} % ${n} = ${effectiveK}.`,
    { head: "node_0", tail: `node_${n - 1}` },
    false,
    null,
    `node_${n - 1}`,
    undefined,
    { "k % length": effectiveK },
  );

  if (effectiveK === 0) {
    buildFrame(
      "Full Cycle",
      9,
      `Effective rotation k % length = 0. List order remains unchanged. Returning head.`,
      { head: "node_0", tail: `node_${n - 1}` },
      false,
      null,
      "node_0",
      undefined,
      { result: `Node(${values[0]})` },
    );
    return builder.getFrames();
  }

  // Close ring
  buildFrame(
    "Form Ring",
    10,
    `Connect tail.next = head (node_${n - 1} -> node_0) to form a circular linked list ring.`,
    { head: "node_0", tail: `node_${n - 1}` },
    true,
    null,
    `node_${n - 1}`,
  );

  const stepsToNewTail = n - effectiveK;
  let newTailIdx = 0;

  buildFrame(
    "Calculate New Tail Position",
    11,
    `Steps to new tail: length - k = ${n} - ${effectiveK} = ${stepsToNewTail} steps from head. Initialize newTail at head.`,
    { head: "node_0", newTail: "node_0" },
    true,
    null,
    "node_0",
    undefined,
    { stepsToNewTail },
  );

  for (let i = 1; i < stepsToNewTail; i++) {
    newTailIdx = i;
    buildFrame(
      "Advance to New Tail",
      13,
      `Step ${i}/${stepsToNewTail - 1}: Moving newTail pointer forward to Node(${values[newTailIdx]}).`,
      { head: "node_0", newTail: `node_${newTailIdx}` },
      true,
      null,
      `node_${newTailIdx}`,
    );
  }

  const newHeadIdx = (newTailIdx + 1) % n;

  buildFrame(
    "Identify New Head",
    15,
    `New head is newTail.next -> Node(${values[newHeadIdx]}).`,
    {
      newTail: `node_${newTailIdx}`,
      newHead: `node_${newHeadIdx}`,
    },
    true,
    null,
    `node_${newHeadIdx}`,
  );

  buildFrame(
    "Break Ring",
    16,
    `Sever ring at newTail.next = null (after Node(${values[newTailIdx]})).`,
    {
      newTail: `node_${newTailIdx}`,
      newHead: `node_${newHeadIdx}`,
    },
    false,
    newTailIdx,
    `node_${newTailIdx}`,
  );

  // Final linearized rotated layout
  const finalLayout = makeFinalRotatedLayout(newHeadIdx);
  buildFrame(
    "Finished",
    17,
    `List rotated by ${k} places. Returning new head: Node(${values[newHeadIdx]}).`,
    { head: `node_${newHeadIdx}` },
    false,
    null,
    `node_${newHeadIdx}`,
    finalLayout,
    { result: `Node(${values[newHeadIdx]})` },
  );

  return builder.getFrames();
}

export default generateFrames;
