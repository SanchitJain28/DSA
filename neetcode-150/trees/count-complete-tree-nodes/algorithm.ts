import { TreeNode } from "../intro/algorithm";

function countNodes(root: TreeNode | null, result: number[] = []): number {
  if (!root) return 0;
  let left = root;
  let right = root;
  let leftHeight = 0;
  let rightHeight = 0;
  while (left) {
    left = left.left!;
    leftHeight++;
  }
  while (right) {
    right = right.right!;
    rightHeight++;
  }
  if (leftHeight === rightHeight) return Math.pow(2, leftHeight) - 1;
  return 1 + countNodes(root.left) + countNodes(root.right);
}
