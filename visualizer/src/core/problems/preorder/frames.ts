import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const result: number[] = [];
  const callStack: string[] = [];

  const baseTreeState = toTreeState(root);

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    extraVars: Record<string, string | number> = {},
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
        result: `[${result.join(", ")}]`,
        ...extraVars,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start preorder traversal on binary tree with root: ${root ? `Node(${root.val})` : "null"}.`,
  );

  if (!root) {
    pushFrame(null, "Base Case", 2, "Root is null. Returning empty result array [].");
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, parentId: string | null, side: string) {
    if (!node) {
      callStack.push("dfs(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        2,
        `Branch reached null from ${parentId}. Base case reached, returning.`,
      );
      callStack.pop();
      return;
    }

    callStack.push(`dfs(${node.val})`);
    const id = node.id;

    // Step 1: Process Root
    result.push(node.val);
    pushFrame(
      id,
      "Process Node",
      3,
      `Preorder: Process Root first! Appending Node(${node.val}) to result: [${result.join(", ")}].`,
      { current: node.val },
    );

    // Step 2: Recurse Left
    pushFrame(
      id,
      "Recurse Left",
      4,
      `Calling dfs(node.left) on left child of Node(${node.val}).`,
      { current: node.val },
    );
    dfs(node.left, id, "left");

    // Step 3: Recurse Right
    pushFrame(
      id,
      "Recurse Right",
      5,
      `Left subtree of Node(${node.val}) complete. Calling dfs(node.right) on right child.`,
      { current: node.val },
    );
    dfs(node.right, id, "right");

    // Step 4: Return
    pushFrame(
      id,
      "Return",
      6,
      `Finished processing Node(${node.val}) and all its subtrees. Popping call stack.`,
      { current: node.val },
    );
    callStack.pop();
  }

  dfs(root, null, "root");

  pushFrame(
    null,
    "Finished",
    6,
    `Preorder traversal complete! Output: [${result.join(", ")}].`,
  );

  return builder.getFrames();
}

export default generateFrames;
