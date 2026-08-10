import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";
import { FrameBuilder } from "@/core/shared/FrameBuilder";

export function generateFrames(
  root: TreeNode | null,
  targetSum: number,
): Frame[] {
  const builder = new FrameBuilder<Frame>();

  const layout = computeLayout(root);

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 0,
    message: `Initialized hasPathSum with targetSum = ${targetSum}`,
    variables: { targetSum, sum: 0 },
    layout,
  });

  function hasPathSum(
    node: TreeNode | null,
    parentId: string | null,
    side: string,
    currentSum: number,
  ): boolean {
    const id = node ? node.id : parentId ? `${parentId}-${side}-null` : "null";

    return builder.executeCall(
      `hasPathSum(${node?.val ?? "null"}, ${targetSum}, ${currentSum})`,
      () => {
        builder.pushFrame({
          activeNodeId: id,
          phase: "Check Node",
          codeLine: 6,
          message: `Checking node ${node?.val ?? "null"}.`,
          variables: { targetSum, sum: currentSum },
          layout,
        });

        if (!node) {
          builder.pushFrame({
            activeNodeId: id,
            phase: "Base Case (Null)",
            codeLine: 6,
            message: `Reached a null node. This path does not sum to target. Returning false.`,
            variables: { targetSum, sum: currentSum },
            layout,
          });
          return false;
        }

        const nextSum = currentSum + Number(node.val);

        builder.pushFrame({
          activeNodeId: id,
          phase: "Add to Sum",
          codeLine: 7,
          message: `Adding node value ${node.val} to sum. New sum is ${nextSum}.`,
          variables: { targetSum, sum: nextSum },
          layout,
        });

        builder.pushFrame({
          activeNodeId: id,
          phase: "Check Leaf",
          codeLine: 8,
          message: `Checking if node ${node.val} is a leaf node.`,
          variables: { targetSum, sum: nextSum },
          layout,
        });

        if (!node.left && !node.right) {
          const match = nextSum === targetSum;
          builder.pushFrame({
            activeNodeId: id,
            phase: "Leaf Node Found",
            codeLine: 8,
            message: `Node ${node.val} is a leaf! Does ${nextSum} === ${targetSum}? ${match ? "Yes!" : "No."}`,
            variables: { targetSum, sum: nextSum },
            layout,
          });
          return match;
        }

        builder.pushFrame({
          activeNodeId: id,
          phase: "Not a Leaf",
          codeLine: 9,
          message: `Node ${node.val} is not a leaf. Recursively checking left and right children.`,
          variables: { targetSum, sum: nextSum },
          layout,
        });

        const leftResult = hasPathSum(node.left, node.id, "left", nextSum);
        if (leftResult) {
          return true; // Short-circuit, we found a path!
        }

        const rightResult = hasPathSum(node.right, node.id, "right", nextSum);
        return rightResult;
      },
    );
  }

  const result = hasPathSum(root, null, "root", 0);

  builder.pushFrame({
    phase: "Finished",
    codeLine: 13,
    message: `Traversal complete! Path sum ${targetSum} was ${result ? "found" : "not found"}.`,
    variables: { targetSum, sum: "N/A" },
    layout,
  });

  return builder.getFrames();
}
