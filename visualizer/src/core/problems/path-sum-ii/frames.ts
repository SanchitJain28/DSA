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
  const currentPath: number[] = [];
  const allPaths: number[][] = [];
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
        currentPath: `[${currentPath.join(" -> ")}]`,
        allPaths: JSON.stringify(allPaths),
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start pathSum (find all paths) with targetSum = ${targetSum}.`,
    { remaining: targetSum },
  );

  if (!root) {
    pushFrame(null, "Base Case", 4, "Root is null. Returning empty paths list [].", {
      result: "[]",
    });
    return builder.getFrames();
  }

  function dfs(
    node: TreeNode | null,
    parentId: string | null,
    side: string,
    remaining: number,
  ) {
    if (!node) {
      callStack.push("dfs(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        4,
        `Null child reached from ${parentId}. Backtracking.`,
        { remaining },
      );
      callStack.pop();
      return;
    }

    callStack.push(`dfs(${node.val}, remaining=${remaining})`);
    const id = node.id;

    // Push node to current path
    currentPath.push(node.val);
    const isLeaf = !node.left && !node.right;

    pushFrame(
      id,
      "Push to Path",
      5,
      `Appended Node(${node.val}) to current path: [${currentPath.join(" -> ")}].`,
      { current: node.val, remaining },
    );

    // Leaf check
    if (isLeaf && remaining === node.val) {
      allPaths.push([...currentPath]);
      pushFrame(
        id,
        "Valid Path Found!",
        7,
        `Leaf Node(${node.val}) matches remaining ${remaining}! Valid path [${currentPath.join(" -> ")}] added to results!`,
        { current: node.val, remaining },
      );
    } else if (isLeaf) {
      pushFrame(
        id,
        "Leaf Sum Mismatch",
        6,
        `Leaf Node(${node.val}) does not match remaining ${remaining} (difference: ${remaining - node.val}). Path invalid.`,
        { current: node.val, remaining },
      );
    }

    // Recurse left
    if (node.left) {
      pushFrame(
        id,
        "Recurse Left",
        9,
        `Recurse into left child of Node(${node.val}) with remaining: ${remaining - node.val}.`,
        { current: node.val, remaining: remaining - node.val },
      );
      dfs(node.left, id, "left", remaining - node.val);
    }

    // Recurse right
    if (node.right) {
      pushFrame(
        id,
        "Recurse Right",
        10,
        `Recurse into right child of Node(${node.val}) with remaining: ${remaining - node.val}.`,
        { current: node.val, remaining: remaining - node.val },
      );
      dfs(node.right, id, "right", remaining - node.val);
    }

    // Backtrack: pop node from path
    currentPath.pop();
    pushFrame(
      id,
      "Backtrack",
      11,
      `Backtracking from Node(${node.val}). Popped from current path. Current path: [${currentPath.join(" -> ")}].`,
      { current: node.val, remaining },
    );

    callStack.pop();
  }

  dfs(root, null, "root", targetSum);

  pushFrame(
    root.id,
    "Finished",
    14,
    `Search complete! Found ${allPaths.length} valid paths summing to ${targetSum}: ${JSON.stringify(allPaths)}.`,
    { result: JSON.stringify(allPaths) },
  );

  return builder.getFrames();
}

export default generateFrames;
