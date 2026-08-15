export const levelOrderCode = [
  { line: 1, text: "function levelOrder(root: TreeNode | null): number[][] {" },
  { line: 2, text: "  if (!root) return [];" },
  { line: 3, text: "  const queue: TreeNode[] = [root];" },
  { line: 4, text: "  const result: number[][] = [];" },
  { line: 5, text: "  while (queue.length) {" },
  { line: 6, text: "    const levelSize = queue.length;" },
  { line: 7, text: "    const level: number[] = [];" },
  { line: 8, text: "    for (let i = 0; i < levelSize; i++) {" },
  { line: 9, text: "      const node = queue.shift();" },
  { line: 10, text: "      level.push(node.val);" },
  { line: 11, text: "      if (node.left) queue.push(node.left);" },
  { line: 12, text: "      if (node.right) queue.push(node.right);" },
  { line: 13, text: "    }" },
  { line: 14, text: "    result.push(level);" },
  { line: 15, text: "  }" },
  { line: 16, text: "  return result;" },
  { line: 17, text: "}" }
];
