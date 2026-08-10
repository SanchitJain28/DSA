import { TreeNode } from "../intro/algorithm";

function hasPathSum(
  root: TreeNode | null,
  targetSum: number,
  sum: number = 0,
): boolean {
  if (!root) return false;
  sum += root.val;
  if (!root.left && !root.right) return sum === targetSum;
  return (
    hasPathSum(root.left, targetSum, sum) ||
    hasPathSum(root.right, targetSum, sum)
  );
}
