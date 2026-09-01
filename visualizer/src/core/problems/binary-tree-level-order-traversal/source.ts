import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function levelOrder(root) {" },
  { line: 2, text: "  if (!root) return [];" },
  { line: 3, text: "  const queue = [root];" },
  { line: 4, text: "  const result = [];" },
  { line: 5, text: "  while (queue.length > 0) {" },
  { line: 6, text: "    const levelSize = queue.length;" },
  { line: 7, text: "    const currentLevel = [];" },
  { line: 8, text: "    for (let i = 0; i < levelSize; i++) {" },
  { line: 9, text: "      const node = queue.shift();" },
  { line: 10, text: "      currentLevel.push(node.val);" },
  { line: 11, text: "      if (node.left) queue.push(node.left);" },
  { line: 12, text: "      if (node.right) queue.push(node.right);" },
  { line: 13, text: "    }" },
  { line: 14, text: "    result.push(currentLevel);" },
  { line: 15, text: "  }" },
  { line: 16, text: "  return result;" },
  { line: 17, text: "}" },
];

export default source;
