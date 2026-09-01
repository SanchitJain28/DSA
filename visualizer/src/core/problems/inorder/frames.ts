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
    `Start inorder traversal on binary tree with root: ${root ? `Node(${root.val})` : "null"}.`,
  );

  if (!root) {
    pushFrame(null, "Base Case", 2, "Root is null. Returning empty array [].");
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
        `Branch reached null from ${parentId}. Returning to parent.`,
      );
      callStack.pop();
      return;
    }

    callStack.push(`dfs(${node.val})`);
    const id = node.id;

    // Step 1: Recurse Left
    pushFrame(
      id,
      "Recurse Left",
      3,
      `Inorder: Traverse left subtree of Node(${node.val}) first.`,
      { current: node.val },
    );
    dfs(node.left, id, "left");

    // Step 2: Process Root
    result.push(node.val);
    pushFrame(
      id,
      "Process Node",
      4,
      `Left subtree complete. Processing Node(${node.val}), appending to result: [${result.join(", ")}].`,
      { current: node.val },
    );

    // Step 3: Recurse Right
    pushFrame(
      id,
      "Recurse Right",
      5,
      `Now traverse right subtree of Node(${node.val}).`,
      { current: node.val },
    );
    dfs(node.right, id, "right");

    // Step 4: Return
    pushFrame(
      id,
      "Return",
      6,
      `Finished inorder processing for Node(${node.val}). Popping call stack.`,
      { current: node.val },
    );
    callStack.pop();
  }

  dfs(root, null, "root");

  pushFrame(
    null,
    "Finished",
    6,
    `Inorder traversal complete! Output: [${result.join(", ")}].`,
  );

  return builder.getFrames();
}

export default generateFrames;
