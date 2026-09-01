import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];
  let balanced = true;
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
        balanced: String(balanced),
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start isBalanced on binary tree with root: ${root ? `Node(${root.val})` : "null"}.`,
    { balanced: "true" },
  );

  if (!root) {
    pushFrame(null, "Base Case", 4, "Root is null. Empty tree is balanced (true).", {
      balanced: "true",
      result: "true",
    });
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, parentId: string | null, side: string): number {
    if (!node) {
      callStack.push("height(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        4,
        `Null node reached from ${parentId}. Height is 0.`,
      );
      callStack.pop();
      return 0;
    }

    callStack.push(`height(${node.val})`);
    const id = node.id;

    // Left child
    pushFrame(
      id,
      "Recurse Left",
      5,
      `Calculate height of left subtree for Node(${node.val}).`,
      { current: node.val },
    );
    const leftHeight = dfs(node.left, id, "left");

    // Right child
    pushFrame(
      id,
      "Recurse Right",
      6,
      `Left height of Node(${node.val}) is ${leftHeight}. Now calculate height of right subtree.`,
      { current: node.val, leftHeight },
    );
    const rightHeight = dfs(node.right, id, "right");

    const diff = Math.abs(leftHeight - rightHeight);
    if (diff > 1) {
      balanced = false;
      pushFrame(
        id,
        "Unbalanced Detected",
        7,
        `Height difference at Node(${node.val}): |${leftHeight} - ${rightHeight}| = ${diff} > 1! Setting balanced = false.`,
        { current: node.val, leftHeight, rightHeight, diff },
      );
    } else {
      pushFrame(
        id,
        "Subtree Balanced",
        7,
        `Height difference at Node(${node.val}): |${leftHeight} - ${rightHeight}| = ${diff} <= 1. Subtree is balanced.`,
        { current: node.val, leftHeight, rightHeight, diff },
      );
    }

    const currentHeight = 1 + Math.max(leftHeight, rightHeight);
    pushFrame(
      id,
      "Return Height",
      8,
      `Returning height for Node(${node.val}): 1 + max(${leftHeight}, ${rightHeight}) = ${currentHeight}.`,
      { current: node.val, currentHeight },
    );

    callStack.pop();
    return currentHeight;
  }

  dfs(root, null, "root");

  pushFrame(
    root.id,
    "Finished",
    11,
    `Tree is ${balanced ? "balanced" : "unbalanced"}. Returning ${balanced}.`,
    { result: String(balanced) },
  );

  return builder.getFrames();
}

export default generateFrames;
