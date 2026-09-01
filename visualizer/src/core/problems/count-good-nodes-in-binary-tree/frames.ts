import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];
  const goodNodeIds: string[] = [];
  let count = 0;
  const baseTreeState = toTreeState(root);

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
  ) => {
    // Add success status for all discovered good nodes
    const treeNodes = baseTreeState.nodes.map((n) => {
      if (goodNodeIds.includes(n.id)) {
        return { ...n, status: "success" as const };
      }
      return n;
    });

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      callStack: [...callStack],
      structures: {
        tree: {
          nodes: treeNodes,
          edges: baseTreeState.edges,
          activeNodeId,
        },
      },
      variables: {
        goodNodesCount: count,
        ...variables,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start goodNodes on binary tree with root: ${root ? `Node(${root.val})` : "null"}.`,
    { maxSoFar: root ? root.val : "N/A" },
  );

  if (!root) {
    pushFrame(null, "Empty Tree", 4, "Root is null. Count is 0.", { result: 0 });
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, parentId: string | null, side: string, maxVal: number) {
    if (!node) {
      callStack.push("dfs(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        4,
        `Branch reached null from ${parentId}. Returning.`,
        { maxSoFar: maxVal },
      );
      callStack.pop();
      return;
    }

    callStack.push(`dfs(${node.val}, maxVal=${maxVal})`);
    const id = node.id;

    // Check if node is good
    const isGood = node.val >= maxVal;
    if (isGood) {
      count++;
      goodNodeIds.push(node.id);
      pushFrame(
        id,
        "Good Node Found!",
        5,
        `Node(${node.val}) >= maxSoFar (${maxVal}). It is a GOOD NODE! Count is now ${count}.`,
        { current: node.val, maxSoFar: maxVal, isGood: "true" },
      );
    } else {
      pushFrame(
        id,
        "Not a Good Node",
        5,
        `Node(${node.val}) < maxSoFar (${maxVal}). Not a good node.`,
        { current: node.val, maxSoFar: maxVal, isGood: "false" },
      );
    }

    const nextMax = Math.max(maxVal, node.val);

    // Left child
    pushFrame(
      id,
      "Recurse Left",
      7,
      `Recurse into left child of Node(${node.val}) with maxSoFar = ${nextMax}.`,
      { current: node.val, maxSoFar: nextMax },
    );
    dfs(node.left, id, "left", nextMax);

    // Right child
    pushFrame(
      id,
      "Recurse Right",
      8,
      `Recurse into right child of Node(${node.val}) with maxSoFar = ${nextMax}.`,
      { current: node.val, maxSoFar: nextMax },
    );
    dfs(node.right, id, "right", nextMax);

    callStack.pop();
  }

  dfs(root, null, "root", root.val);

  pushFrame(
    root.id,
    "Finished",
    11,
    `Finished traversal! Total good nodes in tree = ${count}.`,
    { result: count },
  );

  return builder.getFrames();
}

export default generateFrames;
