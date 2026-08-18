import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";
import { computeLayout } from "../layout";
import type { Frame, LayoutNode, LayoutEdge } from "../types";

export function buildTreeFromLevelArray(arr: (number | null)[]): TreeNode | null {
  if (!arr.length || arr[0] === null) return null;

  const root = new TreeNode(arr[0], `n_0_${arr[0]}`);
  const queue: TreeNode[] = [root];
  let i = 1;

  while (i < arr.length && queue.length > 0) {
    const parent = queue.shift()!;

    if (i < arr.length) {
      const leftVal = arr[i];
      if (leftVal !== null) {
        parent.left = new TreeNode(leftVal, `n_${i}_${leftVal}`);
        queue.push(parent.left);
      }
      i++;
    }

    if (i < arr.length) {
      const rightVal = arr[i];
      if (rightVal !== null) {
        parent.right = new TreeNode(rightVal, `n_${i}_${rightVal}`);
        queue.push(parent.right);
      }
      i++;
    }
  }

  return root;
}

export function generateFrames(arr: (number | null)[]): Frame[] {
  const builder = new FrameBuilder<Frame>();

  if (!arr.length || arr[0] === null) {
    builder.pushFrame({
      phase: "Initialization",
      codeLine: 2,
      message: "Input array is empty or first element is null. Return null.",
      variables: { "arr.length": arr.length, result: "null" },
      callStack: [],
      layout: { nodes: [], edges: [] },
    });
    return builder.getFrames();
  }

  // Pre-build full tree structure to get layout positions
  const fullTree = buildTreeFromLevelArray(arr);
  const fullLayout = fullTree ? computeLayout(fullTree) : { nodes: [], edges: [] };

  const fullNodeMap = new Map<string, LayoutNode>();
  for (const node of fullLayout.nodes) {
    fullNodeMap.set(node.id, node);
  }

  const fullEdgeMap = new Map<string, LayoutEdge>();
  for (const edge of fullLayout.edges) {
    fullEdgeMap.set(edge.id, edge);
  }

  const visibleNodeIds = new Set<string>();
  const visibleEdgeIds = new Set<string>();

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    queueState: string[],
    variables: Record<string, string | number> = {},
    activeMap: Record<string, "active" | "target" | "secondary" | "success"> = {}
  ): Frame => {
    const currentNodes: LayoutNode[] = [];
    const currentEdges: LayoutEdge[] = [];

    for (const id of visibleNodeIds) {
      const origNode = fullNodeMap.get(id);
      if (origNode) {
        const cloned = { ...origNode };
        if (activeMap[cloned.id]) {
          cloned.status = activeMap[cloned.id];
        }
        currentNodes.push(cloned);
      }
    }

    for (const id of visibleEdgeIds) {
      const origEdge = fullEdgeMap.get(id);
      if (origEdge) {
        currentEdges.push({ ...origEdge });
      }
    }

    return {
      phase,
      codeLine,
      message,
      variables,
      callStack: [...queueState],
      layout: { nodes: currentNodes, edges: currentEdges },
    };
  };

  // Line 1: Function entry
  builder.pushFrame(
    getBaseFrame(
      1,
      "Initialization",
      `Start building binary tree from level-order array: [${arr.map(v => v === null ? "null" : v).join(", ")}]`,
      [],
      { "input length": arr.length }
    )
  );

  // Line 3: Create root node
  const root = new TreeNode(arr[0], `n_0_${arr[0]}`);
  visibleNodeIds.add(root.id);

  builder.pushFrame(
    getBaseFrame(
      3,
      "Create Root",
      `Created root node with value ${root.val}.`,
      [],
      { "root.val": root.val },
      { [root.id]: "active" }
    )
  );

  // Line 4: Initialize queue with root
  const queue: TreeNode[] = [root];
  const queueState: string[] = [`Node(${root.val})`];

  builder.pushFrame(
    getBaseFrame(
      4,
      "Initialize Queue",
      `Initialize queue with root node: [Node(${root.val})].`,
      queueState,
      { queue: `[Node(${root.val})]` },
      { [root.id]: "active" }
    )
  );

  // Line 5: Initialize pointer i = 1
  let i = 1;
  builder.pushFrame(
    getBaseFrame(
      5,
      "Initialize Pointer",
      "Set index i = 1 to iterate through child elements in the array.",
      queueState,
      { i, "arr[i]": i < arr.length ? String(arr[i]) : "end" }
    )
  );

  while (i < arr.length && queue.length > 0) {
    // Line 6: while condition
    builder.pushFrame(
      getBaseFrame(
        6,
        "While Condition",
        `i (${i}) < ${arr.length} and queue has ${queue.length} parent node(s).`,
        queueState,
        { i, "queue size": queue.length }
      )
    );

    const parent = queue.shift()!;
    queueState.shift();

    // Line 7: Pop parent
    builder.pushFrame(
      getBaseFrame(
        7,
        "Dequeue Parent",
        `Dequeued parent node ${parent.val} from queue. We will attach its left and right children.`,
        queueState,
        { i, "parent.val": parent.val },
        { [parent.id]: "target" }
      )
    );

    // Left Child (Line 8)
    if (i < arr.length) {
      const leftVal = arr[i];

      builder.pushFrame(
        getBaseFrame(
          8,
          "Inspect Left Value",
          `Reading array element at index i = ${i}: value = ${leftVal === null ? "null" : leftVal}.`,
          queueState,
          { i, "arr[i]": leftVal === null ? "null" : leftVal, "parent.val": parent.val },
          { [parent.id]: "target" }
        )
      );

      if (leftVal !== null) {
        const leftNode = new TreeNode(leftVal, `n_${i}_${leftVal}`);
        parent.left = leftNode;
        visibleNodeIds.add(leftNode.id);
        visibleEdgeIds.add(`${parent.id}-left`);

        // Line 9: Attach left child
        builder.pushFrame(
          getBaseFrame(
            9,
            "Attach Left Child",
            `Created left child node ${leftVal} and connected edge from parent ${parent.val} -> ${leftVal}.`,
            queueState,
            { i, "left.val": leftVal, "parent.val": parent.val },
            { [parent.id]: "target", [leftNode.id]: "active" }
          )
        );

        queue.push(leftNode);
        queueState.push(`Node(${leftVal})`);

        // Line 10: Push to queue
        builder.pushFrame(
          getBaseFrame(
            10,
            "Enqueue Left Child",
            `Enqueued Node(${leftVal}) into queue to process its children later.`,
            queueState,
            { i, "left.val": leftVal, "parent.val": parent.val },
            { [parent.id]: "target", [leftNode.id]: "active" }
          )
        );
      } else {
        builder.pushFrame(
          getBaseFrame(
            8,
            "Skip Null Child",
            `Element at index i = ${i} is null. Parent ${parent.val} has no left child.`,
            queueState,
            { i, "parent.val": parent.val },
            { [parent.id]: "target" }
          )
        );
      }

      i++;
      // Line 12: increment i
      builder.pushFrame(
        getBaseFrame(
          12,
          "Increment Index",
          `Incremented index i to ${i}.`,
          queueState,
          { i, "parent.val": parent.val },
          { [parent.id]: "target" }
        )
      );
    }

    // Right Child (Line 13)
    if (i < arr.length) {
      const rightVal = arr[i];

      builder.pushFrame(
        getBaseFrame(
          13,
          "Inspect Right Value",
          `Reading array element at index i = ${i}: value = ${rightVal === null ? "null" : rightVal}.`,
          queueState,
          { i, "arr[i]": rightVal === null ? "null" : rightVal, "parent.val": parent.val },
          { [parent.id]: "target" }
        )
      );

      if (rightVal !== null) {
        const rightNode = new TreeNode(rightVal, `n_${i}_${rightVal}`);
        parent.right = rightNode;
        visibleNodeIds.add(rightNode.id);
        visibleEdgeIds.add(`${parent.id}-right`);

        // Line 14: Attach right child
        builder.pushFrame(
          getBaseFrame(
            14,
            "Attach Right Child",
            `Created right child node ${rightVal} and connected edge from parent ${parent.val} -> ${rightVal}.`,
            queueState,
            { i, "right.val": rightVal, "parent.val": parent.val },
            { [parent.id]: "target", [rightNode.id]: "active" }
          )
        );

        queue.push(rightNode);
        queueState.push(`Node(${rightVal})`);

        // Line 15: Push to queue
        builder.pushFrame(
          getBaseFrame(
            15,
            "Enqueue Right Child",
            `Enqueued Node(${rightVal}) into queue to process its children later.`,
            queueState,
            { i, "right.val": rightVal, "parent.val": parent.val },
            { [parent.id]: "target", [rightNode.id]: "active" }
          )
        );
      } else {
        builder.pushFrame(
          getBaseFrame(
            13,
            "Skip Null Child",
            `Element at index i = ${i} is null. Parent ${parent.val} has no right child.`,
            queueState,
            { i, "parent.val": parent.val },
            { [parent.id]: "target" }
          )
        );
      }

      i++;
      // Line 17: increment i
      builder.pushFrame(
        getBaseFrame(
          17,
          "Increment Index",
          `Incremented index i to ${i}.`,
          queueState,
          { i, "parent.val": parent.val },
          { [parent.id]: "target" }
        )
      );
    }
  }

  // Final success frame: highlight all nodes in green (success)
  const successMap: Record<string, "success"> = {};
  for (const id of visibleNodeIds) {
    successMap[id] = "success";
  }

  builder.pushFrame(
    getBaseFrame(
      19,
      "Construction Complete",
      `Binary tree construction completed successfully! Total nodes created: ${visibleNodeIds.size}.`,
      [],
      { "total nodes": visibleNodeIds.size, status: "Complete" },
      successMap
    )
  );

  return builder.getFrames();
}
