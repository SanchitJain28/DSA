import { TreeNode } from "../intro/algorithm";

function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const map = new Map<number, number>();
  for (let i = 0; i < inorder.length; i++) map.set(inorder[i], i);

  function dfs(
    preStart: number,
    preEnd: number,
    inStart: number,
    inEnd: number,
  ): TreeNode | null {
    if (preStart > preEnd) return null;

    const rootVal = preorder[preStart];
    const node = new TreeNode(rootVal);
    const mid = map.get(rootVal)!;
    const leftSize = mid - inStart;

    node.left = dfs(preStart + 1, preStart + leftSize, inStart, mid - 1);
    node.right = dfs(preStart + leftSize + 1, preEnd, mid + 1, inEnd);

    return node;
  }

  return dfs(0, preorder.length - 1, 0, inorder.length - 1);
}
