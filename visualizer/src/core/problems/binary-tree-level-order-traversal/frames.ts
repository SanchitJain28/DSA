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
      explanation: "Root is null. Returning empty array [].",
      structures: {
        tree: { nodes: [], edges: [] },
        queue: [],
      },
      variables: { result: "[]" },
    });
    return builder.getFrames();
  }

  const baseTreeState = toTreeState(root);
  const queue: TreeNode[] = [root];
  const queueItems: string[] = [`Node(${root.val})`];
  const result: number[][] = [];
  const processedNodeIds: string[] = [];

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
  ) => {
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
        queue: [...queueItems],
      },
      variables: {
        result: JSON.stringify(result),
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    3,
    `Initialize BFS Queue with root Node(${root.val}).`,
  );

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    pushFrame(
      null,
      "New Level Setup",
      6,
      `Starting new tree level. Level size = ${levelSize} node(s) in queue.`,
      { levelSize },
    );

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      queueItems.shift();
      processedNodeIds.push(node.id);

      pushFrame(
        node.id,
        "Dequeue Node",
        9,
        `Dequeued Node(${node.val}) from the front of the queue.`,
        { levelSize, currentLevel: JSON.stringify(currentLevel) },
      );

      currentLevel.push(node.val);

      pushFrame(
        node.id,
        "Append to Level",
        10,
        `Added ${node.val} to current level: [${currentLevel.join(", ")}].`,
        { levelSize, currentLevel: JSON.stringify(currentLevel) },
      );

      if (node.left) {
        queue.push(node.left);
        queueItems.push(`Node(${node.left.val})`);
        pushFrame(
          node.id,
          "Enqueue Left Child",
          11,
          `Enqueued left child Node(${node.left.val}) into rear of queue.`,
          { levelSize, currentLevel: JSON.stringify(currentLevel) },
        );
      }

      if (node.right) {
        queue.push(node.right);
        queueItems.push(`Node(${node.right.val})`);
        pushFrame(
          node.id,
          "Enqueue Right Child",
          12,
          `Enqueued right child Node(${node.right.val}) into rear of queue.`,
          { levelSize, currentLevel: JSON.stringify(currentLevel) },
        );
      }
    }

    result.push(currentLevel);
    pushFrame(
      null,
      "Level Complete",
      14,
      `Completed level: [${currentLevel.join(", ")}]. Result is now ${JSON.stringify(
        result,
      )}.`,
    );
  }

  pushFrame(
    null,
    "Finished",
    16,
    `Queue is empty. Level order traversal complete! Returning ${JSON.stringify(
      result,
    )}.`,
  );

  return builder.getFrames();
}

export default generateFrames;
