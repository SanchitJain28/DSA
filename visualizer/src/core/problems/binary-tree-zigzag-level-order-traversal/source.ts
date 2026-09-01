import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function zigzagLevelOrder(root) {" },
  { line: 2, text: "  if (!root) return [];" },
  { line: 3, text: "  const queue = [root];" },
  { line: 4, text: "  const result = [];" },
  { line: 5, text: "  let leftToRight = true;" },
  { line: 6, text: "  while (queue.length > 0) {" },
  { line: 7, text: "    const levelSize = queue.length;" },
  { line: 8, text: "    const currentLevel = [];" },
  { line: 9, text: "    for (let i = 0; i < levelSize; i++) {" },
  { line: 10, text: "      const node = queue.shift();" },
  { line: 11, text: "      if (leftToRight) currentLevel.push(node.val);" },
  { line: 12, text: "      else currentLevel.unshift(node.val);" },
  { line: 13, text: "      if (node.left) queue.push(node.left);" },
  { line: 14, text: "      if (node.right) queue.push(node.right);" },
  { line: 15, text: "    }" },
  { line: 16, text: "    result.push(currentLevel);" },
  { line: 17, text: "    leftToRight = !leftToRight;" },
  { line: 18, text: "  }" },
  { line: 19, text: "  return result;" },
  { line: 20, text: "}" },
];

export default source;
