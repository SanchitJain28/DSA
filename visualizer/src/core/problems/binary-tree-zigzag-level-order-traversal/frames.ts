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
  let leftToRight = true;
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
        direction: leftToRight ? "Left -> Right" : "Right -> Left",
        result: JSON.stringify(result),
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    3,
    `Initialize Zigzag BFS Queue with root Node(${root.val}). Initial direction: Left -> Right.`,
  );

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    pushFrame(
      null,
      "New Level",
      6,
      `Starting level. Direction is ${leftToRight ? "Left -> Right" : "Right -> Left"}. ${levelSize} node(s) in queue.`,
      { levelSize },
    );

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      queueItems.shift();
      processedNodeIds.push(node.id);

      if (leftToRight) {
        currentLevel.push(node.val);
        pushFrame(
          node.id,
          "Push (Left -> Right)",
          11,
          `Dequeued Node(${node.val}). In Left->Right mode: pushed to end of level: [${currentLevel.join(
            ", ",
          )}].`,
          { levelSize, currentLevel: JSON.stringify(currentLevel) },
        );
      } else {
        currentLevel.unshift(node.val);
        pushFrame(
          node.id,
          "Unshift (Right -> Left)",
          12,
          `Dequeued Node(${node.val}). In Right->Left mode: unshifted to front of level: [${currentLevel.join(
            ", ",
          )}].`,
          { levelSize, currentLevel: JSON.stringify(currentLevel) },
        );
      }

      if (node.left) {
        queue.push(node.left);
        queueItems.push(`Node(${node.left.val})`);
        pushFrame(
          node.id,
          "Enqueue Left Child",
          13,
          `Enqueued left child Node(${node.left.val}) into queue.`,
          { levelSize, currentLevel: JSON.stringify(currentLevel) },
        );
      }

      if (node.right) {
        queue.push(node.right);
        queueItems.push(`Node(${node.right.val})`);
        pushFrame(
          node.id,
          "Enqueue Right Child",
          14,
          `Enqueued right child Node(${node.right.val}) into queue.`,
          { levelSize, currentLevel: JSON.stringify(currentLevel) },
        );
      }
    }

    result.push(currentLevel);
    leftToRight = !leftToRight;

    pushFrame(
      null,
      "Level Complete",
      16,
      `Level complete: [${currentLevel.join(
        ", ",
      )}]. Toggled direction to ${leftToRight ? "Left -> Right" : "Right -> Left"}. Result: ${JSON.stringify(
        result,
      )}.`,
    );
  }

  pushFrame(
    null,
    "Finished",
    19,
    `Zigzag traversal complete! Result: ${JSON.stringify(result)}.`,
  );

  return builder.getFrames();
}

export default generateFrames;
