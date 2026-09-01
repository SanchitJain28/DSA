import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import {
  buildTreeFromLevelOrder,
  toTreeState,
  deepCopyTree,
} from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    currentTree: TreeNode | null,
  ) => {
    const treeState = toTreeState(deepCopyTree(currentTree), activeNodeId);
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      callStack: [...callStack],
      structures: {
        tree: treeState,
      },
      variables: {},
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start invertTree on binary tree with root: ${root ? `Node(${root.val})` : "null"}.`,
    root,
  );

  if (!root) {
    pushFrame(null, "Base Case", 2, "Root is null. Returning null.", null);
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, parentId: string | null, side: string) {
    if (!node) {
      callStack.push("invert(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        2,
        `Reached null branch from ${parentId}. Returning null.`,
        root,
      );
      callStack.pop();
      return;
    }

    callStack.push(`invert(${node.val})`);
    const id = node.id;

    // Step 1: Swap children
    const tempLeftVal = node.left ? `Node(${node.left.val})` : "null";
    const tempRightVal = node.right ? `Node(${node.right.val})` : "null";

    pushFrame(
      id,
      "Swap Children",
      4,
      `Swapping left child (${tempLeftVal}) and right child (${tempRightVal}) of Node(${node.val}).`,
      root,
    );

    const temp = node.left;
    node.left = node.right;
    node.right = temp;

    pushFrame(
      id,
      "Swap Complete",
      5,
      `Swapped! Node(${node.val}).left is now ${
        node.left ? `Node(${node.left.val})` : "null"
      }, right is ${node.right ? `Node(${node.right.val})` : "null"}.`,
      root,
    );

    // Step 2: Invert Left Subtree
    pushFrame(
      id,
      "Recurse Left",
      6,
      `Recursively invert left subtree of Node(${node.val}).`,
      root,
    );
    dfs(node.left, id, "left");

    // Step 3: Invert Right Subtree
    pushFrame(
      id,
      "Recurse Right",
      7,
      `Recursively invert right subtree of Node(${node.val}).`,
      root,
    );
    dfs(node.right, id, "right");

    pushFrame(
      id,
      "Return",
      8,
      `Subtrees of Node(${node.val}) fully inverted. Returning Node(${node.val}).`,
      root,
    );
    callStack.pop();
  }

  dfs(root, null, "root");

  pushFrame(
    null,
    "Finished",
    8,
    "Binary tree is fully inverted!",
    root,
  );

  return builder.getFrames();
}

export default generateFrames;
