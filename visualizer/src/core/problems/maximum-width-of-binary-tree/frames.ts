import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  if (!root) {
    builder.pushFrame({
      phase: "Empty Tree",
      codeLine: 2,
      explanation: "Root is null. Maximum width is 0.",
      structures: {
        tree: { nodes: [], edges: [] },
        queue: [],
      },
      variables: { maxWidth: 0 },
    });
    return builder.getFrames();
  }

  const baseTreeState = toTreeState(root);
  const queue: { node: TreeNode; index: bigint }[] = [{ node: root, index: 0n }];
  let maxWidth = 0;
  const processedNodeIds: string[] = [];

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
  ) => {
    const queueItems = queue.map((q) => `Node(${q.node.val}): idx ${q.index}`);
    const treeNodes = baseTreeState.nodes.map((n) => {
      if (processedNodeIds.includes(n.id)) {
        return { ...n, status: "secondary" as const };
      }
      return n;
    });

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        tree: {
          nodes: treeNodes,
          edges: baseTreeState.edges,
          activeNodeId,
        },
        queue: queueItems,
      },
      variables: {
        maxWidth,
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    4,
    `Initialize queue with root Node(${root.val}) at 0-index = 0.`,
  );

  while (queue.length > 0) {
    const levelSize = queue.length;
    const minIndex = queue[0].index;
    let first = 0n;
    let last = 0n;

    pushFrame(
      null,
      "Level Setup",
      7,
      `New level starting with ${levelSize} node(s). Level minIndex offset = ${minIndex}.`,
      { levelSize, minIndex: String(minIndex) },
    );

    for (let i = 0; i < levelSize; i++) {
      const { node, index } = queue.shift()!;
      const normalized = index - minIndex;
      processedNodeIds.push(node.id);

      if (i === 0) first = normalized;
      if (i === levelSize - 1) last = normalized;

      pushFrame(
        node.id,
        "Process Indexed Node",
        11,
        `Node(${node.val}) has raw index ${index}, normalized index = ${index} - ${minIndex} = ${normalized}.`,
        { levelSize, normalizedIdx: String(normalized) },
      );

      if (node.left) {
        const leftIdx = 2n * normalized;
        queue.push({ node: node.left, index: leftIdx });
        pushFrame(
          node.id,
          "Enqueue Left Child",
          14,
          `Enqueued left child Node(${node.left.val}) with index 2 × ${normalized} = ${leftIdx}.`,
          { levelSize },
        );
      }

      if (node.right) {
        const rightIdx = 2n * normalized + 1n;
        queue.push({ node: node.right, index: rightIdx });
        pushFrame(
          node.id,
          "Enqueue Right Child",
          15,
          `Enqueued right child Node(${node.right.val}) with index 2 × ${normalized} + 1 = ${rightIdx}.`,
          { levelSize },
        );
      }
    }

    const currentLevelWidth = Number(last - first + 1n);
    const prevMax = maxWidth;
    maxWidth = Math.max(maxWidth, currentLevelWidth);

    pushFrame(
      null,
      "Compute Level Width",
      17,
      `Level width = (last: ${last} - first: ${first} + 1) = ${currentLevelWidth}. maxWidth = max(${prevMax}, ${currentLevelWidth}) = ${maxWidth}.`,
      { currentLevelWidth, maxWidth },
    );
  }

  pushFrame(
    null,
    "Finished",
    19,
    `Traversal complete! Maximum width of the binary tree is ${maxWidth}.`,
    { result: maxWidth },
  );

  return builder.getFrames();
}

export default generateFrames;
