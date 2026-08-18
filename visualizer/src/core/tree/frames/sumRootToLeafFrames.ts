import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";
import { FrameBuilder } from "@/core/shared/FrameBuilder";

export function buildPreset1Tree(): TreeNode {
  // [4, 9, 0, 5, 1]
  const n5 = new TreeNode(5, "n5");
  const n1 = new TreeNode(1, "n1");
  const n9 = new TreeNode(9, "n9", n5, n1);
  const n0 = new TreeNode(0, "n0");
  const root = new TreeNode(4, "root_4", n9, n0);
  return root;
}

export function buildPreset2Tree(): TreeNode {
  // [1, 2, 3]
  const n2 = new TreeNode(2, "n2");
  const n3 = new TreeNode(3, "n3");
  const root = new TreeNode(1, "root_1", n2, n3);
  return root;
}

export function buildPreset3Tree(): TreeNode {
  // [1, 0]
  const n0 = new TreeNode(0, "n0");
  const root = new TreeNode(1, "root_1", n0, null);
  return root;
}

export function buildPreset4Tree(): TreeNode {
  // [4, 2, 7, 1, 3, 6, 9]
  const n1 = new TreeNode(1, "n1");
  const n3 = new TreeNode(3, "n3");
  const n6 = new TreeNode(6, "n6");
  const n9 = new TreeNode(9, "n9");
  const n2 = new TreeNode(2, "n2", n1, n3);
  const n7 = new TreeNode(7, "n7", n6, n9);
  const root = new TreeNode(4, "root_4", n2, n7);
  return root;
}

export function buildPreset5Tree(): TreeNode {
  // [9]
  return new TreeNode(9, "root_9");
}

export function generateFrames(root: TreeNode | null): Frame[] {
  const builder = new FrameBuilder<Frame>();
  const baseLayout = computeLayout(root);

  const leafNumbers: number[] = [];
  const pathNodes: TreeNode[] = [];

  const getFrameLayout = (activeId: string | null = null, successId: string | null = null) => {
    const layoutCopy = JSON.parse(JSON.stringify(baseLayout));
    const pathNodeIds = pathNodes.map((n) => n.id);
    layoutCopy.nodes.forEach((n: any) => {
      if (n.id === successId) {
        n.status = "success";
      } else if (n.id === activeId) {
        n.status = "active";
      } else if (pathNodeIds.includes(n.id)) {
        n.status = "secondary";
      } else {
        n.status = "default";
      }
    });
    return layoutCopy;
  };

  const getVariables = (curr: number) => {
    const totalSum = leafNumbers.reduce((a, b) => a + b, 0);
    const pathStr = pathNodes.map((n) => n.val).join(" → ");
    return {
      curr: String(curr),
      path: pathStr ? pathStr : "∅",
      leafNumbers: leafNumbers.length > 0 ? `[${leafNumbers.join(", ")}]` : "[]",
      totalSum: String(totalSum),
    };
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Starting Sum Root to Leaf Numbers calculation.",
    variables: getVariables(0),
    layout: getFrameLayout(),
  });

  if (!root) {
    builder.pushFrame({
      phase: "Empty Tree",
      codeLine: 3,
      message: "Tree is empty (root is null). Total sum is 0.",
      variables: getVariables(0),
      layout: getFrameLayout(),
    });
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, curr: number): number {
    const nodeValStr = node ? String(node.val) : "null";
    builder.pushCall(`dfs(${nodeValStr}, curr=${curr})`);

    const activeId = node ? node.id : null;

    builder.pushFrame({
      activeNodeId: activeId,
      phase: "Enter DFS",
      codeLine: 2,
      message: `Entering dfs for node ${nodeValStr} with incoming curr = ${curr}.`,
      variables: getVariables(curr),
      layout: getFrameLayout(activeId),
    });

    if (!node) {
      builder.pushFrame({
        phase: "Base Case (Null)",
        codeLine: 3,
        message: "Node is null. Returning 0.",
        variables: getVariables(curr),
        layout: getFrameLayout(),
      });
      builder.popCall();
      return 0;
    }

    // Accumulate number: curr * 10 + val
    const prevCurr = curr;
    curr = curr * 10 + node.val;
    pathNodes.push(node);

    builder.pushFrame({
      activeNodeId: node.id,
      phase: "Compute Number",
      codeLine: 4,
      message: `Updated curr: (${prevCurr} × 10) + ${node.val} = ${curr}. Path: ${pathNodes.map((n) => n.val).join(" → ")}.`,
      variables: getVariables(curr),
      layout: getFrameLayout(node.id),
    });

    const isLeaf = !node.left && !node.right;

    builder.pushFrame({
      activeNodeId: node.id,
      phase: "Check Leaf",
      codeLine: 5,
      message: `Checking if node ${node.val} is a leaf node. Leaf: ${isLeaf ? "Yes" : "No"}.`,
      variables: getVariables(curr),
      layout: getFrameLayout(node.id),
    });

    if (isLeaf) {
      leafNumbers.push(curr);
      builder.pushFrame({
        activeNodeId: node.id,
        phase: "Leaf Reached",
        codeLine: 5,
        message: `Leaf reached! Completed root-to-leaf number is ${curr}. Total sum is now ${leafNumbers.reduce((a, b) => a + b, 0)}.`,
        variables: getVariables(curr),
        layout: getFrameLayout(null, node.id),
      });

      pathNodes.pop();
      builder.popCall();
      return curr;
    }

    // Traverse Left Subtree
    builder.pushFrame({
      activeNodeId: node.id,
      phase: "Traverse Left",
      codeLine: 6,
      message: `Calling dfs on left child of ${node.val}.`,
      variables: getVariables(curr),
      layout: getFrameLayout(node.id),
    });
    const leftSum = dfs(node.left, curr);

    // Traverse Right Subtree
    builder.pushFrame({
      activeNodeId: node.id,
      phase: "Traverse Right",
      codeLine: 6,
      message: `Calling dfs on right child of ${node.val}.`,
      variables: getVariables(curr),
      layout: getFrameLayout(node.id),
    });
    const rightSum = dfs(node.right, curr);

    const subtreeSum = leftSum + rightSum;

    // Backtrack from current node
    pathNodes.pop();

    builder.pushFrame({
      activeNodeId: node.id,
      phase: "Aggregate Subtree",
      codeLine: 6,
      message: `Subtree at node ${node.val} aggregated: leftSum (${leftSum}) + rightSum (${rightSum}) = ${subtreeSum}. Returning ${subtreeSum}.`,
      variables: getVariables(curr),
      layout: getFrameLayout(node.id),
    });

    builder.popCall();
    return subtreeSum;
  }

  const finalTotal = dfs(root, 0);

  builder.pushFrame({
    phase: "Complete",
    codeLine: 8,
    message: `Finished tree traversal. Total sum of all root-to-leaf numbers is ${finalTotal}.`,
    variables: getVariables(0),
    layout: getFrameLayout(),
  });

  return builder.getFrames();
}
