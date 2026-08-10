import { TreeNode } from "../../algorithm";

function preorder(root: TreeNode | null): number[] {
  //? Intialize the result
  const result: number[] = [];
  //? If we reach end of node left , we go right , it will return , and call stack will move up
  function dfs(node: TreeNode | null) {
    if (!node) return;
    //? push the value
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return result;
}
