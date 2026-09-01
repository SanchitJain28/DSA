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
    `Start maxDepth on tree with root: ${root ? `Node(${root.val})` : "null"}.`,
    { depth: 0 },
  );

  if (!root) {
    pushFrame(null, "Base Case", 2, "Root is null. Returning depth 0.", {
      depth: 0,
      result: 0,
    });
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, parentId: string | null, side: string): number {
    if (!node) {
      callStack.push("maxDepth(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        2,
        `Reached null branch from ${parentId}. Returning depth 0.`,
        { returnDepth: 0 },
      );
      callStack.pop();
      return 0;
    }

    callStack.push(`maxDepth(${node.val})`);
    const id = node.id;

    // Recurse left
    pushFrame(
      id,
      "Recurse Left",
      3,
      `Explore left subtree of Node(${node.val}) to find left depth.`,
      { current: node.val },
    );
    const leftDepth = dfs(node.left, id, "left");

    // Recurse right
    pushFrame(
      id,
      "Recurse Right",
      4,
      `Left subtree of Node(${node.val}) returned depth ${leftDepth}. Now explore right subtree.`,
      { current: node.val, leftDepth },
    );
    const rightDepth = dfs(node.right, id, "right");

    // Compute depth
    const totalDepth = 1 + Math.max(leftDepth, rightDepth);
    pushFrame(
      id,
      "Calculate Max Depth",
      5,
      `Node(${node.val}): 1 + max(left: ${leftDepth}, right: ${rightDepth}) = ${totalDepth}. Returning ${totalDepth}.`,
      { current: node.val, leftDepth, rightDepth, returnDepth: totalDepth },
    );

    callStack.pop();
    return totalDepth;
  }

  const finalAns = dfs(root, null, "root");

  pushFrame(
    root.id,
    "Finished",
    5,
    `Maximum depth of the binary tree is ${finalAns}.`,
    { result: finalAns },
  );

  return builder.getFrames();
}

export default generateFrames;
