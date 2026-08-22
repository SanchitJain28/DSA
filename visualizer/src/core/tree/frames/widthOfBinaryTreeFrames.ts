import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";
import { computeLayout } from "../layout";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null): Frame[] {
  const builder = new FrameBuilder<Frame>();

  const getEmptyVars = () => ({
    maxWidth: "0",
    levelSize: "N/A",
    startIndex: "N/A",
    currNode: "N/A",
    normalizedIndex: "N/A",
    first: "N/A",
    last: "N/A",
  });

  if (!root) {
    builder.pushFrame({
      phase: "Empty Tree",
      codeLine: 2,
      message: "Tree is empty. Returning maximum width 0.",
      variables: {
        ...getEmptyVars(),
        maxWidth: "0",
        currNode: "null",
      },
      callStack: [],
      layout: { nodes: [], edges: [] },
    });
    return builder.getFrames();
  }

  const baseLayout = computeLayout(root);

  const getBaseFrame = () => ({
    variables: getEmptyVars(),
    layout: JSON.parse(JSON.stringify(baseLayout)),
  });

  const markNodes = (
    frameLayout: any,
    idMap: Record<string, "active" | "target" | "secondary" | "success">,
  ) => {
    for (const node of frameLayout.nodes) {
      if (idMap[node.id]) {
        node.status = idMap[node.id];
      }
    }
  };

  // Step 1: Initial Frame
  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Initialization",
    codeLine: 1,
    message: "Starting Maximum Width of Binary Tree calculation.",
    variables: {
      ...getEmptyVars(),
      maxWidth: "0",
    },
    callStack: [],
  });

  // Step 2: Queue Setup
  const queue: [TreeNode, number][] = [[root, 0]];
  let maxWidth = 0;

  const formatQueue = () =>
    queue.map(([n, idx]) => `[Node(${n.val}), idx: ${idx}]`);

  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Queue Setup",
    codeLine: 3,
    message: `Initialize queue with root node ${root.val} at 0-indexed position 0: [[Node(${root.val}), 0]].`,
    variables: {
      maxWidth: "0",
      levelSize: "1",
      startIndex: "0",
      currNode: `Node(${root.val})`,
      normalizedIndex: "0",
      first: "N/A",
      last: "N/A",
    },
    callStack: formatQueue(),
    activeNodeId: root.id,
  });

  // Step 3: MaxWidth Setup
  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Setup",
    codeLine: 4,
    message: "Initialize maxWidth = 0.",
    variables: {
      maxWidth: "0",
      levelSize: "1",
      startIndex: "0",
      currNode: `Node(${root.val})`,
      normalizedIndex: "0",
      first: "N/A",
      last: "N/A",
    },
    callStack: formatQueue(),
  });

  let levelNum = 0;

  while (queue.length > 0) {
    levelNum++;
    const levelSize = queue.length;
    const startIndex = queue[0][1];
    let first = 0;
    let last = 0;

    // While Loop Start
    builder.pushFrame({
      ...getBaseFrame(),
      phase: `Level ${levelNum} Start`,
      codeLine: 5,
      message: `Start processing Level ${levelNum}. Queue has ${levelSize} node(s).`,
      variables: {
        maxWidth: String(maxWidth),
        levelSize: String(levelSize),
        startIndex: String(startIndex),
        currNode: "N/A",
        normalizedIndex: "N/A",
        first: "N/A",
        last: "N/A",
      },
      callStack: formatQueue(),
    });

    // Level Size & Start Index Normalization
    builder.pushFrame({
      ...getBaseFrame(),
      phase: `Level ${levelNum} Normalize`,
      codeLine: 7,
      message: `Set startIndex = ${startIndex} (leftmost index of level). Subtracting startIndex normalizes indices to 0-based to prevent integer overflow in deep trees.`,
      variables: {
        maxWidth: String(maxWidth),
        levelSize: String(levelSize),
        startIndex: String(startIndex),
        currNode: "N/A",
        normalizedIndex: "N/A",
        first: "N/A",
        last: "N/A",
      },
      callStack: formatQueue(),
    });

    // For Loop
    for (let i = 0; i < levelSize; i++) {
      const [node, index] = queue.shift()!;
      const normalizedIndex = index - startIndex;

      if (i === 0) first = normalizedIndex;
      if (i === levelSize - 1) last = normalizedIndex;

      const frameLayout = getBaseFrame().layout;
      markNodes(frameLayout, { [node.id]: "active" });

      // Dequeue node
      builder.pushFrame({
        layout: frameLayout,
        phase: `Process Level ${levelNum}`,
        codeLine: 10,
        message: `Dequeue [Node(${node.val}), idx: ${index}]. Normalized index = ${index} - ${startIndex} = ${normalizedIndex}.`,
        variables: {
          maxWidth: String(maxWidth),
          levelSize: String(levelSize),
          startIndex: String(startIndex),
          currNode: `Node(${node.val})`,
          normalizedIndex: String(normalizedIndex),
          first: String(first),
          last: String(last),
        },
        callStack: formatQueue(),
        activeNodeId: node.id,
      });

      // Boundary check - First
      if (i === 0) {
        builder.pushFrame({
          layout: frameLayout,
          phase: `First Node of Level ${levelNum}`,
          codeLine: 12,
          message: `First node of Level ${levelNum} is Node(${node.val}) at normalized index first = ${normalizedIndex}.`,
          variables: {
            maxWidth: String(maxWidth),
            levelSize: String(levelSize),
            startIndex: String(startIndex),
            currNode: `Node(${node.val})`,
            normalizedIndex: String(normalizedIndex),
            first: String(first),
            last: String(last),
          },
          callStack: formatQueue(),
          activeNodeId: node.id,
        });
      }

      // Boundary check - Last
      if (i === levelSize - 1) {
        builder.pushFrame({
          layout: frameLayout,
          phase: `Last Node of Level ${levelNum}`,
          codeLine: 13,
          message: `Last node of Level ${levelNum} is Node(${node.val}) at normalized index last = ${normalizedIndex}.`,
          variables: {
            maxWidth: String(maxWidth),
            levelSize: String(levelSize),
            startIndex: String(startIndex),
            currNode: `Node(${node.val})`,
            normalizedIndex: String(normalizedIndex),
            first: String(first),
            last: String(last),
          },
          callStack: formatQueue(),
          activeNodeId: node.id,
        });
      }

      // Enqueue Left child
      if (node.left) {
        const leftIdx = 2 * normalizedIndex + 1;
        queue.push([node.left, leftIdx]);
        const childLayout = getBaseFrame().layout;
        markNodes(childLayout, {
          [node.id]: "active",
          [node.left.id]: "secondary",
        });

        builder.pushFrame({
          layout: childLayout,
          phase: "Enqueue Left Child",
          codeLine: 14,
          message: `Enqueue left child Node(${node.left.val}) with complete binary tree index 2 * ${normalizedIndex} + 1 = ${leftIdx}.`,
          variables: {
            maxWidth: String(maxWidth),
            levelSize: String(levelSize),
            startIndex: String(startIndex),
            currNode: `Node(${node.val})`,
            normalizedIndex: String(normalizedIndex),
            first: String(first),
            last: String(last),
          },
          callStack: formatQueue(),
          activeNodeId: node.left.id,
        });
      }

      if (node.right) {
        const rightIdx = 2 * normalizedIndex + 2;
        queue.push([node.right, rightIdx]);
        const childLayout = getBaseFrame().layout;
        markNodes(childLayout, {
          [node.id]: "active",
          [node.right.id]: "secondary",
        });

        builder.pushFrame({
          layout: childLayout,
          phase: "Enqueue Right Child",
          codeLine: 15,
          message: `Enqueue right child Node(${node.right.val}) with complete binary tree index 2 * ${normalizedIndex} + 2 = ${rightIdx}.`,
          variables: {
            maxWidth: String(maxWidth),
            levelSize: String(levelSize),
            startIndex: String(startIndex),
            currNode: `Node(${node.val})`,
            normalizedIndex: String(normalizedIndex),
            first: String(first),
            last: String(last),
          },
          callStack: formatQueue(),
          activeNodeId: node.right.id,
        });
      }
    }

    // Calculate level width
    const levelWidth = last - first + 1;
    const previousMax = maxWidth;
    maxWidth = Math.max(maxWidth, levelWidth);

    builder.pushFrame({
      ...getBaseFrame(),
      phase: `Level ${levelNum} Width`,
      codeLine: 17,
      message: `Level ${levelNum} width = last (${last}) - first (${first}) + 1 = ${levelWidth}. maxWidth = max(${previousMax}, ${levelWidth}) = ${maxWidth}.`,
      variables: {
        maxWidth: String(maxWidth),
        levelSize: String(levelSize),
        startIndex: String(startIndex),
        currNode: "N/A",
        normalizedIndex: `${last} - ${first} + 1 = ${levelWidth}`,
        first: String(first),
        last: String(last),
      },
      callStack: formatQueue(),
    });
  }

  // Final Return Frame
  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Finished",
    codeLine: 19,
    message: `Finished BFS level traversal. Maximum width of the binary tree is ${maxWidth}.`,
    variables: {
      maxWidth: String(maxWidth),
      levelSize: "0",
      startIndex: "0",
      currNode: "Done",
      normalizedIndex: "N/A",
      first: "N/A",
      last: "N/A",
    },
    callStack: [],
  });

  return builder.getFrames();
}
