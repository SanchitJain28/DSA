import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function diameterOfBinaryTree(root) {" },
  { line: 2, text: "  let maxDiameter = 0;" },
  { line: 3, text: "  function dfs(node) {" },
  { line: 4, text: "    if (!node) return 0;" },
  { line: 5, text: "    const left = dfs(node.left);" },
  { line: 6, text: "    const right = dfs(node.right);" },
  { line: 7, text: "    maxDiameter = Math.max(maxDiameter, left + right);" },
  { line: 8, text: "    return 1 + Math.max(left, right);" },
  { line: 9, text: "  }" },
  { line: 10, text: "  dfs(root);" },
  { line: 11, text: "  return maxDiameter;" },
  { line: 12, text: "}" },
];

export default source;
