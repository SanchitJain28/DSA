import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];
  let maxDiameter = 0;
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
        maxDiameter,
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start diameterOfBinaryTree on tree with root: ${root ? `Node(${root.val})` : "null"}.`,
    { maxDiameter: 0 },
  );

  if (!root) {
    pushFrame(null, "Base Case", 4, "Root is null. Diameter is 0.", {
      maxDiameter: 0,
      result: 0,
    });
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
        `Reached null branch from ${parentId}. Height is 0.`,
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
      `Explore left subtree of Node(${node.val}) to get left branch height.`,
      { current: node.val },
    );
    const leftHeight = dfs(node.left, id, "left");

    // Recurse right
    pushFrame(
      id,
      "Recurse Right",
      6,
      `Left height of Node(${node.val}) is ${leftHeight}. Explore right subtree.`,
      { current: node.val, leftHeight },
    );
    const rightHeight = dfs(node.right, id, "right");

    // Calculate path through this node
    const localDiameter = leftHeight + rightHeight;
    const prevMax = maxDiameter;
    maxDiameter = Math.max(maxDiameter, localDiameter);

    pushFrame(
      id,
      "Update Diameter",
      7,
      `Path through Node(${node.val}): left (${leftHeight}) + right (${rightHeight}) = ${localDiameter}. maxDiameter = max(${prevMax}, ${localDiameter}) = ${maxDiameter}.`,
      { current: node.val, leftHeight, rightHeight, localDiameter },
    );

    const returnHeight = 1 + Math.max(leftHeight, rightHeight);
    pushFrame(
      id,
      "Return",
      8,
      `Return branch height for Node(${node.val}): 1 + max(${leftHeight}, ${rightHeight}) = ${returnHeight}.`,
      { current: node.val, returnHeight },
    );

    callStack.pop();
    return returnHeight;
  }

  dfs(root, null, "root");

  pushFrame(
    root.id,
    "Finished",
    11,
    `Diameter calculation complete! Maximum diameter of the tree is ${maxDiameter}.`,
    { result: maxDiameter },
  );

  return builder.getFrames();
}

export default generateFrames;
