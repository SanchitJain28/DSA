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
      variables: { rightView: "[]" },
    });
    return builder.getFrames();
  }

  const baseTreeState = toTreeState(root);
  const queue: TreeNode[] = [root];
  const queueItems: string[] = [`Node(${root.val})`];
  const rightView: number[] = [];
  const rightViewNodeIds: string[] = [];

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
  ) => {
    const treeNodes = baseTreeState.nodes.map((n) => {
      if (rightViewNodeIds.includes(n.id)) {
        return { ...n, status: "success" as const };
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
        rightView: `[${rightView.join(", ")}]`,
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

    pushFrame(
      null,
      "New Level",
      6,
      `Starting level with ${levelSize} node(s) in queue.`,
      { levelSize },
    );

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      queueItems.shift();
      const isRightmost = i === levelSize - 1;

      pushFrame(
        node.id,
        "Process Node",
        8,
        `Dequeued Node(${node.val}) (index ${i}/${levelSize - 1} of this level).`,
        { i, levelSize, isRightmost: String(isRightmost) },
      );

      if (isRightmost) {
        rightView.push(node.val);
        rightViewNodeIds.push(node.id);

        pushFrame(
          node.id,
          "Rightmost Node Collected",
          9,
          `Node(${node.val}) is the LAST node in this level! Added to right view: [${rightView.join(
            ", ",
          )}].`,
          { i, levelSize, rightView: `[${rightView.join(", ")}]` },
        );
      }

      if (node.left) {
        queue.push(node.left);
        queueItems.push(`Node(${node.left.val})`);
        pushFrame(
          node.id,
          "Enqueue Left Child",
          10,
          `Enqueued left child Node(${node.left.val}).`,
          { i, levelSize },
        );
      }

      if (node.right) {
        queue.push(node.right);
        queueItems.push(`Node(${node.right.val})`);
        pushFrame(
          node.id,
          "Enqueue Right Child",
          11,
          `Enqueued right child Node(${node.right.val}).`,
          { i, levelSize },
        );
      }
    }
  }

  pushFrame(
    null,
    "Finished",
    14,
    `Queue is empty. Right side view: [${rightView.join(", ")}].`,
  );

  return builder.getFrames();
}

export default generateFrames;
