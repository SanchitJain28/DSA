import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder } from "../../structures/tree/helpers";
import { computeTreeLayoutWithOffset } from "../../structures/tree/layout";

export function generateFrames(data: {
  p: (number | null)[];
  q: (number | null)[];
}): Scene[] {
  const pArr = data.p || [];
  const qArr = data.q || [];
  const builder = new FrameBuilder<Scene>();

  const rootP = buildTreeFromLevelOrder(pArr);
  const rootQ = buildTreeFromLevelOrder(qArr);

  const callStack: string[] = [];

  const layoutP = computeTreeLayoutWithOffset(rootP, 160, 50, "p-", 70);
  const layoutQ = computeTreeLayoutWithOffset(rootQ, 440, 50, "q-", 70);

  const combinedLayout = {
    nodes: [...layoutP.nodes, ...layoutQ.nodes],
    edges: [...layoutP.edges, ...layoutQ.edges],
  };

  const pushFrame = (
    activeNodeIds: string[],
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
          nodes: combinedLayout.nodes,
          edges: combinedLayout.edges,
          activeNodeIds,
        },
      },
      variables,
    });
  };

  pushFrame(
    [],
    "Initialization",
    1,
    `Start isSameTree comparing Tree P and Tree Q.`,
    { result: "comparing" },
  );

  function isSame(
    nodeP: TreeNode | null,
    nodeQ: TreeNode | null,
    parentIdP: string | null,
    parentIdQ: string | null,
    side: string,
  ): boolean {
    const idP = nodeP
      ? `p-${nodeP.id}`
      : parentIdP
        ? `p-${parentIdP}-${side}-null`
        : "p-null";
    const idQ = nodeQ
      ? `q-${nodeQ.id}`
      : parentIdQ
        ? `q-${parentIdQ}-${side}-null`
        : "q-null";
    const activeNodes = [idP, idQ];

    const descP = nodeP ? `Node(${nodeP.val})` : "null";
    const descQ = nodeQ ? `Node(${nodeQ.val})` : "null";

    callStack.push(`isSameTree(${descP}, ${descQ})`);

    pushFrame(
      activeNodes,
      "Compare Nodes",
      2,
      `Comparing nodes: p = ${descP}, q = ${descQ}.`,
      { p: descP, q: descQ },
    );

    // Case 1: Both null
    if (!nodeP && !nodeQ) {
      pushFrame(
        activeNodes,
        "Both Null (Match)",
        2,
        `Both nodes are null. Match! Returning true.`,
        { p: "null", q: "null", match: "true" },
      );
      callStack.pop();
      return true;
    }

    // Case 2: One null, one not
    if (!nodeP || !nodeQ) {
      pushFrame(
        activeNodes,
        "Structural Mismatch",
        3,
        `Structural mismatch: one node is null (${descP}), other is not (${descQ}). Returning false.`,
        { p: descP, q: descQ, match: "false" },
      );
      callStack.pop();
      return false;
    }

    // Case 3: Value mismatch
    if (nodeP.val !== nodeQ.val) {
      pushFrame(
        activeNodes,
        "Value Mismatch",
        4,
        `Value mismatch: ${nodeP.val} !== ${nodeQ.val}. Returning false.`,
        { p: descP, q: descQ, match: "false" },
      );
      callStack.pop();
      return false;
    }

    pushFrame(
      activeNodes,
      "Values Match",
      5,
      `Values match (${nodeP.val} === ${nodeQ.val}). Recursively checking left subtrees.`,
      { p: descP, q: descQ, match: "true" },
    );

    const leftSame = isSame(nodeP.left, nodeQ.left, nodeP.id, nodeQ.id, "left");
    if (!leftSame) {
      callStack.pop();
      return false;
    }

    pushFrame(
      activeNodes,
      "Check Right Subtrees",
      5,
      `Left subtrees match! Now recursively checking right subtrees.`,
      { p: descP, q: descQ },
    );

    const rightSame = isSame(
      nodeP.right,
      nodeQ.right,
      nodeP.id,
      nodeQ.id,
      "right",
    );
    if (!rightSame) {
      callStack.pop();
      return false;
    }

    pushFrame(
      activeNodes,
      "Subtrees Match",
      5,
      `Both left and right subtrees match for Node(${nodeP.val}) and Node(${nodeQ.val}). Returning true.`,
      { p: descP, q: descQ, match: "true" },
    );

    callStack.pop();
    return true;
  }

  const finalResult = isSame(rootP, rootQ, null, null, "root");

  pushFrame(
    [],
    "Finished",
    6,
    `Trees are ${finalResult ? "identical" : "different"}. Returning ${finalResult}.`,
    { result: String(finalResult) },
  );

  return builder.getFrames();
}

export default generateFrames;
