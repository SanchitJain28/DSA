import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];
  let maxSum = -Infinity;
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
        maxPathSum: maxSum === -Infinity ? "-∞" : maxSum,
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start maxPathSum on binary tree with root: ${root ? `Node(${root.val})` : "null"}. Initial maxSum = -∞.`,
    { maxSum: "-∞" },
  );

  if (!root) {
    pushFrame(null, "Empty Tree", 4, "Root is null. Returning 0.", { result: 0 });
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, parentId: string | null, side: string): number {
    if (!node) {
      callStack.push("dfs(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        4,
        `Branch reached null from ${parentId}. Max gain is 0.`,
      );
      callStack.pop();
      return 0;
    }

    callStack.push(`dfs(${node.val})`);
    const id = node.id;

    // Recurse left
    pushFrame(
      id,
      "Recurse Left",
      5,
      `Calculate max path gain for left child of Node(${node.val}).`,
      { current: node.val },
    );
    const leftRaw = dfs(node.left, id, "left");
    const leftGain = Math.max(0, leftRaw);

    pushFrame(
      id,
      "Left Gain Evaluated",
      5,
      `Left subtree returned ${leftRaw}. Non-negative gain: max(0, ${leftRaw}) = ${leftGain}.`,
      { current: node.val, leftGain },
    );

    // Recurse right
    pushFrame(
      id,
      "Recurse Right",
      6,
      `Calculate max path gain for right child of Node(${node.val}).`,
      { current: node.val, leftGain },
    );
    const rightRaw = dfs(node.right, id, "right");
    const rightGain = Math.max(0, rightRaw);

    pushFrame(
      id,
      "Right Gain Evaluated",
      6,
      `Right subtree returned ${rightRaw}. Non-negative gain: max(0, ${rightRaw}) = ${rightGain}.`,
      { current: node.val, leftGain, rightGain },
    );

    // Compute path sum rooted at this node
    const currentPath = node.val + leftGain + rightGain;
    const prevMax = maxSum;
    maxSum = Math.max(maxSum, currentPath);

    pushFrame(
      id,
      "Evaluate Combined Path",
      8,
      `Path through Node(${node.val}): ${node.val} + leftGain (${leftGain}) + rightGain (${rightGain}) = ${currentPath}. Global maxSum = max(${
        prevMax === -Infinity ? "-∞" : prevMax
      }, ${currentPath}) = ${maxSum}.`,
      { current: node.val, leftGain, rightGain, currentPath, maxSum },
    );

    // Return single-branch gain to parent
    const branchGain = node.val + Math.max(leftGain, rightGain);
    pushFrame(
      id,
      "Return Single Branch",
      9,
      `Returning max single-branch gain for Node(${node.val}): ${node.val} + max(${leftGain}, ${rightGain}) = ${branchGain}.`,
      { current: node.val, branchGain },
    );

    callStack.pop();
    return branchGain;
  }

  dfs(root, null, "root");

  pushFrame(
    root.id,
    "Finished",
    12,
    `Finished traversal! Global Maximum Path Sum is ${maxSum}.`,
    { result: maxSum },
  );

  return builder.getFrames();
}

export default generateFrames;
