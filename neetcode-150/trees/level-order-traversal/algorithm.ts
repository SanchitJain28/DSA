import { TreeNode } from "../intro/algorithm";

function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const queue: TreeNode[] = [root];
  const result: number[][] = [];
  while (queue.length) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
