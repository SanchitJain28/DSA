import { TreeNode } from "../../algorithm";

function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null) {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    result.push(node.val);
  }
  dfs(root);
  return result;
}
