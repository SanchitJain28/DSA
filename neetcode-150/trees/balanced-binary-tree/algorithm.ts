import { TreeNode } from "../intro/algorithm";

function isBalanced(root: TreeNode | null): boolean {
  if (!root) return true;
  let result: boolean = true;
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const left = dfs(node.left);
    const right = dfs(node.right);
    if (Math.abs(left - right) > 1) result = false;
    return 1 + Math.max(left, right);
  }
  dfs(root);
  return result;
}
