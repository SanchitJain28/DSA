import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
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
      variables,
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start countNodes on complete binary tree with root: ${root ? `Node(${root.val})` : "null"}.`,
  );

  if (!root) {
    pushFrame(null, "Base Case", 2, "Root is null. Returning node count 0.", {
      result: 0,
    });
    return builder.getFrames();
  }

  function count(node: TreeNode | null, parentId: string | null, side: string): number {
    if (!node) {
      callStack.push("countNodes(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        2,
        `Node is null. Count is 0.`,
        { count: 0 },
      );
      callStack.pop();
      return 0;
    }

    callStack.push(`countNodes(${node.val})`);
    const id = node.id;

    // Compute left height
    let lHeight = 0;
    let lCurr: TreeNode | null = node;
    while (lCurr) {
      lHeight++;
      lCurr = lCurr.left;
    }

    // Compute right height
    let rHeight = 0;
    let rCurr: TreeNode | null = node;
    while (rCurr) {
      rHeight++;
      rCurr = rCurr.right;
    }

    pushFrame(
      id,
      "Measure Boundary Heights",
      5,
      `Node(${node.val}): leftmost height = ${lHeight}, rightmost height = ${rHeight}.`,
      { current: node.val, leftHeight: lHeight, rightHeight: rHeight },
    );

    // If heights equal -> perfect subtree!
    if (lHeight === rHeight) {
      const perfectCount = (1 << lHeight) - 1;
      pushFrame(
        id,
        "Perfect Subtree Match",
        7,
        `leftHeight (${lHeight}) === rightHeight (${rHeight})! Subtree is PERFECT. Count is 2^${lHeight} - 1 = ${perfectCount}. Returning ${perfectCount}.`,
        { current: node.val, leftHeight: lHeight, rightHeight: rHeight, count: perfectCount },
      );
      callStack.pop();
      return perfectCount;
    }

    pushFrame(
      id,
      "Heights Differ -> Recurse",
      8,
      `leftHeight (${lHeight}) !== rightHeight (${rHeight}). Recurse on left and right children.`,
      { current: node.val, leftHeight: lHeight, rightHeight: rHeight },
    );

    const leftCount = count(node.left, id, "left");
    const rightCount = count(node.right, id, "right");

    const totalCount = 1 + leftCount + rightCount;
    pushFrame(
      id,
      "Combine Counts",
      8,
      `Node(${node.val}): 1 (root) + left (${leftCount}) + right (${rightCount}) = ${totalCount}.`,
      { current: node.val, leftCount, rightCount, totalCount },
    );

    callStack.pop();
    return totalCount;
  }

  const finalTotal = count(root, null, "root");

  pushFrame(
    root.id,
    "Finished",
    8,
    `Counting complete! Total nodes in complete binary tree = ${finalTotal}.`,
    { result: finalTotal },
  );

  return builder.getFrames();
}

export default generateFrames;
