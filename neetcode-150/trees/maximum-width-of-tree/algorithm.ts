import { TreeNode } from "../intro/algorithm";

function widthOfBinaryTree(root: TreeNode | null): number {
  if (!root) return 0;
  let queue: [TreeNode, number][] = [[root, 0]];
  let maxWidth: number = 0;
  while (queue.length) {
    let levelSize = queue.length;
    const startIndex = queue[0][1];
    let first = 0;
    let last = 0;
    for (let i = 0; i < levelSize; i++) {
      const [node, index] = queue.shift()!;
      const normalizedIndex = index - startIndex;

      if (i === 0) first = normalizedIndex;
      if (i === levelSize - 1) last = normalizedIndex;

      if (node.left) queue.push([node.left, 2 * normalizedIndex + 1]);
      if (node.right) queue.push([node.right, 2 * normalizedIndex + 2]);
    }
    maxWidth = Math.max(maxWidth, last - first + 1);
  }
  return maxWidth;
}
