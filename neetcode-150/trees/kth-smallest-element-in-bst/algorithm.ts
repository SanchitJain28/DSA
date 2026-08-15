import { TreeNode } from "../intro/algorithm";

function kthSmallest(root: TreeNode | null, k: number): number {
  let count = 0,
    result = 0;

  function dfs(node: TreeNode | null) {
    if (!node) return;
    dfs(node.left);
    count++;
    if (count === k) {
      result = node.val;
      return;
    }
    dfs(node.right);
  }

  dfs(root);
  return result;
}
function testKthSmallest(): number {
  const root = new TreeNode(5);

  root.left = new TreeNode(3);
  root.right = new TreeNode(7);

  root.left.left = new TreeNode(2);
  root.left.right = new TreeNode(4);

  root.right.left = new TreeNode(6);
  root.right.right = new TreeNode(8);

  return kthSmallest(root, 3);
}

console.log(testKthSmallest()); // 4
