import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";
import { FrameBuilder } from "@/core/shared/FrameBuilder";

export function buildPathSumIITree(): TreeNode {
  const n7 = new TreeNode(7, "n7");
  const n2 = new TreeNode(2, "n2");
  const n5_leaf = new TreeNode(5, "n5_leaf");
  const n1 = new TreeNode(1, "n1");

  const n11 = new TreeNode(11, "n11", n7, n2);
  const n13 = new TreeNode(13, "n13");
  const n4_right = new TreeNode(4, "n4_right", n5_leaf, n1);

  const n4_left = new TreeNode(4, "n4_left", n11);
  const n8 = new TreeNode(8, "n8", n13, n4_right);

  const root = new TreeNode(5, "root_5", n4_left, n8);
  return root;
}

export function generateFrames(
  root: TreeNode | null,
  targetSum: number
): Frame[] {
  const builder = new FrameBuilder<Frame>();
  const baseLayout = computeLayout(root);

  const result: number[][] = [];
  const traversed: number[] = [];
  const pathNodeIds: string[] = [];

  const getFrameLayout = (activeId: string | null = null, successId: string | null = null) => {
    const layoutCopy = JSON.parse(JSON.stringify(baseLayout));
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

  const getVariables = (sum: number) => ({
    targetSum: String(targetSum),
    sum: String(sum),
    traversed: traversed.length > 0 ? `[${traversed.join(", ")}]` : "[]",
    result: result.length > 0 ? JSON.stringify(result) : "[]",
  });

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: `Initialized pathSumII with targetSum = ${targetSum}.`,
    variables: getVariables(0),
    layout: getFrameLayout(),
  });

  if (!root) {
    builder.pushFrame({
      phase: "Empty Tree",
      codeLine: 2,
      message: "Root is null. Returning empty result [].",
      variables: getVariables(0),
      layout: getFrameLayout(),
    });
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, sum: number) {
    const nodeValStr = node ? String(node.val) : "null";
    builder.pushCall(`dfs(${nodeValStr}, sum=${sum})`);

    const activeId = node ? node.id : null;

    builder.pushFrame({
      activeNodeId: activeId,
      phase: "Enter DFS",
      codeLine: 4,
      message: `Entering dfs for node ${nodeValStr} with incoming sum = ${sum}.`,
      variables: getVariables(sum),
      layout: getFrameLayout(activeId),
    });

    if (!node) {
      builder.pushFrame({
        phase: "Base Case (Null)",
        codeLine: 5,
        message: "Node is null. Returning from recursive call.",
        variables: getVariables(sum),
        layout: getFrameLayout(),
      });
      builder.popCall();
      return;
    }

    // Add node to sum and path
    sum += node.val;
    traversed.push(node.val);
    pathNodeIds.push(node.id);

    builder.pushFrame({
      activeNodeId: node.id,
      phase: "Add to Path",
      codeLine: 6,
      message: `Added node ${node.val} to path. Current sum is ${sum}. Traversed: [${traversed.join(", ")}].`,
      variables: getVariables(sum),
      layout: getFrameLayout(node.id),
    });

    // Check if leaf
    const isLeaf = !node.left && !node.right;
    builder.pushFrame({
      activeNodeId: node.id,
      phase: "Check Leaf",
      codeLine: 8,
      message: `Checking if node ${node.val} is a leaf node. Leaf: ${isLeaf ? "Yes" : "No"}.`,
      variables: getVariables(sum),
      layout: getFrameLayout(node.id),
    });

    if (isLeaf && sum === targetSum) {
      result.push([...traversed]);
      builder.pushFrame({
        activeNodeId: node.id,
        phase: "Found Valid Path!",
        codeLine: 9,
        message: `Leaf reached and sum (${sum}) equals targetSum (${targetSum})! Appended path [${traversed.join(", ")}] to result.`,
        variables: getVariables(sum),
        layout: getFrameLayout(null, node.id),
      });
    } else if (isLeaf) {
      builder.pushFrame({
        activeNodeId: node.id,
        phase: "Leaf Sum Mismatch",
        codeLine: 8,
        message: `Leaf reached, but sum (${sum}) does not equal targetSum (${targetSum}). Path discarded.`,
        variables: getVariables(sum),
        layout: getFrameLayout(node.id),
      });
    }

    // Traverse Left
    if (node.left) {
      builder.pushFrame({
        activeNodeId: node.id,
        phase: "Traverse Left",
        codeLine: 10,
        message: `Recursively calling dfs on left child (${node.left.val}).`,
        variables: getVariables(sum),
        layout: getFrameLayout(node.id),
      });
      dfs(node.left, sum);
    }

    // Traverse Right
    if (node.right) {
      builder.pushFrame({
        activeNodeId: node.id,
        phase: "Traverse Right",
        codeLine: 11,
        message: `Recursively calling dfs on right child (${node.right.val}).`,
        variables: getVariables(sum),
        layout: getFrameLayout(node.id),
      });
      dfs(node.right, sum);
    }

    // Backtracking
    const poppedVal = traversed.pop();
    pathNodeIds.pop();
    sum -= node.val;

    builder.pushFrame({
      activeNodeId: node.id,
      phase: "Backtrack",
      codeLine: 12,
      message: `Backtracking: popped node ${poppedVal} from path. Restored sum to ${sum}.`,
      variables: getVariables(sum),
      layout: getFrameLayout(node.id),
    });

    builder.popCall();
  }

  dfs(root, 0);

  builder.pushFrame({
    phase: "Complete",
    codeLine: 16,
    message: `Search complete. Found ${result.length} valid root-to-leaf path(s): ${JSON.stringify(result)}.`,
    variables: getVariables(0),
    layout: getFrameLayout(),
  });

  return builder.getFrames();
}
