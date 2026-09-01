import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function goodNodes(root) {" },
  { line: 2, text: "  let count = 0;" },
  { line: 3, text: "  function dfs(node, maxVal) {" },
  { line: 4, text: "    if (!node) return;" },
  { line: 5, text: "    if (node.val >= maxVal) count++;" },
  { line: 6, text: "    const nextMax = Math.max(maxVal, node.val);" },
  { line: 7, text: "    dfs(node.left, nextMax);" },
  { line: 8, text: "    dfs(node.right, nextMax);" },
  { line: 9, text: "  }" },
  { line: 10, text: "  dfs(root, root.val);" },
  { line: 11, text: "  return count;" },
  { line: 12, text: "}" },
];

export default source;
