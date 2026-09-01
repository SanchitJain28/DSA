import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: {
  values: (number | null)[];
  targetSum: number;
}): Scene[] {
  const values = data.values || [];
  const targetSum = data.targetSum;
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];
  const baseTreeState = toTreeState(root);

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      callStack: [...callStack],
      structures: {
        tree: {
          ...baseTreeState,
          activeNodeId,
        },
      },
      variables: {
        targetSum,
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start hasPathSum with targetSum = ${targetSum}.`,
    { remaining: targetSum },
  );

  if (!root) {
    pushFrame(null, "Base Case", 2, "Root is null. No path exists. Returning false.", {
      result: "false",
    });
    return builder.getFrames();
  }

  function dfs(
    node: TreeNode | null,
    parentId: string | null,
    side: string,
    currentRemaining: number,
  ): boolean {
    if (!node) {
      callStack.push("hasPathSum(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        2,
        `Reached null branch from ${parentId}. Returning false.`,
        { remaining: currentRemaining },
      );
      callStack.pop();
      return false;
    }

    callStack.push(`hasPathSum(${node.val}, remaining=${currentRemaining})`);
    const id = node.id;

    // Check if leaf node
    const isLeaf = !node.left && !node.right;

    pushFrame(
      id,
      "Check Leaf Node",
      3,
      `Visiting Node(${node.val}). Current remaining sum: ${currentRemaining}. Is leaf? ${isLeaf ? "Yes" : "No"}.`,
      { current: node.val, remaining: currentRemaining, isLeaf: String(isLeaf) },
    );

    if (isLeaf) {
      const match = currentRemaining === node.val;
      pushFrame(
        id,
        "Leaf Evaluation",
        4,
        `Leaf reached! Node(${node.val}) === remaining (${currentRemaining})? ${
          match ? "MATCH! Target sum reached!" : "No match."
        }`,
        { current: node.val, remaining: currentRemaining, match: String(match) },
      );
      callStack.pop();
      return match;
    }

    const nextRemaining = currentRemaining - node.val;

    // Check Left
    pushFrame(
      id,
      "Recurse Left",
      7,
      `Subtract Node(${node.val}) from remaining: ${currentRemaining} - ${node.val} = ${nextRemaining}. Explore left child.`,
      { current: node.val, remaining: nextRemaining },
    );
    if (dfs(node.left, id, "left", nextRemaining)) {
      callStack.pop();
      return true;
    }

    // Check Right
    pushFrame(
      id,
      "Recurse Right",
      7,
      `Left subtree of Node(${node.val}) did not yield targetSum. Explore right child with remaining: ${nextRemaining}.`,
      { current: node.val, remaining: nextRemaining },
    );
    if (dfs(node.right, id, "right", nextRemaining)) {
      callStack.pop();
      return true;
    }

    callStack.pop();
    return false;
  }

  const finalResult = dfs(root, null, "root", targetSum);

  pushFrame(
    root.id,
    "Finished",
    8,
    `Path sum check finished. Target sum ${targetSum} was ${finalResult ? "FOUND (true)" : "NOT FOUND (false)"}.`,
    { result: String(finalResult) },
  );

  return builder.getFrames();
}

export default generateFrames;
