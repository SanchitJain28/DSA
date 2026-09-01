import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function rightSideView(root) {" },
  { line: 2, text: "  if (!root) return [];" },
  { line: 3, text: "  const queue = [root];" },
  { line: 4, text: "  const rightView = [];" },
  { line: 5, text: "  while (queue.length > 0) {" },
  { line: 6, text: "    const levelSize = queue.length;" },
  { line: 7, text: "    for (let i = 0; i < levelSize; i++) {" },
  { line: 8, text: "      const node = queue.shift();" },
  { line: 9, text: "      if (i === levelSize - 1) rightView.push(node.val);" },
  { line: 10, text: "      if (node.left) queue.push(node.left);" },
  { line: 11, text: "      if (node.right) queue.push(node.right);" },
  { line: 12, text: "    }" },
  { line: 13, text: "  }" },
  { line: 14, text: "  return rightView;" },
  { line: 15, text: "}" },
];

export default source;
