import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder } from "../../structures/tree/helpers";
import { computeTreeLayoutWithOffset } from "../../structures/tree/layout";

export function generateFrames(data: {
  root: (number | null)[];
  subRoot: (number | null)[];
}): Scene[] {
  const rootArr = data.root || [];
  const subRootArr = data.subRoot || [];
  const builder = new FrameBuilder<Scene>();

  const root = buildTreeFromLevelOrder(rootArr);
  const subRoot = buildTreeFromLevelOrder(subRootArr);

  const callStack: string[] = [];

  const layoutRoot = computeTreeLayoutWithOffset(root, 180, 50, "r-", 80);
  const layoutSub = computeTreeLayoutWithOffset(subRoot, 460, 50, "s-", 60);

  const combinedLayout = {
    nodes: [...layoutRoot.nodes, ...layoutSub.nodes],
    edges: [...layoutRoot.edges, ...layoutSub.edges],
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
    `Start isSubtree: checking if subRoot tree is a subtree of root.`,
    { result: "checking" },
  );

  function isSame(
    nodeP: TreeNode | null,
    nodeQ: TreeNode | null,
    parentIdP: string | null,
    parentIdQ: string | null,
    side: string,
  ): boolean {
    const idP = nodeP
      ? `r-${nodeP.id}`
      : parentIdP
        ? `r-${parentIdP}-${side}-null`
        : "r-null";
    const idQ = nodeQ
      ? `s-${nodeQ.id}`
      : parentIdQ
        ? `s-${parentIdQ}-${side}-null`
        : "s-null";

    const descP = nodeP ? `Node(${nodeP.val})` : "null";
    const descQ = nodeQ ? `Node(${nodeQ.val})` : "null";

    pushFrame(
      [idP, idQ],
      "Compare Subtree Nodes",
      3,
      `Comparing root node ${descP} with subRoot node ${descQ}.`,
      { mainNode: descP, subNode: descQ },
    );

    if (!nodeP && !nodeQ) return true;
    if (!nodeP || !nodeQ) return false;
    if (nodeP.val !== nodeQ.val) return false;

    return (
      isSame(nodeP.left, nodeQ.left, nodeP.id, nodeQ.id, "left") &&
      isSame(nodeP.right, nodeQ.right, nodeP.id, nodeQ.id, "right")
    );
  }

  function checkSubtree(node: TreeNode | null): boolean {
    if (!node) {
      callStack.push("isSubtree(null)");
      pushFrame([], "Base Case (Null)", 2, `Node in main tree is null. Returning false.`);
      callStack.pop();
      return false;
    }

    callStack.push(`isSubtree(${node.val})`);
    const id = `r-${node.id}`;

    pushFrame(
      [id],
      "Candidate Root",
      3,
      `Testing if subtree rooted at Node(${node.val}) matches subRoot.`,
      { candidateRoot: node.val },
    );

    if (isSame(node, subRoot, null, null, "root")) {
      pushFrame(
        [id],
        "Subtree Matched",
        3,
        `Subtree match found at Node(${node.val})! Returning true.`,
        { matched: "true" },
      );
      callStack.pop();
      return true;
    }

    pushFrame(
      [id],
      "Check Left Subtree",
      4,
      `Node(${node.val}) did not match. Checking left child of Node(${node.val}).`,
      { candidateRoot: node.val },
    );
    if (checkSubtree(node.left)) {
      callStack.pop();
      return true;
    }

    pushFrame(
      [id],
      "Check Right Subtree",
      4,
      `Left subtree of Node(${node.val}) did not match. Checking right child of Node(${node.val}).`,
      { candidateRoot: node.val },
    );
    if (checkSubtree(node.right)) {
      callStack.pop();
      return true;
    }

    callStack.pop();
    return false;
  }

  const finalResult = checkSubtree(root);

  pushFrame(
    [],
    "Finished",
    5,
    `Subtree check finished! Result: ${finalResult}.`,
    { result: String(finalResult) },
  );

  return builder.getFrames();
}

export default generateFrames;
