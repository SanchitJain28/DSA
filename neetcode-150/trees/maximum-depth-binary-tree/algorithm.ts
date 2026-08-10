import { TreeNode } from "../intro/algorithm";

function maxDepth(root: TreeNode | null): number {
  let maxDepth: number = 0;
  let currDepth: number = 0;
  function dfs(node: TreeNode | null) {
    if (!node) return;
    currDepth++;
    maxDepth = Math.max(maxDepth, currDepth);
    dfs(node.left);
    dfs(node.right);
    currDepth--;
  }
  dfs(root);
  return maxDepth;
}

function maxDepth_(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth_(root.left), maxDepth_(root.right));
}