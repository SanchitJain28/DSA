import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function widthOfBinaryTree(root) {" },
  { line: 2, text: "  if (!root) return 0;" },
  { line: 3, text: "  let maxWidth = 0;" },
  { line: 4, text: "  const queue = [{ node: root, index: 0n }];" },
  { line: 5, text: "  while (queue.length > 0) {" },
  { line: 6, text: "    const levelSize = queue.length;" },
  { line: 7, text: "    const minIndex = queue[0].index;" },
  { line: 8, text: "    let first = 0n, last = 0n;" },
  { line: 9, text: "    for (let i = 0; i < levelSize; i++) {" },
  { line: 10, text: "      const { node, index } = queue.shift();" },
  { line: 11, text: "      const normalized = index - minIndex;" },
  { line: 12, text: "      if (i === 0) first = normalized;" },
  { line: 13, text: "      if (i === levelSize - 1) last = normalized;" },
  { line: 14, text: "      if (node.left) queue.push({ node: node.left, index: 2n * normalized });" },
  { line: 15, text: "      if (node.right) queue.push({ node: node.right, index: 2n * normalized + 1n });" },
  { line: 16, text: "    }" },
  { line: 17, text: "    maxWidth = Math.max(maxWidth, Number(last - first + 1n));" },
  { line: 18, text: "  }" },
  { line: 19, text: "  return maxWidth;" },
  { line: 20, text: "}" },
];

export default source;
